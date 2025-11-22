import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "passwordManager", // you can change your database name
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
