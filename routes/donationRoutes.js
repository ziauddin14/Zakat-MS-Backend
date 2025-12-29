import express from "express";
import {
  createDonation,
  getMyDonations,
  getDonationById,
  updateDonationStatus,
  getDonationsByUser,
} from "../controllers/donationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create donation
router.post("/", protect, createDonation);

// Get all donations (Admin) or user's own (if query filter applied or logic in controller)
router.get("/", protect, getDonationsByUser);

// Get logged in user's donations
router.get("/my", protect, getMyDonations);

// Update donation status (Admin)
router.put("/:id/status", protect, isAdmin, updateDonationStatus);

// Get single donation
router.get("/:id", protect, getDonationById);

export default router;
