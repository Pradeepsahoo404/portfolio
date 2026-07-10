import { Router } from "express";
import { mediaController } from "../../controllers/media.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { singleUpload } from "../../middlewares/upload.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.constants.js";
import { objectIdValidator, paginationValidator } from "../../validators/auth.validator.js";

const router = Router();

router.use(authenticate);

router.post(
  "/upload",
  authorize(PERMISSIONS.MEDIA_UPLOAD),
  singleUpload,
  mediaController.upload
);

router.get(
  "/",
  authorize(PERMISSIONS.MEDIA_READ),
  validate(paginationValidator),
  mediaController.list
);

router.get(
  "/:id",
  authorize(PERMISSIONS.MEDIA_READ),
  validate(objectIdValidator),
  mediaController.getById
);

router.delete(
  "/:id",
  authorize(PERMISSIONS.MEDIA_DELETE),
  validate(objectIdValidator),
  mediaController.delete
);

export default router;
