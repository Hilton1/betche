import { db } from './db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Resend } from 'resend';

import { compare } from 'bcryptjs';
import { loginSchema } from '@/schemas/loginSchema';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const { auth, signIn, signOut, handlers } = NextAuth({
  pages: {
    error: '/login',
    signIn: '/login',
    verifyRequest: '/login?magic-link=true',
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt'
  },
  providers: [
    Google,
    {
      id: 'magic-link',
      type: 'email',
      name: 'Magic Link',
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: 'Betche <suporte@resend.dev>',
          to: identifier,
          subject: 'Acesse o Betche',
          html: `<a href="${url}">Clique aqui</a> para acessar o Betche`,
        })
      }
    },
    Credentials({
      authorize: async (credentials) => {
        const { success, data } = loginSchema.safeParse(credentials);

        if (!success) {
          return null;
        }

        const { email, password } = data;

        const user = await db.user.findUnique({
          where: {
            email
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await compare(password, user.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  events: {},
  callbacks: {
    session: async ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
});
