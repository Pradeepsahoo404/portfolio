import { Media, type IMedia } from "../../models/media/media.model.js";
import { BaseRepository } from "../base/base.repository.js";

class MediaRepository extends BaseRepository<IMedia> {
  constructor() {
    super(Media);
  }

  async findByPublicId(publicId: string): Promise<IMedia | null> {
    return this.findOne({ publicId });
  }

  async findByUser(userId: string, options = {}): Promise<ReturnType<BaseRepository<IMedia>["findAll"]>> {
    return this.findAll({
      ...options,
      additionalFilter: { userId },
      sortFields: ["createdAt", "originalName", "bytes"],
      searchFields: ["originalName", "mimeType"],
      filterFields: ["mimeType", "resourceType"],
    });
  }
}

export const mediaRepository = new MediaRepository();
export default mediaRepository;
