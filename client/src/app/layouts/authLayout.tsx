'use client'
import type { ReactNode } from 'react'
import HeaderLayout from './app/headerLayout'
import SidebarLayout from './app/sidebarLayout'
import { SidebarProvider } from '@/components/ui/sidebar'
interface AuthLayoutProps {
  header: string
  children: ReactNode
  user?: {
    name: string
    title: string
    avatarUrl?: string
    initials?: string
  }
}
export default function AuthLayout({
  header,
  children,
  user
}: AuthLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <SidebarLayout user={user} />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <HeaderLayout header={header} />
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}



