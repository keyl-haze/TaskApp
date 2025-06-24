import NextAuth from "next-auth"
import type { NextAuthOptions, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from 'next-auth/providers/credentials'
import { AUTH_API } from '@/routes/auth'

type UserWithRole = User & { id?: string; role?: string }

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        // Call backend to login and fetch user details
        const fetchOptions: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(req?.headers?.cookie ? { cookie: req.headers.cookie } : {})
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
          })
        }

        const res = await fetch(AUTH_API.login, fetchOptions)

        if (!res.ok) return null

        const user = await res.json()
        if (user && user.id) {
          return user
        }
        return null
      }
    })
  ],
  pages: {
    error: 'auth/error', // Error page URL
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: UserWithRole }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.name = user.name
        token.email = user.email
        token.image = user.image || null
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      session.user.name = token.name as string
      session.user.email = token.email as string
      session.user.image = token.image as string | null
      return session
    }
  }
}

export default NextAuth(authOptions)
