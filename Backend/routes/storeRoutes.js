// Backend/routes/storeRoutes.js
import express from "express";
import { buyItem } from "../controllers/storeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/buy", verifyToken, buyItem);

export default router;
