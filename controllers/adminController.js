import Donation from "../models/Donation.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

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

const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(donations);
});

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
