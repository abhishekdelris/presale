import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { executeQuery } from "@/lib/db";
import { executeQuery } from "../../../../src/lib/db"

// Get user profile
export async function GET() {
  try {
    // Get current user from session
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user profile data
    const userData = await executeQuery({
      query: "SELECT id, name, email, created_at FROM users WHERE id = ?",
      values: [userId]
    });

    if (userData.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userData[0];

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request) {
  try {
    // Get current user from session
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { name } = await request.json();

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Update user profile
    await executeQuery({
      query: "UPDATE users SET name = ? WHERE id = ?",
      values: [name, userId]
    });

    // Get updated profile
    const updatedUserData = await executeQuery({
      query: "SELECT id, name, email, created_at FROM users WHERE id = ?",
      values: [userId]
    });

    const updatedUser = updatedUserData[0];

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.created_at
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}