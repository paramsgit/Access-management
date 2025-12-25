import prisma from "../../db/prisma";
import { CreateUserDTO, LoginDTO } from "./user.types";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

export class UserService {
  static async createUser(data: CreateUserDTO) {
    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) throw new Error("User already exists");

    const password = await hashPassword(data.password);
    return prisma.user.create({
      data: { ...data, password },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  static async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await comparePassword(data.password, user.password)))
      throw new Error("Invalid credentials");

    return {
      token: generateToken({ userId: user.id }),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  static async getAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }
}
