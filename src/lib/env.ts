/** MongoDB connection string, e.g. from a MongoDB Atlas cluster */
export function getMongoUri(): string {
  return process.env.MONGODB_URI ?? "";
}

export function getMongoDbName(): string {
  return process.env.MONGODB_DB_NAME || "fashion_bridge";
}

export function isMongoConfigured(): boolean {
  return !!getMongoUri();
}

/** Secret used to sign admin session JWTs — generate a long random string */
export function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "";
}

export function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  };
}

export function isCloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return !!(cloudName && apiKey && apiSecret);
}
