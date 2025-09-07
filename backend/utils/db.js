import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("[DB] MONGO_URI:", process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      console.log("[DB] ERROR: MONGO_URI is undefined or empty");
      throw new Error("MONGO_URI is not set in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[DB] mongodb connected successfully");
  } catch (err) {
    console.log("[DB] error in connecting mongodb:", err);
  }
};

export default connectDB;
