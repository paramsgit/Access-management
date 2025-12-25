import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";
import fileRoutes from "./modules/file/file.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);

export default app;
