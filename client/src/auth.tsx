import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AUTH_API } from '@/routes/auth'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {

        // TODO: Call backend here to login then fetch the user details
        const res = await fetch(AUTH_API.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
          })
        })

        if (!res.ok) return null

        const user = await res.json()
        if (user && user.id) {
          return user
        }
        return null
      }
    })
  ]
})
