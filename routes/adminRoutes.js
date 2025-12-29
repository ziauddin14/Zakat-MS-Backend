import express from "express";
import {
  getDashboardStats,
  getAllDonations,
  updateDonationStatus,
  getAllUsers
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Dashboard Stats
router.get("/stats", protect, isAdmin, getDashboardStats);

// Get all donations
router.get("/donations", protect, isAdmin, getAllDonations);

// Update donation status
router.put("/donation/:id", protect, isAdmin, updateDonationStatus);

// Get all users
router.get("/users", protect, isAdmin, getAllUsers);

export default router;
