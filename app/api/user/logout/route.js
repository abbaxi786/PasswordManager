import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // clear cookie
  response.cookies.set("authToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return response;
}
