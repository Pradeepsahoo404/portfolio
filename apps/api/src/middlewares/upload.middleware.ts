import multer from "multer";
import { uploadConfig } from "../config/index.js";
import { BadRequestError } from "../errors/index.js";
import { isAllowedMimeType } from "../utils/file.util.js";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!isAllowedMimeType(file.mimetype)) {
    return cb(new BadRequestError(`File type ${file.mimetype} is not allowed`));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: uploadConfig.maxFileSize },
  fileFilter,
});

export const singleUpload = upload.single("file");
export const multipleUpload = upload.array("files", 10);

export default upload;
