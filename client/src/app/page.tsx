import AuthLayout from '@/app/layouts/authLayout'

import { SignInButton, SignOutButton } from '@/components/custom/auth'
import { auth } from '@/auth'

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    return (
      <AuthLayout header="Dashboard">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
          <p className="mt-2 text-gray-600">
            This is your main dashboard area.
          </p>
        </div>
        {/* Improve placement */}
        <SignOutButton />
      </AuthLayout>
    )
  }

  return (
    // Improve Login page
    <div>
      <p> You Are Not Signed In</p> <SignInButton />
    </div>
  )
}
