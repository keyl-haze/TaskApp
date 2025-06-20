'use server'

import { signIn, signOut } from '@/auth'

export const login = async (credentials: { email: string; password: string }) => {
  await signIn('credentials', {
    ...credentials,
    redirectTo: '/'
  })
}

export const logout = async () => {
  await signOut({ redirectTo: '/' })
}
