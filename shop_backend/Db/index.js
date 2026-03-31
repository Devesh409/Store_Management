import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";
import User from "../Models/userModel.js";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    // Keep MongoDB indexes aligned with the current schema. This removes
    // stale indexes such as the old `username_1` index from previous versions.
    await User.syncIndexes();

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
