import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateBookingDto, BookingResponseDto } from './dto';
import { Status, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new booking with comprehensive validation
   */
  async create(dto: CreateBookingDto): Promise<BookingResponseDto> {
    const { venueId, companyName, email, startDate, endDate, attendeeCount, notes } = dto;

    // Convert dates to Date objects if they're strings
    const start = new Date(startDate);
    const end = new Date(endDate);

    // ========================================
    // VALIDATION 1: Date validations
    // ========================================
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // Check if start date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Check if end date is after start date
    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check if booking duration is reasonable (max 30 days)
    const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    if (end.getTime() - start.getTime() > maxDuration) {
      throw new BadRequestException('Booking duration cannot exceed 30 days');
    }

    // Check if booking is not too far in advance (max 1 year)
    const maxAdvance = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
    if (start.getTime() - today.getTime() > maxAdvance) {
      throw new BadRequestException('Cannot book more than 1 year in advance');
    }

    // ========================================
    // VALIDATION 2: Venue exists and is active
    // ========================================
    const venue = await this.prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (venue.status !== Status.ACTIVE) {
      throw new BadRequestException(
        'This venue is not available for booking. Please choose another venue.'
      );
    }

    // ========================================
    // VALIDATION 3: Attendee count within capacity
    // ========================================
    if (attendeeCount < venue.capacityMin) {
      throw new BadRequestException(
        `Minimum attendee count for this venue is ${venue.capacityMin}`
      );
    }

    if (attendeeCount > venue.capacityMax) {
      throw new BadRequestException(
        `Maximum capacity for this venue is ${venue.capacityMax} attendees`
      );
    }

    // ========================================
    // VALIDATION 4: No double booking
    // ========================================
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        venueId,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
        OR: [
          {
            // New booking starts during existing booking
            AND: [
              { startDate: { lte: start } },
              { endDate: { gt: start } },
            ],
          },
          {
            // New booking ends during existing booking
            AND: [
              { startDate: { lt: end } },
              { endDate: { gte: end } },
            ],
          },
          {
            // New booking completely contains existing booking
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        'This venue is already booked for the selected dates. Please choose different dates.'
      );
    }

    // ========================================
    // VALIDATION 5: Email domain validation (basic)
    // ========================================
    const emailDomain = email.split('@')[1];
    const blockedDomains = ['test.com', 'example.com', 'fake.com'];
    if (blockedDomains.includes(emailDomain?.toLowerCase())) {
      throw new BadRequestException('Please use a valid business email address');
    }

    // ========================================
    // Calculate total price
    // ========================================
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * venue.price;

    // ========================================
    // Create the booking
    // ========================================
    const booking = await this.prisma.booking.create({
      data: {
        venueId,
        companyName: companyName.trim(),
        email: email.toLowerCase().trim(),
        startDate: start,
        endDate: end,
        attendeeCount,
        totalPrice,
        notes: notes?.trim() || null,
        status: BookingStatus.PENDING,
      },
      include: {
        venue: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      id: booking.id,
      venueId: booking.venueId,
      venueName: booking.venue.name,
      companyName: booking.companyName,
      email: booking.email,
      startDate: booking.startDate,
      endDate: booking.endDate,
      attendeeCount: booking.attendeeCount,
      status: booking.status,
      totalPrice: booking.totalPrice,
      notes: booking.notes,
      createdAt: booking.createdAt,
    };
  }

  /**
   * Get booking by ID
   */
  async findOne(id: string): Promise<BookingResponseDto | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        venue: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return null;
    }

    return {
      id: booking.id,
      venueId: booking.venueId,
      venueName: booking.venue.name,
      companyName: booking.companyName,
      email: booking.email,
      startDate: booking.startDate,
      endDate: booking.endDate,
      attendeeCount: booking.attendeeCount,
      status: booking.status,
      totalPrice: booking.totalPrice,
      notes: booking.notes,
      createdAt: booking.createdAt,
    };
  }

  /**
   * Check venue availability for given dates
   */
  async checkAvailability(
    venueId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        venueId,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gt: startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
          {
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          },
        ],
      },
    });

    return !existingBooking;
  }
}