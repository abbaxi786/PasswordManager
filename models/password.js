import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  websiteURL: { type: String, required: true },
  icon: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  user: { type: String, required: true }, // you can use ObjectId if referencing User
});

// Export the model
export default mongoose.models.Password || mongoose.model("Password", passwordSchema);
