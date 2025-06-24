'use client'

import {
  HelpCircle,
  Settings,
  Users,
  ListChecks,
  Rocket,
  LayoutDashboard,
  CheckCheck
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { logout } from '@/lib/actions/auth'
import { useSession } from 'next-auth/react'

interface SidebarLayoutProps {
  user?: {
    name: string
    title: string
    avatarUrl?: string
    initials?: string
  }
}

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    color: 'text-'
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users
  },
  {
    title: 'Tasks',
    url: '/tasks',
    icon: ListChecks
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: Rocket
  }
]

const supportItems = [
  {
    title: 'Help Center',
    url: '#',
    icon: HelpCircle
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]



export default function SidebarLayout({
  user: userProp = {
    name: 'JOHN DOE',
    title: 'TEAM LEAD',
    avatarUrl: '/placeholder.svg?height=40&width=40',
    initials: 'JD'
  }
}: SidebarLayoutProps) {
  const { data: session } = useSession()

  // Inline type assertion for session user
  type CustomUser = {
    id: string
    name: string
    email: string
    image?: string | null
    role: string
  }
  const sessionUser = session?.user as CustomUser | undefined

  const user = sessionUser
    ? {
        name: sessionUser.name || 'Unknown User',
        title: sessionUser.role || 'Member',
        avatarUrl: sessionUser.image || '/placeholder.svg?height=40&width=40',
        initials:
          sessionUser.name
            ?.split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase() || 'UU'
      }
    : userProp


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a className="font-semibold">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-500 text-sidebar-primary-foreground">
                  <CheckCheck className="size-4.5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Task App</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={`${user.name} - ${user.title}`}
                >
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarImage
                      src={user.avatarUrl || '/placeholder.svg'}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.title}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left"
                  >
                    Sign Out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
