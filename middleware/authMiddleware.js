import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let decoded;
    try {
      token = req.headers.authorization.split(" ")[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      res.status(401);
      if (error.name === "TokenExpiredError") {
        throw new Error("Not authorized, token expired");
      }
      throw new Error("Not authorized, token failed");
    }

    try {
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      console.error("User Fetch Error:", error.message);
      res.status(500);
      throw new Error("Error fetching user from database");
    }

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    return next();
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
