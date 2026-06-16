import mongoose from "mongoose";
import envConfig from "./env.config";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConfig.DB_URL, {
      serverSelectionTimeoutMS: 5000,
      dbName: envConfig.DB_NAME, // optional if included in URI
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // stop app if DB fails
  }
};

// Optional: Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log(" MongoDB disconnected on app termination");
  process.exit(0);
});
