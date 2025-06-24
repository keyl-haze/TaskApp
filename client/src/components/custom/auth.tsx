import { login, logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'

export const SignInButton = () => {
  return <Button onClick={login}>Sign In</Button>
}

export const SignOutButton = () => {
  return <Button onClick={logout}>Sign Out</Button>
}