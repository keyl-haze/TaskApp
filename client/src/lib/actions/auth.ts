import { signIn, signOut } from 'next-auth/react'

export const login = async (credentials: {
  email: string
  password: string
}) => {
  const result = await signIn('credentials', {
    ...credentials,
    redirect: false // * Prevent automatic redirection
  })

  if (result?.error) {
    console.error('Login error:', result.error)
  } else {
    window.location.href = '/'
  }
}

export const logout = async () => {
  await signOut()
}
