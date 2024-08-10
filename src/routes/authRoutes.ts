import { Router } from "express";
import authController from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/refesh-token", authController.refreshToken);

export default authRoutes;
