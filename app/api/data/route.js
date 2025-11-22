import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Password from "@/models/password";
import jwt from "jsonwebtoken";

// GET: fetch all passwords
export async function GET(req) {
  try {
    await connectDB();

    // Read token from cookie
    const token = req.cookies.get("authToken")?.value;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const data = await Password.find({ user: decoded.id });

    return NextResponse.json({ message: "Success", userId: decoded.id, data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: store new password
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

    const newPassword = new Password({ name, websiteURL, icon, email, password, user });
    await newPassword.save();

    return NextResponse.json({ message: "Password saved successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
