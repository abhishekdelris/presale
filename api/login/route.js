import { NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/auth";
import { executeQuery } from "@/lib/db";
import { sign } from "jsonwebtoken";
import { DatabaseSync } from "node:sqlite";
import { data } from "jquery";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Get user roles
    const userRoles = await executeQuery({
      query: `
        SELECT r.name 
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = ?
      `,
      values: [user.id]
    });

    const roles = userRoles.map(role => role.name);

    // Create session token (normally handled by NextAuth, but for custom implementation)
    const token = sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        roles: roles
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: roles
      },
      token 
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}