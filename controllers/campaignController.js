import Campaign from "../models/Campaign.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private (Admin)
const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, goalAmount, startDate, endDate } = req.body;

  if (!title || !goalAmount) {
    res.status(400);
    throw new Error("Please provide title and goal amount");
  }

  const campaign = await Campaign.create({
    title,
    description,
    goalAmount,
    startDate,
    endDate,
  });

  res.status(201).json(campaign);
});

// @desc    Get all active campaigns
// @route   GET /api/campaigns
// @access  Public
const getAllCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ status: "active" }).sort({
    createdAt: -1,
  });
  res.json(campaigns);
});

// @desc    Get single campaign by ID
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }

  res.json(campaign);
});

export { createCampaign, getAllCampaigns, getCampaignById };
