import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./utils/connectDB.js";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewares.js";
import routes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "http://localhost:3001",
      "https://mern-taskflow-client.vercel.app", // Add your actual frontend URL
      process.env.CLIENT_URL
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ TaskFlow Backend API is running!");
});

app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

// ✅ FIXED: Only listen when NOT on Vercel
if (process.env.NODE_ENV !== "production") {
  dbConnection(); // Connect to DB in development
  app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
}

// ✅ Export for Vercel (connects to DB on each request)
export default async function handler(req, res) {
  await dbConnection();
  return app(req, res);
}