import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });
async function main() {
  const admin = await prisma.invitation.create({
    data: {
      email: "farida.adamu.eboreime@gmail.com",
      role: "ADMIN",
      token: "some-random-token",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      used: false,
    },
  });

  console.log({ admin });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
