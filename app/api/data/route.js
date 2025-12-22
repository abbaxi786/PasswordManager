import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Password from "@/models/password";
import jwt from "jsonwebtoken";

// GET: fetch all passwords (with decryption)
export async function GET(req) {
  try {
    await connectDB();

    // Read token from cookie
    const token = req.cookies.get("authToken")?.value;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const data = await Password.find({ user: decoded.id });

    // Decrypt password of each document
    const formatted = data.map((item) => ({
      ...item._doc,
      password: item.decryptPassword(),
    }));

    return NextResponse.json({ message: "Success", userId: decoded.id, data: formatted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: store new password (auto-encrypted by model)
export async function POST(req) {
  try {
    await connectDB();

    const { name, websiteURL, icon, email, password, user } = await req.json();

    if (!name || !password || !user) {
      return NextResponse.json(
        { error: "Missing required fields: name, password, or user" },
        { status: 400 }
      );
    }

    // Encryption happens automatically in the model's pre-save hook
    const newPassword = new Password({ name, websiteURL, icon, email, password, user });
    await newPassword.save();
    console.log("Saved new password:", newPassword);

    return NextResponse.json({ message: "Password saved successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
