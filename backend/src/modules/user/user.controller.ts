import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  static register = async (req: Request, res: Response) => {
    try {
      res.status(201).json(await UserService.createUser(req.body));
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const data = await UserService.login(req.body);
      res.cookie("access_token", data.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json({ user: data.user, success: true });
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  };
  static logout = async (_: Request, res: Response) => {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.json({ success: true, message: "Logged out successfully" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  };

  static getUsers = async (_: Request, res: Response) => {
    res.json(await UserService.getAll());
  };

  static getMe = async (req: Request, res: Response) => {
    res.json(req.user);
  };
}
