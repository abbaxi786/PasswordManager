import mongoose from "mongoose";
import CryptoJS from "crypto-js";

const passwordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  websiteURL: { type: String, required: true },
  icon: { type: String },
  email: { type: String, required: true },

  // Will be stored encrypted
  password: { type: String, required: true },

  user: { type: String, required: true },
});

// Encrypt BEFORE saving
passwordSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const key = process.env.PASSWORD_ENCRYPTION_KEY;

  this.password = CryptoJS.AES.encrypt(this.password, key).toString();
  next();
});

// Decrypt AFTER retrieving
passwordSchema.methods.decryptPassword = function () {
  const key = process.env.PASSWORD_ENCRYPTION_KEY;

  const bytes = CryptoJS.AES.decrypt(this.password, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export default mongoose.models.Password ||
  mongoose.model("Password", passwordSchema);
