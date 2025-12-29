import express from "express";
import { downloadReceipt } from "../controllers/receiptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Download receipt - Protected route
router.get("/:id", protect, downloadReceipt);

export default router;
