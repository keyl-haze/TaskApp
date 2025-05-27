export interface User {
  id: number
  firstName: string
  middleName: string
  lastName: string
  username: string
  role: 'super_admin' | 'admin' | 'manager' | 'viewer'
  email: string
}
