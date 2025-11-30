import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  BookingSuccessResponseDto,
} from './dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * POST /api/bookings
   * Create a new booking
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBookingDto: CreateBookingDto
  ): Promise<BookingSuccessResponseDto> {
    const booking = await this.bookingsService.create(createBookingDto);

    return {
      success: true,
      message: 'Booking created successfully! We will contact you shortly to confirm your reservation.',
      data: booking,
    };
  }

  /**
   * GET /api/bookings/:id
   * Get booking by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookingSuccessResponseDto> {
    const booking = await this.bookingsService.findOne(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return {
      success: true,
      message: 'Booking retrieved successfully',
      data: booking,
    };
  }
}