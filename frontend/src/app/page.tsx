'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/posts')
      } else {
        router.push('/auth')
      }
    }
  }, [user, loading, router])

  return (
    <main className="flex flex-col items-center justify-center min-h-[50vh] font-mono text-center">
      <div className="border border-crt-glow/30 p-8 bg-black/40 rounded-lg max-w-md w-full relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-crt-text/80 animate-pulse"></div>
        <h1 className="text-3xl font-bold mb-4 tracking-widest text-crt-text animate-pulse">
          GUNDAM UNIVERSE
        </h1>
        <p className="text-sm text-crt-text/80 animate-pulse uppercase">
          CONNECTING TO SIDE-7 NETWORK...
        </p>
      </div>
    </main>
  )
}