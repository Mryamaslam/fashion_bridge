import { MongoClient, type Db } from "mongodb";
import { getMongoDbName, getMongoUri, isMongoConfigured } from "@/lib/env";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(getMongoUri());
    globalThis._mongoClientPromise = client.connect();
  }
  return globalThis._mongoClientPromise;
}

/** Returns the app database, or null when MONGODB_URI isn't set (mock data is used instead). */
export async function getDb(): Promise<Db | null> {
  if (!isMongoConfigured()) return null;
  const client = await getClientPromise();
  return client.db(getMongoDbName());
}
