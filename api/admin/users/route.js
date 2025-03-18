// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { executeQuery } from "@/lib/db";

// // Get all users
// export async function GET() {
//   try {
//     // Verify admin access (middleware should already check this, but double-check)
//     const session = await getServerSession();
//     if (!session || !session.user.roles.includes('admin')) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     const users = await executeQuery({
//       query: `
//         SELECT u.id, u.name, u.email, u.created_at,
//                GROUP_CONCAT(r.name) as roles
//         FROM users u
//         LEFT JOIN user_roles ur ON u.id = ur.user_id
//         LEFT JOIN roles r ON ur.role_id = r.id
//         GROUP BY u.id
//         ORDER BY u.created_at DESC
//       `
//     });

//     // Format the response
//     const formattedUsers = users.map(user => ({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       roles: user.roles ? user.roles.split(',') : [],
//       createdAt: user.created_at
//     }));

//     return NextResponse.json(formattedUsers);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch users" },
//       { status: 500 }
//     );
//   }
// }

// // Update user (change role)
// export async function PUT(request) {
//   try {
//     const { userId, roles } = await request.json();

//     // Validate input
//     if (!userId || !roles || !Array.isArray(roles)) {
//       return NextResponse.json(
//         { error: "Invalid request data" },
//         { status: 400 }
//       );
//     }

//     // Verify admin access
//     const session = await getServerSession();
//     if (!session || !session.user.roles.includes('admin')) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     // Delete existing roles
//     await executeQuery({
//       query: "DELETE FROM user_roles WHERE user_id = ?",
//       values: [userId]
//     });

//     // Add new roles
//     for (const role of roles) {
//       await executeQuery({
//         query: `
//           INSERT INTO user_roles (user_id, role_id)
//           SELECT ?, id FROM roles WHERE name = ?
//         `,
//         values: [userId, role]
//       });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return NextResponse.json(
//       { error: "Failed to update user" },
//       { status: 500 }
//     );
//   }
// }

// // Delete user
// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('id');

//     if (!userId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Verify admin access
//     const session = await getServerSession();
//     if (!session || !session.user.roles.includes('admin')) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     // Check if trying to delete self
//     if (session.user.id === userId) {
//       return NextResponse.json(
//         { error: "Cannot delete your own account" },
//         { status: 400 }
//       );
//     }

//     // Delete user (user_roles will cascade delete)
//     await executeQuery({
//       query: "DELETE FROM users WHERE id = ?",
//       values: [userId]
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return NextResponse.json(
//       { error: "Failed to delete user" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { executeQuery } from "@/lib/db";
import { executeQuery } from "../../../../src/lib/db";

// Get all users
export async function GET() {
  try {
    // Verify admin access (middleware should already check this, but double-check)
    const session = await getServerSession();
    if (!session || !session.user.roles.includes('admin')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const users = await executeQuery({
      query: `
        SELECT u.id, u.name, u.email, u.created_at,
               GROUP_CONCAT(r.name) as roles
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        GROUP BY u.id
        ORDER BY u.created_at DESC
      `
    });

    // Format the response
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles ? user.roles.split(',') : [],
      createdAt: user.created_at
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update user (change role)
export async function PUT(request) {
  try {
    const { userId, roles } = await request.json();

    // Validate input
    if (!userId || !roles || !Array.isArray(roles)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Verify admin access
    const session = await getServerSession();
    if (!session || !session.user.roles.includes('admin')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete existing roles
    await executeQuery({
      query: "DELETE FROM user_roles WHERE user_id = ?",
      values: [userId]
    });

    // Add new roles
    for (const role of roles) {
      await executeQuery({
        query: `
          INSERT INTO user_roles (user_id, role_id)
          SELECT ?, id FROM roles WHERE name = ?
        `,
        values: [userId, role]
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify admin access
    const session = await getServerSession();
    if (!session || !session.user.roles.includes('admin')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if trying to delete self
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user (user_roles will cascade delete)
    await executeQuery({
      query: "DELETE FROM users WHERE id = ?",
      values: [userId]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}