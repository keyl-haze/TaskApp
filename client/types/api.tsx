/* eslint-disable no-unused-vars */

export interface API_ROUTES {
  list: string
  create: string
  get: (id: string) => string
  restore: (id: string) => string
  update: (id: string) => string
  delete: (id: string) => string
}
