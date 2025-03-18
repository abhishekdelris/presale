import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { executeQuery } from "@/lib/db";

const handler = NextAuth({   //[...nextauth]
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Get user from database
          const users = await executeQuery({
            query: `SELECT * FROM users WHERE email = ?`,
            values: [credentials.email]
          });

          if (users.length === 0) {
            return null;
          }

          const user = users[0];
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            return null;
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

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            roles: roles
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.roles = token.roles;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };