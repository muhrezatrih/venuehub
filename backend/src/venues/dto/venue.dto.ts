import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, IsNumber, IsDate, Min } from 'class-validator';

/**
 * Query parameters for filtering and paginating venues
 */
export class GetVenuesQueryDto {
  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacityMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacityMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  checkIn?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  checkOut?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number = 10;
}

/**
 * Response DTO for a single venue
 */
export class VenueResponseDto {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  price: number;
  locationId: string;
  locationName: string;
  capacityMin: number;
  capacityMax: number;
}

/**
 * Pagination metadata
 */
export class PaginationDto {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response wrapper
 */
export class PaginatedVenuesResponseDto {
  data: VenueResponseDto[];
  pagination: PaginationDto;
}