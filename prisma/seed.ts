import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

loadEnvConfig(process.cwd());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.problem.createMany({
    data: [
      {
        title: "Parking Lot",
        description:
          "Design a parking lot system that can manage parking spots, vehicles, entry, exit, and parking fees.",
        requirements:
          "Support different vehicle types. Assign suitable parking spots. Track occupied and available spots. Handle vehicle entry and exit. Calculate parking fees.",
      },
      {
        title: "Library Management System",
        description:
          "Design a library management system that allows members to search, borrow, and return books.",
        requirements:
          "Support books and members. Allow searching for books. Members can borrow and return books. Track availability. Handle borrowing limits and overdue books.",
      },
      {
        title: "Movie Ticket Booking",
        description:
          "Design a movie ticket booking system where users can browse movies, select shows, choose seats, and make bookings.",
        requirements:
          "Support movies, theatres, shows, and seats. Users can view available seats. Prevent double booking. Allow users to book seats for a show. Track booking status.",
      },
    ],
  });

  console.log("Problems seeded successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
