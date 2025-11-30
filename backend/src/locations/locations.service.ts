import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { LocationResponseDto, LocationListResponseDto } from './dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<LocationListResponseDto> {
    const locations = await this.prisma.location.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      data: locations,
      total: locations.length,
    };
  }

  async findOne(id: string): Promise<LocationResponseDto | null> {
    const location = await this.prisma.location.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    return location;
  }
}