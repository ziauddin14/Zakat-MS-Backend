import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
} from "../controllers/campaignController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);

// Admin routes
router.post("/", protect, isAdmin, createCampaign);

export default router;
