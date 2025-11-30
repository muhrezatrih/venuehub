import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// Seed user for audit fields
const SYSTEM_USER = 'system';

// Location seed data
const locations = [
  { name: 'New York' },
  { name: 'Los Angeles' },
  { name: 'Chicago' },
  { name: 'San Francisco' },
  { name: 'Miami' },
  { name: 'Austin' },
  { name: 'Seattle' },
  { name: 'Boston' },
  { name: 'Denver' },
  { name: 'New Orleans' },
];

// Venue seed data (locationName will be mapped to locationId)
const venues = [
  {
    name: 'The Grand Loft',
    image: '/venues/grand-loft.jpg',
    description:
      'An industrial-chic space with exposed brick walls and soaring 20-foot ceilings. Perfect for creative events and product launches.',
    price: 450,
    locationName: 'New York',
    capacityMin: 50,
    capacityMax: 300,
    status: Status.ACTIVE,
  },
  {
    name: 'Sunset Terrace',
    image: '/venues/sunset-terrace.jpg',
    description:
      'Breathtaking rooftop venue with panoramic city views. Features both indoor and outdoor spaces for versatile event planning.',
    price: 350,
    locationName: 'Los Angeles',
    capacityMin: 30,
    capacityMax: 150,
    status: Status.ACTIVE,
  },
  {
    name: 'The Riverfront Hall',
    image: '/venues/riverfront-hall.jpg',
    description:
      'Elegant waterfront venue with floor-to-ceiling windows overlooking the Chicago River. Ideal for corporate galas and weddings.',
    price: 650,
    locationName: 'Chicago',
    capacityMin: 100,
    capacityMax: 500,
    status: Status.ACTIVE,
  },
  {
    name: 'Bay View Studios',
    image: '/venues/bay-view.jpg',
    description:
      'Modern multimedia studio space with state-of-the-art technology. Perfect for conferences, workshops, and creative productions.',
    price: 275,
    locationName: 'San Francisco',
    capacityMin: 20,
    capacityMax: 80,
    status: Status.ACTIVE,
  },
  {
    name: 'Ocean Pavilion',
    image: '/venues/ocean-pavilion.jpg',
    description:
      'Stunning beachfront venue with tropical gardens and ocean breezes. Unforgettable setting for destination events.',
    price: 550,
    locationName: 'Miami',
    capacityMin: 75,
    capacityMax: 400,
    status: Status.ACTIVE,
  },
  {
    name: 'The Warehouse District',
    image: '/venues/warehouse-district.jpg',
    description:
      'Raw, authentic warehouse space with industrial character. A blank canvas for truly creative and unique events.',
    price: 225,
    locationName: 'Austin',
    capacityMin: 40,
    capacityMax: 200,
    status: Status.ACTIVE,
  },
  {
    name: 'Emerald Gardens',
    image: '/venues/emerald-gardens.jpg',
    description:
      'Lush botanical venue surrounded by Pacific Northwest greenery. Indoor-outdoor flow with sustainable design principles.',
    price: 325,
    locationName: 'Seattle',
    capacityMin: 25,
    capacityMax: 120,
    status: Status.ACTIVE,
  },
  {
    name: 'Harbor House',
    image: '/venues/harbor-house.jpg',
    description:
      'Historic maritime building transformed into an elegant event space. Original architectural details with modern amenities.',
    price: 425,
    locationName: 'Boston',
    capacityMin: 60,
    capacityMax: 250,
    status: Status.ACTIVE,
  },
  {
    name: 'Skyline Conference Center',
    image: '/venues/skyline-center.jpg',
    description:
      'Premium corporate venue on the 50th floor with 360-degree city views. Equipped for high-stakes business events.',
    price: 800,
    locationName: 'New York',
    capacityMin: 20,
    capacityMax: 100,
    status: Status.ACTIVE,
  },
  {
    name: 'The Art Gallery',
    image: '/venues/art-gallery.jpg',
    description:
      'Contemporary art space available for private events. Your guests will be surrounded by rotating exhibitions.',
    price: 375,
    locationName: 'Los Angeles',
    capacityMin: 30,
    capacityMax: 150,
    status: Status.ACTIVE,
  },
  {
    name: 'Mountain View Lodge',
    image: '/venues/mountain-lodge.jpg',
    description:
      'Rustic elegance meets modern comfort in this stunning mountain retreat. Perfect for corporate retreats and intimate weddings.',
    price: 395,
    locationName: 'Denver',
    capacityMin: 40,
    capacityMax: 180,
    status: Status.ACTIVE,
  },
  {
    name: 'The Jazz Lounge',
    image: '/venues/jazz-lounge.jpg',
    description:
      'Intimate speakeasy-style venue with a built-in stage and premium sound system. Ideal for live music events and cocktail parties.',
    price: 285,
    locationName: 'New Orleans',
    capacityMin: 25,
    capacityMax: 100,
    status: Status.ACTIVE,
  },
  {
    name: 'Downtown Ballroom',
    image: '/venues/downtown-ballroom.jpg',
    description:
      'Classic ballroom with crystal chandeliers and marble floors. Timeless elegance for galas, weddings, and formal events.',
    price: 750,
    locationName: 'Chicago',
    capacityMin: 150,
    capacityMax: 600,
    status: Status.ACTIVE,
  },
  {
    name: 'Tech Hub Center',
    image: '/venues/tech-hub.jpg',
    description:
      'Modern co-working space convertible for events. High-speed internet, projectors, and flexible seating arrangements.',
    price: 200,
    locationName: 'San Francisco',
    capacityMin: 15,
    capacityMax: 60,
    status: Status.ACTIVE,
  },
  {
    name: 'Coral Bay Resort',
    image: '/venues/coral-bay.jpg',
    description:
      'Luxury resort venue with private beach access. All-inclusive packages available for multi-day events.',
    price: 950,
    locationName: 'Miami',
    capacityMin: 100,
    capacityMax: 350,
    status: Status.PENDING,
  },
  {
    name: 'Historic Theater',
    image: '/venues/historic-theater.jpg',
    description:
      'Beautifully restored 1920s theater with original architecture. Perfect for performances, screenings, and presentations.',
    price: 500,
    locationName: 'Boston',
    capacityMin: 200,
    capacityMax: 800,
    status: Status.INACTIVE,
  },
];

