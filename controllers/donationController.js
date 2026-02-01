import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import asyncHandler from "express-async-handler";


const createDonation = asyncHandler(async (req, res) => {
  const { amount, donationType, category, paymentMethod, campaignId } =
    req.body;

  if (!amount || !donationType || !category || !paymentMethod) {
    res.status(400);
    throw new Error("Please fill all donation fields");
  }

  const donationData = {
    user: req.user._id,
    amount,
    donationType,
    category,
    paymentMethod,
  };

  if (campaignId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      res.status(404);
      throw new Error("Campaign not found");
    }
    donationData.campaign = campaignId;
  }

  const donation = await Donation.create(donationData);

  res.status(201).json(donation);
});

const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ user: req.user._id })
    .populate("campaign", "title")
    .sort({ createdAt: -1 });

  res.json(donations);
});


const getDonationsByUser = asyncHandler(async (req, res) => {
  let query = {};

  // If not admin, only show own donations
  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  const donations = await Donation.find(query)
    .populate("user", "name email")
    .populate("campaign", "title")
    .sort({ createdAt: -1 });

  res.json(donations);
});


const updateDonationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  const previousStatus = donation.status;
  donation.status = status || donation.status;

  const updatedDonation = await donation.save();

  if (
    previousStatus !== "approved" &&
    status === "approved" &&
    donation.campaign
  ) {
    await Campaign.findByIdAndUpdate(donation.campaign, {
      $inc: { currentAmount: donation.amount },
    });
  }
  else if (
    previousStatus === "approved" &&
    status !== "approved" &&
    donation.campaign
  ) {
    await Campaign.findByIdAndUpdate(donation.campaign, {
      $inc: { currentAmount: -donation.amount },
    });
  }

  res.json(updatedDonation);
});

const getDonationById = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate(
    "campaign",
    "title"
  );

  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  if (
    donation.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.json(donation);
});

export {
  createDonation,
  getMyDonations,
  getDonationById,
  updateDonationStatus,
  getDonationsByUser,
};
