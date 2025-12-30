// src/auth.js
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiController } from "./utils/apiController";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials in .env.local");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const userFromApi = await apiController({
            method: "POST",
            url: "/auth/login/",
            data: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          if (userFromApi) {
            return {
              id: userFromApi.id,
              email: userFromApi.email,
              name: `${userFromApi.first_name} ${userFromApi.last_name}`,
              accessToken: userFromApi.access_token,
              refreshToken: userFromApi.refresh_token,
              role: userFromApi.role,
              braiderProfile: userFromApi.braider_profile,
            };
          }
          return null;
        } catch (error) {
          console.error("Login Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const data = await apiController({
            method: "POST",
            url: "/auth/google/",
            data: {
              id_token: account.id_token,
              role: "BRAIDER",
            },
          });

          if (data.access) {
            user.accessToken = data.access;
            user.refreshToken = data.refresh;
            user.id = data.id;
            user.role = data.role;
            user.name = `${data.first_name} ${data.last_name}`;
            user.braiderProfile = data.braider_profile;
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      }
      if (account.provider === "credentials") {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.role = user.role;
        token.braiderProfile = user.braiderProfile;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.braiderProfile = token.braiderProfile;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
};
