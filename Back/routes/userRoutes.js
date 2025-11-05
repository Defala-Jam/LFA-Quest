// Backend/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserXP,
  updateUserPreferences,
} from "../controllers/userController.js";

const router = express.Router();

// Rotas de usuário
router.get("/:id", getUserProfile);
router.put("/:id/xp", updateUserXP);
router.put("/:id/preferences", updateUserPreferences); // 🟢 nova rota

export default router;
