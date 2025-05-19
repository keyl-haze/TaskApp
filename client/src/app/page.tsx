'use client'

import { useState /* useEffect */ } from 'react'
import UsersPage from './pages/usersPage'

export default function Home() {
  const [message /* setMessage */] = useState<string>('Loading...')

  return (
    <main>
      <UsersPage />
      <p>Message from backend: {message}</p>
    </main>
  )
}
