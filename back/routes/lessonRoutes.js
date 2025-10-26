// routes/lessonRoutes.js
import express from "express";
import { completeLesson } from "../controllers/lessonController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rota para registrar lição concluída
router.post("/complete", verifyToken, completeLesson);

export default router;
