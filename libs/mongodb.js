import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    const mongoUri = process.env.mongo_uri;
    if (!mongoUri) {
      throw new Error("MongoDB URI not defined in environment variables!");
    }

    console.log("🔗 Connecting to MongoDB:", mongoUri);

    await mongoose.connect(mongoUri, {
      dbName: "passwordManager", // database inside the cluster
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected to database: passwordManager");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error; // propagate the error to your API route
  }
}
