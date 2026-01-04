import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export default dbConnection;

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Set JWT as HTTP-Only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // Must be false for localhost
    sameSite: "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    domain: "localhost", // Add this to work across ports
    path: "/", // Add this explicitly
  });

  return token;
};
