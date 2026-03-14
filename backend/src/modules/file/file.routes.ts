import { Router } from "express";
import {
  createFileController,
  readFileController,
  updateFileController,
  deleteFileController,
  grantFilePermissionController,
  revokeFilePermissionController,
  getFilesWithPermissionController,
  getAllFilesWithPermissionStatusController,
  updateFileDataController,
} from "./file.controller";
import { authMiddleware } from "../auth/middleware";
import {
  createFileSchema,
  updateFileContent,
  updateFileSchema,
} from "./file.validator";
import { validate } from "../../utils/validate";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createFileSchema), createFileController);
router.get("/", getFilesWithPermissionController);
router.get("/all", getAllFilesWithPermissionStatusController);
router.get("/:id", readFileController);
router.put("/:id", validate(updateFileSchema), updateFileController);
router.post("/:id/data", validate(updateFileContent), updateFileDataController);
router.delete("/:id", deleteFileController);
router.post("/:id/permissions", grantFilePermissionController);
router.delete("/:id/permissions", revokeFilePermissionController);

export default router;
