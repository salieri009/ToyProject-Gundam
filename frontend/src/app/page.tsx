'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/posts')
    } else {
      router.push('/auth')
    }
  }, [user, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">GUNDAM UNIVERSE BOARD</h1>
      <p className="text-xl">Loading...</p>
    </main>
  )
} 