import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../../config/index.js";
import { logger } from "../../utils/logger.util.js";

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
  secure: true,
});

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  originalName: string,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const uploadFolder = folder ?? cloudinaryConfig.folder;

  return new Promise((resolve, reject) => {
    const isPdf = originalName.toLowerCase().endsWith(".pdf");
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: uploadFolder,
        resource_type: isPdf ? "raw" : "auto",
        public_id: `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}${isPdf ? ".pdf" : ""}`,
      },
      (error, result) => {
        if (error || !result) {
          logger.error("Cloudinary upload failed", { error });
          return reject(error ?? new Error("Upload failed"));
        }

        const fileExt = originalName.split('.').pop() || "raw";
        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          format: result.format || fileExt || "raw",
          resourceType: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error(`Failed to delete from Cloudinary: ${publicId}`, { error });
    throw error;
  }
}

export { cloudinary };
