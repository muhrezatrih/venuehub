import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { GetVenuesQueryDto } from './dto';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  async findAll(@Query() query: GetVenuesQueryDto) {
    return this.venuesService.findAll(query);
  }

  @Get(':id/availability')
  async checkAvailability(
    @Param('id') id: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    const result = await this.venuesService.checkAvailability(
      id,
      new Date(checkIn),
      new Date(checkOut),
    );
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const venue = await this.venuesService.findOne(id);

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    return venue;
  }
}