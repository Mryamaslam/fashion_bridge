/**
 * Creates or updates an admin login for the Fashion Bridge International
 * dashboard, stored in the MongoDB `admins` collection.
 *
 * Usage:
 *   npm run create-admin -- --email you@example.com --password "Your$ecret"
 *
 * Requires MONGODB_URI to be set in .env.local.
 */
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function main() {
  config({ path: ".env.local" });

  const email = getArg("email")?.toLowerCase();
  const password = getArg("password");
  if (!email || !password) {
    console.error('Usage: npm run create-admin -- --email you@example.com --password "Your$ecret"');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "fashion_bridge");

  const password_hash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();

  const result = await db.collection("admins").updateOne(
    { email },
    { $set: { email, password_hash, updated_at: now }, $setOnInsert: { created_at: now } },
    { upsert: true }
  );

  console.log(
    result.upsertedCount
      ? `Created admin: ${email}`
      : `Updated password for existing admin: ${email}`
  );

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
