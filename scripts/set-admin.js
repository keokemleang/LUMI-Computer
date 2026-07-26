// Promotes an existing user (already registered through the app) to admin.
// Usage: bun run scripts/set-admin.js you@example.com
import { db } from "../src/lib/db";

const email = process.argv[2]?.trim().toLowerCase();

async function main() {
  if (!email) {
    console.error("Usage: bun run scripts/set-admin.js <email>");
    process.exit(1);
  }
  const user = await db.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    console.error(`No user found with email ${email}. Register through the app first.`);
    process.exit(1);
  }
  await db.user.update({
    where: {
      email
    },
    data: {
      role: "admin"
    }
  });
  console.log(`${email} is now an admin.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});
