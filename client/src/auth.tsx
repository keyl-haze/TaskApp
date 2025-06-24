import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AUTH_API } from '@/routes/auth'

export const authOptions = {
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
  }
}

export default NextAuth(authOptions)
