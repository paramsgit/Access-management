import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../auth/middleware";

const router = Router();

router.use(authMiddleware);
router.get("/me", UserController.getMe);
router.get("/", UserController.getUsers);

export default router;
