import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe configuration shared by middleware and the full Node auth.
// IMPORTANT: no Prisma, no bcrypt here — this module is bundled into the
// Edge middleware, which cannot use Node-only APIs.
export default {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/portal",
    error: "/portal",
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    // Pure mapping from token → session (no DB access), safe on the edge.
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string) ?? session.user.id;
        session.user.role = (token.role as "MEMBER" | "CONCIERGE" | "ADMIN") ?? "MEMBER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
