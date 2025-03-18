import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST() {
  try {
    // Get session (next-auth already handles logout)
    // This endpoint is mainly for custom implementations
    return NextResponse.json(
      { success: true, message: "Logged out successfully" }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}