// Backend/routes/userRoutes.js
import express from "express";
import { getUserProfile, updateUserXP } from "../controllers/userController.js";

const router = express.Router();

// Rotas de usuário
router.get("/:id", getUserProfile);
router.put("/:id/xp", updateUserXP);

export default router;
