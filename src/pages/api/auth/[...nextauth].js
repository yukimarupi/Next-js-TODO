/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import NextAuth from 'next-auth'; // NextAuth をインポート
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer'; // nodemailer をインポート

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, token, baseUrl }) => {
        // Nodemailer を使用してメールを送信
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: identifier,
          subject: 'Please verify your email address',
          text: `Click the link below to verify your email address: ${url}`,
          html: `<p>Click the link below to verify your email address:</p><p><a href="${url}">${url}</a></p>`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log('Verification email sent to:', identifier);
        } catch (error) {
          console.error('Error sending verification email:', error);
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true, // JWT を使用
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        console.log('Google user signed in:', user);
      }
      if (account.provider === 'email') {
        console.log('Email user signed in:', user);
      }

      // `user` が null でないか確認
      if (!user) {
        return false; // ユーザーが存在しない場合は認証エラー
      }
      return true; // ユーザーが存在する場合は認証を許可
    },
    async session({ session, token }) {
      // token.user が null でないか確認
      if (token && token.user) {
        session.user = token.user;
      } else {
        session.user = {}; // user が null の場合は空オブジェクトを渡す
      }
      return session;
    },
  },
});
