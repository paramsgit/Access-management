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
} from "./file.controller";
import { authMiddleware } from "../auth/middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createFileController);
router.get("/", getFilesWithPermissionController);
router.get("/all", getAllFilesWithPermissionStatusController);
router.get("/:id", readFileController);
router.put("/:id", updateFileController);
router.delete("/:id", deleteFileController);
router.post("/:id/permissions", grantFilePermissionController);
router.delete("/:id/permissions", revokeFilePermissionController);

export default router;
