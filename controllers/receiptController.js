import asyncHandler from "express-async-handler";
import Donation from "../models/Donation.js";
import generateReceipt from "../utils/generateReceipt.js";

// @desc    Download donation receipt as PDF
// @route   GET /api/receipt/:id
// @access  Private (User/Admin)
const downloadReceipt = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  // Only allowed if donation is approved
  if (donation.status !== "approved") {
    res.status(403);
    throw new Error("Receipt only available for approved donations");
  }

  // Check authorization: Admin or the owner of the donation
  const isAdmin = req.user && req.user.role === "admin";
  const isOwner =
    req.user && donation.user._id.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error("Not authorized to download this receipt");
  }

  // Set headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=receipt-${donation._id}.pdf`
  );

  // Generate and stream PDF
  generateReceipt(donation, donation.user, res);
});

export { downloadReceipt };
