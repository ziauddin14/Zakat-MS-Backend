import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";

// Error middleware
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://zakat-ms.vercel.app"], // frontend URLs
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/campaigns", campaignRoutes);

// Root
app.get("/", (req, res) => res.send("Zakat Management Backend Running 🚀"));

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
