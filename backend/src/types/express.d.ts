declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: "ADMIN" | "USER";
      profile?: any;
    };
  }
}
