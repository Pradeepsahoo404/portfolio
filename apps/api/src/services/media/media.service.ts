import type { Types } from "mongoose";
import { mediaRepository } from "../../repositories/media/media.repository.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "./cloudinary.service.js";
import { NotFoundError } from "../../errors/index.js";
import type { IMedia } from "../../models/media/media.model.js";

export class MediaService {
  async upload(
    userId: string | Types.ObjectId,
    file: Express.Multer.File
  ): Promise<IMedia> {
    const result = await uploadToCloudinary(file.buffer, file.originalname);

    return mediaRepository.create({
      userId,
      publicId: result.publicId,
      url: result.url,
      secureUrl: result.secureUrl,
      format: result.format,
      resourceType: result.resourceType,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      originalName: file.originalname,
      mimeType: file.mimetype,
    } as never);
  }

  async getById(id: string, userId: string): Promise<IMedia> {
    const media = await mediaRepository.findById(id, { userId } as never);
    if (!media) throw new NotFoundError("Media not found");
    return media;
  }

  async list(userId: string, query: Record<string, unknown> = {}) {
    return mediaRepository.findByUser(userId, query);
  }

  async delete(id: string, userId: string): Promise<void> {
    const media = await this.getById(id, userId);
    await deleteFromCloudinary(media.publicId);
    await mediaRepository.softDelete(id, { userId } as never);
  }
}

export const mediaService = new MediaService();
export default mediaService;
