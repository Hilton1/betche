import { db } from './db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { compare } from 'bcryptjs';
import { loginSchema } from '@/schemas/loginSchema';

export const { auth, signIn, signOut, handlers } = NextAuth({
  pages: {
    error: '/login',
    signIn: '/login'
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt'
  },
  providers: [
    Google,
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
  ]
});
