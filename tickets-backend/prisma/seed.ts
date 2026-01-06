import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.SQLITE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash =
    '$2b$10$Vz.yrBT8y6NEwbb3AeJRyO7wQ4ky4SIMHxN.qnb0TVeJwHQrm4k0O';
  const userPasswordHash =
    '$2b$10$FT25dWn2GHfzh3CuAs0F3OOAIKT598IIjlH1Cj2VyLPFRVAUvVM5.';

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        email: 'admin@example.com',
        passwordHash: adminPasswordHash,
        role: UserRole.admin,
      },
      {
        id: 2,
        email: 'john@example.com',
        passwordHash: userPasswordHash,
        role: UserRole.user,
      },
      {
        id: 3,
        email: 'jane@example.com',
        passwordHash: userPasswordHash,
        role: UserRole.user,
      },
      {
        id: 4,
        email: 'bob@example.com',
        passwordHash: userPasswordHash,
        role: UserRole.user,
      },
    ],
  });

  console.log('Users done');

  const events = [
    {
      id: 1,
      title: 'Summer Rock Fest',
      location: 'Central Park',
      startsAt: new Date('2025-07-15T00:00:00Z'),
      price: 5000,
      organizerId: 1,
    },
    {
      id: 2,
      title: 'Tech Summit',
      startsAt: new Date('2025-08-20T00:00:00Z'),
      price: 8000,
      organizerId: 2,
    },
    {
      id: 3,
      title: 'Art Night',
      location: 'City Gallery',
      startsAt: new Date('2025-05-10T00:00:00Z'),
      price: 4500,
      organizerId: 3,
    },
    {
      id: 4,
      title: 'Jazz Concert',
      location: 'Moonlight Lounge',
      startsAt: new Date('2025-06-05T00:00:00Z'),
      price: 4000,
      organizerId: 4,
    },
    {
      id: 5,
      title: 'Coding Workshop',
      location: 'Tech Hub',
      startsAt: new Date('2025-04-12T00:00:00Z'),
      price: 5000,
      organizerId: 2,
    },
    {
      id: 6,
      title: 'Food Festival',
      startsAt: new Date('2025-09-18T00:00:00Z'),
      price: 3000,
      organizerId: 1,
    },
    {
      id: 7,
      title: 'Game Jam',
      location: 'Workspace X',
      startsAt: new Date('2025-10-25T00:00:00Z'),
      price: 1000,
      organizerId: 4,
    },
    {
      id: 8,
      title: 'Marathon',
      startsAt: new Date('2025-03-15T00:00:00Z'),
      price: 4000,
      organizerId: 3,
    },
    {
      id: 9,
      title: 'Movie Night',
      location: 'Old Town Cinema',
      startsAt: new Date('2025-02-20T00:00:00Z'),
      price: 1500,
      organizerId: 1,
    },
    {
      id: 10,
      title: 'Yoga Class',
      location: 'Garden',
      startsAt: new Date('2025-05-22T00:00:00Z'),
      price: 2000,
      organizerId: 4,
    },
    {
      id: 11,
      title: 'E-sports Finals',
      location: 'Arena',
      startsAt: new Date('2025-11-30T00:00:00Z'),
      price: 4000,
      organizerId: 1,
    },
    {
      id: 12,
      title: 'Startup Pitch',
      startsAt: new Date('2025-01-15T00:00:00Z'),
      price: 20000,
      organizerId: 2,
    },
    {
      id: 13,
      title: 'Synth Lab',
      location: 'Synth Club',
      startsAt: new Date('2025-08-05T00:00:00Z'),
      price: 5000,
      organizerId: 1,
    },
    {
      id: 14,
      title: 'Photo Walk',
      location: 'Old Docks',
      startsAt: new Date('2025-06-12T00:00:00Z'),
      price: 3000,
      organizerId: 3,
    },
    {
      id: 15,
      title: 'Bootcamp Demo',
      location: 'Academy',
      startsAt: new Date('2025-02-05T00:00:00Z'),
      price: 0,
      organizerId: 2,
    },
    {
      id: 16,
      title: 'Wine Tasting',
      location: 'The Cellar',
      startsAt: new Date('2025-07-20T00:00:00Z'),
      price: 8000,
      organizerId: 1,
    },
    {
      id: 17,
      title: 'Astronomy Night',
      startsAt: new Date('2025-09-12T00:00:00Z'),
      price: 2500,
      organizerId: 4,
    },
    {
      id: 18,
      title: 'Pottery Workshop',
      location: 'Hands Studio',
      startsAt: new Date('2025-10-10T00:00:00Z'),
      price: 6000,
      organizerId: 3,
    },
    {
      id: 19,
      title: 'Dance Off',
      location: 'Ballroom',
      startsAt: new Date('2025-11-20T00:00:00Z'),
      price: 2000,
      organizerId: 1,
    },
    {
      id: 20,
      title: 'Robot Show',
      location: 'Museum',
      startsAt: new Date('2025-06-25T00:00:00Z'),
      price: 1500,
      organizerId: 2,
    },
    {
      id: 21,
      title: 'Mountain Hike',
      location: 'Peak Trail',
      startsAt: new Date('2025-05-15T00:00:00Z'),
      price: 4000,
      organizerId: 4,
    },
    {
      id: 22,
      title: 'Gaming Night',
      location: 'Strategy Hub',
      startsAt: new Date('2025-04-05T00:00:00Z'),
      price: 1500,
      organizerId: 3,
    },
    {
      id: 23,
      title: 'Poetry Slam',
      location: 'Midnight Cafe',
      startsAt: new Date('2025-03-08T00:00:00Z'),
      price: 1000,
      organizerId: 1,
    },
    {
      id: 24,
      title: 'Coffee Class',
      location: 'Roastery',
      startsAt: new Date('2025-02-12T00:00:00Z'),
      price: 4000,
      organizerId: 2,
    },
    {
      id: 25,
      title: 'VR Day',
      location: 'Cyber Realm',
      startsAt: new Date('2025-11-10T00:00:00Z'),
      price: 5000,
      organizerId: 4,
    },
    {
      id: 26,
      title: 'Opera Night',
      location: 'Grand Theater',
      startsAt: new Date('2025-12-20T00:00:00Z'),
      price: 12000,
      organizerId: 1,
    },
  ];

  await prisma.event.createMany({ data: events });

  console.log('Events done');

  await prisma.reservation.createMany({
    data: [
      { userId: 2, eventId: 1, status: 'paid' },
      { userId: 3, eventId: 1, status: 'paid' },
      { userId: 4, eventId: 1, status: 'paid' },
      { userId: 3, eventId: 2, status: 'paid' },
      { userId: 4, eventId: 2, status: 'paid' },
      { userId: 1, eventId: 3, status: 'paid' },
      { userId: 2, eventId: 3, status: 'paid' },
    ],
  });

  console.log('Reservations done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
