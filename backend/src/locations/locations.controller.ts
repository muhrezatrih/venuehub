import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationResponseDto, LocationListResponseDto } from './dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * GET /api/locations
   * Get all locations
   */
  @Get()
  async findAll(): Promise<LocationListResponseDto> {
    return this.locationsService.findAll();
  }

  /**
   * GET /api/locations/:id
   * Get location by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LocationResponseDto> {
    const location = await this.locationsService.findOne(id);

    if (!location) {
      throw new NotFoundException(`Location with ID "${id}" not found`);
    }

    return location;
  }
}