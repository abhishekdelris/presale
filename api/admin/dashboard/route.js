"use server"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { executeQuery } from "@/lib/db";
import { executeQuery } from "../../../../lib/db";

export async function GET() {
  try {
    // Verify admin access
    const session = await getServerSession();
    if (!session || !session.user.roles.includes('admin')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get total users count
    const totalUsersResult = await executeQuery({
      query: "SELECT COUNT(*) as count FROM users"
    }); 
    const totalUsers = totalUsersResult[0].count;

    // Get new users in the last 7 days
    const newUsersResult = await executeQuery({
      query: "SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    });
    const newUsersThisWeek = newUsersResult[0].count;

    // Get admin count
    const adminCountResult = await executeQuery({
      query: `
        SELECT COUNT(DISTINCT user_id) as count 
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE r.name = 'admin'
      `
    });
    const adminCount = adminCountResult[0].count;

    // Return dashboard stats
    return NextResponse.json({
      totalUsers,
      newUsersThisWeek,
      adminCount
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}