async function main() {
  console.log('Starting database seed...\n');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.venue.deleteMany();
  await prisma.location.deleteMany();
  console.log('Cleared existing data\n');

  // Seed locations
  console.log('Seeding locations...');
  const createdLocations = await Promise.all(
    locations.map((location) =>
      prisma.location.create({
        data: {
          name: location.name,
          createdBy: SYSTEM_USER,
          updatedBy: SYSTEM_USER,
        },
      })
    )
  );
  console.log(`Created ${createdLocations.length} locations\n`);

  // Create location lookup map
  const locationMap = new Map(
    createdLocations.map((loc) => [loc.name, loc.id])
  );

  // Seed venues
  console.log('Seeding venues...');
  const createdVenues = await Promise.all(
    venues.map((venue) => {
      const { locationName, ...venueData } = venue;
      const locationId = locationMap.get(locationName);

      if (!locationId) {
        throw new Error(`Location not found: ${locationName}`);
      }

      return prisma.venue.create({
        data: {
          ...venueData,
          locationId,
          createdBy: SYSTEM_USER,
          updatedBy: SYSTEM_USER,
        },
      });
    })
  );
  console.log(`Created ${createdVenues.length} venues\n`);

  // Summary
  console.log('Seed Summary:');
  console.log(`   • Locations: ${createdLocations.length}`);
  console.log(`   • Venues: ${createdVenues.length}`);
  console.log(`     - Active: ${venues.filter((v) => v.status === Status.ACTIVE).length}`);
  console.log(`     - Pending: ${venues.filter((v) => v.status === Status.PENDING).length}`);
  console.log(`     - Inactive: ${venues.filter((v) => v.status === Status.INACTIVE).length}`);

  console.log('\n Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });