import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key"; // make .env key later

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, email, password, type } = body;

    if (!type || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // =============== REGISTER =================
    if (type === "register") {
      const repeatedEmail = await User.findOne({ email });
      const repeatedUsername = await User.findOne({ username });

      if (repeatedEmail || repeatedUsername) {
        return NextResponse.json(
          { success: false, message: "Username or email already in use." },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return NextResponse.json({
        success: true,
        message: "User registered successfully.",
        user: { id: newUser._id, username: newUser.username, email: newUser.email },
      });
    }

    // =============== LOGIN =================
    else if (type === "logIn") {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return NextResponse.json(
          { success: false, message: "User does not exist. Please register." },
          { status: 404 }
        );
      }

      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordCorrect) {
        return NextResponse.json(
          { success: false, message: "Incorrect password." },
          { status: 401 }
        );
      }

      // ========== CREATE JWT TOKEN ==========
      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          username: existingUser.username,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // ========== SEND TOKEN IN COOKIE ==========
      const response = NextResponse.json({
        success: true,
        message: "Login successful.",
        user: { id: existingUser._id, username: existingUser.username, email: existingUser.email },
      });

      response.cookies.set("authToken", token, {
        httpOnly: true,   // secure against JS access
        secure: true,     // must be true in production (https)
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // =============== INVALID TYPE =================
    else {
      return NextResponse.json(
        { success: false, message: "Invalid type." },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
