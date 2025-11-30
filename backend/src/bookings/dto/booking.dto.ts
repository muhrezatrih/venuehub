import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsInt,
  IsDate,
  IsNotEmpty,
  Min,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

/**
 * DTO for creating a new booking
 */
export class CreateBookingDto {
  @IsString()
  @IsNotEmpty({ message: 'Venue ID is required' })
  venueId: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  @MinLength(2, { message: 'Company name must be at least 2 characters' })
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  companyName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @Type(() => Date)
  @IsDate({ message: 'Start date must be a valid date' })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'End date must be a valid date' })
  @IsNotEmpty({ message: 'End date is required' })
  endDate: Date;

  @Type(() => Number)
  @IsInt({ message: 'Attendee count must be a whole number' })
  @Min(1, { message: 'Attendee count must be at least 1' })
  @IsNotEmpty({ message: 'Attendee count is required' })
  attendeeCount: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}

/**
 * Response DTO for booking
 */
export class BookingResponseDto {
  id: string;
  venueId: string;
  venueName: string;
  companyName: string;
  email: string;
  startDate: Date;
  endDate: Date;
  attendeeCount: number;
  status: string;
  totalPrice: number | null;
  notes: string | null;
  createdAt: Date;
}

/**
 * Success response wrapper
 */
export class BookingSuccessResponseDto {
  success: boolean;
  message: string;
  data: BookingResponseDto;
}

/**
 * Error response wrapper
 */
export class BookingErrorResponseDto {
  success: boolean;
  message: string;
  errors?: string[];
}