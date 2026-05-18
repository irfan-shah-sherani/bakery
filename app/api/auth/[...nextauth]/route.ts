import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
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

        const { email, password } = credentials;
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) return null;

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        
        if (isPasswordCorrect) {
          if (!user.isVerified) {
            throw new Error("UNVERIFIED_ACCOUNT");
          }

          return { id: user.id, email: user.email, name: user.name };
        }
        
        return null;
      }
    }),
  ],
 callbacks: {
  async jwt({ token, user }: { token: JWT; user?: User }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },
  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      
      (session.user as any).id = token.id;
    }
    return session;
  },
},
});

export { handler as GET, handler as POST };