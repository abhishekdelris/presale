// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { executeQuery } from "../../../../lib/db";

// export async function POST(request) {
//   try {
//     const { name, email, password } = await request.json();

//     // Validate input
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists
//     const existingUsers = await executeQuery({
//       query: "SELECT * FROM users WHERE email = ?",
//       values: [email]
//     });

//     if (existingUsers.length > 0) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 409 }
//       );
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Insert user
//     const result = await executeQuery({
//       query: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
//       values: [name, email, hashedPassword]
//     });

//     const userId = result.insertId;

//     // Assign default 'user' role
//     const userRoleQuery = await executeQuery({
//       query: `
//         INSERT INTO user_roles (user_id, role_id)
//         SELECT ?, id FROM roles WHERE name = 'user'
//       `,
//       values: [userId]
//     });

//     return NextResponse.json(
//       { success: true, message: "User registered successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Registration error:", error);
//     return NextResponse.json(
//       { error: "Failed to register user" },
//       { status: 500 }
//     );
//   }
// }

// import bcrypt from "bcryptjs";
// import { executeQuery } from "../../../lib/db";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     const { name, email, password } = req.body;
    
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const existingUsers = await executeQuery({
//       query: "SELECT * FROM users WHERE email = ?",
//       values: [email]
//     });

//     if (existingUsers.length > 0) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     await executeQuery({
//       query: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
//       values: [name, email, hashedPassword]
//     });

//     res.status(201).json({ success: true, message: "User registered successfully" });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ error: "Failed to register user" });
//   }
// }

import bcrypt from "bcryptjs";
import { executeQuery } from "../../../src/lib/db"; // Adjust path as needed

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const existingUsers = await executeQuery({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email]
    });

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await executeQuery({
      query: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      values: [name, email, hashedPassword]
    });

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
}
