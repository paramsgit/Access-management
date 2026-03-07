import { Request } from "express";

export default class TokenExtractor {
  static getToken(req: Request): string | null {
    if (req.cookies?.access_token) {
      return req.cookies.access_token;
    }

    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [type, token] = authHeader.split(" ");

      if (type === "Bearer" && token) {
        return token;
      }
    }

    return null;
  }
}
