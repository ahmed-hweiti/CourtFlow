import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const courts = [
  { name: "Abdoun Football Ground", sport: "Football", location: "Abdoun, Amman", pricePerHour: 25, available: true },
  { name: "Tlaa Al Ali Padel Arena", sport: "Padel", location: "Tlaa Al Ali, Amman", pricePerHour: 20, available: true },
  { name: "Sports City Basketball Court", sport: "Basketball", location: "Al Hussein Sports City, Amman", pricePerHour: 15, available: false },
  { name: "Al Shmesani Tennis Club", sport: "Tennis", location: "Al Shmesani, Amman", pricePerHour: 30, available: true },
  { name: "Sweifieh Indoor Football Hall", sport: "Football", location: "Sweifieh, Amman", pricePerHour: 28, available: false },
  { name: "Al Weibdeh Community Padel Court", sport: "Padel", location: "Al Weibdeh, Amman", pricePerHour: 18, available: true },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.court.deleteMany();
  await prisma.court.createMany({ data: courts });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });