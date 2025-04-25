'use client'

import { useState /* useEffect */ } from 'react'

export default function Home() {
  const [message /* setMessage */] = useState<string>('Loading...')

  return (
    <main>
      <p>Message from backend: {message}</p>
    </main>
  )
}
