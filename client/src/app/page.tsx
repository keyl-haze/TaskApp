'use client'

import AuthLayout from '@/app/layouts/authLayout'

export default function Home() {
  return (
    <AuthLayout header="Dashboard">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-2 text-gray-600">This is your main dashboard area.</p>
      </div>
    </AuthLayout>
  )
}
