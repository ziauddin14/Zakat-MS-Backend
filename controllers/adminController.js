import Donation from "../models/Donation.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalDonations = await Donation.countDocuments();
  const pendingDonations = await Donation.countDocuments({ status: "pending" });
  const approvedDonations = await Donation.countDocuments({
    status: "approved",
  });
  const rejectedDonations = await Donation.countDocuments({
    status: "rejected",
  });

  res.json({
    totalUsers,
    totalDonations,
    pendingDonations,
    approvedDonations,
    rejectedDonations,
  });
});

// @desc    Get all donations
// @route   GET /api/admin/donations
// @access  Private/Admin
const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(donations);
});

// @desc    Update donation status (approve/reject)
// @route   PUT /api/admin/donation/:id
// @access  Private/Admin
const updateDonationStatus = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  donation.status = req.body.status || donation.status;
  await donation.save();

  res.json(donation);
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export {
  getDashboardStats,
  getAllDonations,
  updateDonationStatus,
  getAllUsers,
};
