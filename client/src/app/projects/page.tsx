'use client'

import AuthLayout from '@/app/layouts/authLayout'

export default function ProjectsPage() {
  return (
    <AuthLayout header="Projects">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="mt-2 text-gray-600">Manage your projects here.</p>
      </div>
    </AuthLayout>
  )
}