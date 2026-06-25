import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Promotes any users whose email is in ADMIN_EMAILS to the ADMIN role.
// Run with: npm run db:seed
async function main() {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    console.log("No ADMIN_EMAILS set — nothing to seed.");
    return;
  }

  const result = await prisma.user.updateMany({
    where: { email: { in: adminEmails } },
    data: { role: "ADMIN" },
  });
  console.log(`Promoted ${result.count} user(s) to ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
