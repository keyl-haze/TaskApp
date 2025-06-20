import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        // TODO: Call backend here to login then fetch the user details
        const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' }

        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ]
})
