/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import NextAuth from 'next-auth'; // NextAuth をインポート
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer'; // nodemailer をインポート
import Auth0Provider from 'next-auth/providers/auth0';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    //Auth0追加部分
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    }),
    // Google OAuth を利用して認証を行う設定
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Magic Link をメールで送信するための設定
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM, // 送信元のメールアドレス
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
  adapter: PrismaAdapter(prisma), // NextAuth が Prisma を介してデータベース（ユーザー情報やセッション情報）を管理できるようにする
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // JWT (JSON Web Token) を使用してセッションを管理する設定
    jwt: true, // JWT を使用
  },
  callbacks: {
    // コールバック関数
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
