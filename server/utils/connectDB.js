import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.log("❌ DB Connection Error:", error);
    process.exit(1); // Exit if database fails
  }
};

export default dbConnection;

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Determine if we're in production
  const isProduction = process.env.NODE_ENV === "production";

  // Set JWT as HTTP-Only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // true in production, false in development
    sameSite: isProduction ? "none" : "lax", // "none" for cross-origin in production
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    path: "/",
    ...(isProduction ? {} : { domain: "localhost" }) // Only set domain in development
  });

  return token;
};
