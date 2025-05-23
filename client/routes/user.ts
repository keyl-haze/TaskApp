const API_BASE = 'http://localhost:8080/api/v1'

export const USER_API = {
  list: `${API_BASE}/users`,
  create: `${API_BASE}/users`,
  get: (id: string) => `${API_BASE}/users/${id}`,
  update: (id: string) => `${API_BASE}/users/${id}`
}
