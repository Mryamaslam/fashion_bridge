import { getCloudinary } from "@/lib/cloudinary/client";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
}

/** Uploads a File (image or video) to Cloudinary under the given folder. */
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<CloudinaryUploadResult> {
  const cloudinary = getCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());
  const resourceType = file.type.startsWith("video/") ? "video" : "image";

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    bytes: number;
    format: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `fashion-bridge/${folder}`, resource_type: resourceType },
      (error, uploadResult) => {
        if (error || !uploadResult) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve(uploadResult as typeof result);
      }
    );
    stream.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    format: result.format,
  };
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "video" = "image") {
  const cloudinary = getCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
