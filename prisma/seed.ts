import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: "asd@gmail.com" },
    update: {},
    create: {
      email: "asd@gmail.com",
      name: "asd",
      password: "12345678",
    },
  });
  console.log("User created:", user);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
