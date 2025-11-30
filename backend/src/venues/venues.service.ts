import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  GetVenuesQueryDto,
  VenueResponseDto,
  PaginatedVenuesResponseDto,
} from './dto';
import { Prisma, Status, BookingStatus } from '@prisma/client';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get paginated and filtered venues (only ACTIVE status)
   */
  async findAll(query: GetVenuesQueryDto): Promise<PaginatedVenuesResponseDto> {
    const {
      locationId,
      name,
      capacityMin,
      capacityMax,
      price,
      checkIn,
      checkOut,
      page = 1,
      perPage = 10,
    } = query;

    // Build where clause - only ACTIVE venues
    const where: Prisma.VenueWhereInput = {
      status: Status.ACTIVE,
    };

    // Filter by location ID
    if (locationId) {
      where.locationId = locationId;
    }

    // Filter by name (case-insensitive search)
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    // Filter by capacity
    if (capacityMin !== undefined && capacityMax !== undefined) {
      where.capacityMin = { lte: capacityMin };
      where.capacityMax = { gte: capacityMax };
    } else if (capacityMin !== undefined) {
      where.capacityMin = { lte: capacityMin };
      where.capacityMax = { gte: capacityMin };
    } else if (capacityMax !== undefined) {
      where.capacityMin = { lte: capacityMax };
      where.capacityMax = { gte: capacityMax };
    }

    // Filter by price (max price)
    if (price !== undefined) {
      where.price = { lte: price };
    }

    // Filter by availability (check-in and check-out dates)
    // Exclude venues that have overlapping bookings
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Find venue IDs that have conflicting bookings
      const bookedVenueIds = await this.prisma.booking.findMany({
        where: {
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
          OR: [
            {
              // Booking starts during requested period
              AND: [
                { startDate: { gte: checkInDate } },
                { startDate: { lt: checkOutDate } },
              ],
            },
            {
              // Booking ends during requested period
              AND: [
                { endDate: { gt: checkInDate } },
                { endDate: { lte: checkOutDate } },
              ],
            },
            {
              // Booking spans entire requested period
              AND: [
                { startDate: { lte: checkInDate } },
                { endDate: { gte: checkOutDate } },
              ],
            },
          ],
        },
        select: {
          venueId: true,
        },
        distinct: ['venueId'],
      });

      const bookedIds = bookedVenueIds.map((b) => b.venueId);

      // Exclude booked venues
      if (bookedIds.length > 0) {
        where.id = {
          notIn: bookedIds,
        };
      }
    }

    // Get total count for pagination
    const totalItems = await this.prisma.venue.count({ where });

    // Fetch venues with pagination
    const venues = await this.prisma.venue.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    });

    // Transform to response DTO
    const data: VenueResponseDto[] = venues.map((venue) => ({
      id: venue.id,
      name: venue.name,
      image: venue.image,
      description: venue.description,
      price: venue.price,
      locationId: venue.locationId,
      locationName: venue.location.name,
      capacityMin: venue.capacityMin,
      capacityMax: venue.capacityMax,
    }));

    // Calculate pagination
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        perPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get a single venue by ID (only if ACTIVE)
   */
  async findOne(id: string): Promise<VenueResponseDto | null> {
    const venue = await this.prisma.venue.findFirst({
      where: {
        id,
        status: Status.ACTIVE,
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!venue) {
      return null;
    }

    return {
      id: venue.id,
      name: venue.name,
      image: venue.image,
      description: venue.description,
      price: venue.price,
      locationId: venue.locationId,
      locationName: venue.location.name,
      capacityMin: venue.capacityMin,
      capacityMax: venue.capacityMax,
    };
  }

  /**
 * Check if a venue is available for the given dates
 */
async checkAvailability(
  venueId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<{ available: boolean; venueId: string; checkIn: Date; checkOut: Date }> {
  // First check if venue exists and is active
  const venue = await this.prisma.venue.findFirst({
    where: {
      id: venueId,
      status: Status.ACTIVE,
    },
  });

  if (!venue) {
    return {
      available: false,
      venueId,
      checkIn,
      checkOut,
    };
  }

  // Check for conflicting bookings
  const conflictingBooking = await this.prisma.booking.findFirst({
    where: {
      venueId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      },
      OR: [
        {
          // Booking starts during requested period
          AND: [
            { startDate: { gte: checkIn } },
            { startDate: { lt: checkOut } },
          ],
        },
        {
          // Booking ends during requested period
          AND: [
            { endDate: { gt: checkIn } },
            { endDate: { lte: checkOut } },
          ],
        },
        {
          // Booking spans entire requested period
          AND: [
            { startDate: { lte: checkIn } },
            { endDate: { gte: checkOut } },
          ],
        },
      ],
    },
  });

  return {
    available: !conflictingBooking,
    venueId,
    checkIn,
    checkOut,
  };
}
}