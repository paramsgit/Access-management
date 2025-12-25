import { Request, Response } from "express";

import {
  createFileUseCase,
  readFileUseCase,
  updateFileUseCase,
  deleteFileUseCase,
  grantFilePermissionUseCase,
  revokeFilePermissionUseCase,
} from "./file.dependencies";
import { asyncHandler } from "../../utils/asyncHandler";

// POST /api/files
export const createFileController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createFileUseCase.execute(req.user, {
      fileName: req.body.fileName,
      fileType: req.body.fileType,
      fileUrl: req.body.fileUrl,
    });

    res.status(201).json(result);
  }
);

// GET /api/files/:id
export const readFileController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await readFileUseCase.execute(req.user, req.params.id);
    res.json(result);
  }
);

// PUT /api/files/:id
export const updateFileController = async (req: Request, res: Response) => {
  const result = await updateFileUseCase.execute(
    req.user,
    req.params.id,
    req.body
  );

  res.json(result);
};

// DELETE /api/files/:id
export const deleteFileController = async (req: Request, res: Response) => {
  const result = await deleteFileUseCase.execute(req.user, req.params.id);
  res.json(result);
};

export const grantFilePermissionController = asyncHandler(async (req, res) => {
  const { targetUserId, permission } = req.body;

  const result = await grantFilePermissionUseCase.execute(
    req.user,
    req.params.id,
    targetUserId,
    permission
  );

  res.json(result);
});

export const revokeFilePermissionController = asyncHandler(async (req, res) => {
  const { targetUserId, permission } = req.body;

  const result = await revokeFilePermissionUseCase.execute(
    req.user,
    req.params.id,
    targetUserId,
    permission
  );

  res.json(result);
});
