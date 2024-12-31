/* eslint-disable no-undef */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account, profile }) {
      // Google認証後のカスタム処理
      if (account.provider === "google") {
        // 必要に応じてデータベースや別のストレージにGoogleユーザー情報を保存
        console.log("Google user signed in:", user);
      }
      return true; // 認証を許可
    },
    async session({ session, token }) {
      // セッションにGoogleログインかどうかの情報を付加
      session.isGoogleUser = token.provider === "google";
      return session;
    },
  },
});
