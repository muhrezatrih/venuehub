import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { LocationsModule } from './locations';
import { VenuesModule } from './venues';
import { BookingsModule } from './bookings';

@Module({
  imports: [PrismaModule, LocationsModule, VenuesModule, BookingsModule],
})
export class AppModule {}