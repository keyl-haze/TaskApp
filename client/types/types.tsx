export interface User {
  id: number
  firstName: string
  middleName: string
  lastName: string
  username: string
  role: 'super_admin' | 'admin' | 'manager' | 'viewer'
  email: string
  deletedAt?: string | null
}

export interface Task {
  id: number
  title: string
  description: string
  type: 'bug' | 'feature' | 'task'
  priority: 'low' | 'medium' | 'high'
  Reporter: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  }
  Assignee: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  } | null
  deletedAt: string | null
}
