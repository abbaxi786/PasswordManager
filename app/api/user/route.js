import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    console.log("📥 Received request:", { ...body, password: "***" }); // Debug log
  
    const { username, email, password, type } = body;

    // Validate type
    if (!type) {
      console.log("❌ Missing type");
      return NextResponse.json(
        { success: false, message: "Request type is required." },
        { status: 400 }
      );
    }

    // =============== REGISTER =================
    if (type === "register") {
      // Validate required fields for registration
      if (!username || !email || !password) {
        console.log("❌ Missing registration fields");
        return NextResponse.json(
          { success: false, message: "Username, email, and password are required." },
          { status: 400 }
        );
      }

      // Check for existing user
      const repeatedEmail = await User.findOne({ email });
      const repeatedUsername = await User.findOne({ username });

      if (repeatedEmail) {
        console.log("❌ Email already exists");
        return NextResponse.json(
          { success: false, message: "Email already in use." },
          { status: 400 }
        );
      }

      if (repeatedUsername) {
        console.log("❌ Username already exists");
        return NextResponse.json(
          { success: false, message: "Username already in use." },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      console.log("✅ User registered successfully:", newUser.email);

      return NextResponse.json({
        success: true,
        message: "User registered successfully.",
        user: { 
          id: newUser._id, 
          username: newUser.username, 
          email: newUser.email 
        },
      });
    }

    // =============== LOGIN =================
    else if (type === "logIn") {
      // Validate required fields for login
      if (!email || !password) {
        console.log("❌ Missing login fields");
        return NextResponse.json(
          { success: false, message: "Email and password are required." },
          { status: 400 }
        );
      }

      // Find user by email
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        console.log("❌ User not found:", email);
        return NextResponse.json(
          { success: false, message: "User does not exist. Please register." },
          { status: 404 }
        );
      }

      // Verify password
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordCorrect) {
        console.log("❌ Incorrect password for:", email);
        return NextResponse.json(
          { success: false, message: "Incorrect password." },
          { status: 401 }
        );
      }

      // Create JWT token
      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          username: existingUser.username,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log("✅ Login successful:", existingUser.email);

      // Create response with user data
      const response = NextResponse.json({
        success: true,
        message: "Login successful.",
        user: { 
          id: existingUser._id, 
          username: existingUser.username, 
          email: existingUser.email 
        },
      });

      // Set HTTP-only cookie
      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // =============== INVALID TYPE =================
    else {
      console.log("❌ Invalid type:", type);
      return NextResponse.json(
        { success: false, message: "Invalid request type. Use 'register' or 'logIn'." },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("🔥 API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}