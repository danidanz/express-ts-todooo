import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import todoRoutes from "./routes/todoRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser()); // Add this line

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api", todoRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
