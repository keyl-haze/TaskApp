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
    throw new Error(result.error)
  } else {
    window.location.href = '/'
  }
}

export const logout = async () => {
  await signOut()
}
