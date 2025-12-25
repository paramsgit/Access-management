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
      res.json(await UserService.login(req.body));
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  };

  static getUsers = async (_: Request, res: Response) => {
    res.json(await UserService.getAll());
  };
}
