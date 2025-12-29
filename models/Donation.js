import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: false, // Optional for general donations not linked to a specific campaign
    },

    amount: {
      type: Number,
      required: true,
    },

    donationType: {
      type: String,
      enum: ["Zakat", "Sadqah", "Fitra", "General"],
      required: true,
    },

    category: {
      type: String,
      enum: ["Food", "Education", "Medical"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank", "Online"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
