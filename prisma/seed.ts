import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@pubafric.com";
const ADMIN_PASSWORD = "AdminPubafric123";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log("Admin account already exists:", ADMIN_EMAIL);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.create({
    data: {
      role: "ADMIN",
      name: "Administrateur PubAFric",
      email: ADMIN_EMAIL,
      passwordHash,
    },
  });

  console.log("Admin account created:");
  console.log("  email:", ADMIN_EMAIL);
  console.log("  password:", ADMIN_PASSWORD);
  console.log("  (change this password after first login in production)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
