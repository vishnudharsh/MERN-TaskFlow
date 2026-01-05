import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./utils/connectDB.js";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewares.js";
import routes from "./routes/index.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "http://localhost:3001",
      process.env.CLIENT_URL // Add your frontend Vercel URL later
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// ✅ ADD: Test route
app.get("/", (req, res) => {
  res.send("✅ TaskFlow Backend API is running!");
});

app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));

// ✅ ADD: Export for Vercel serverless
export default app;