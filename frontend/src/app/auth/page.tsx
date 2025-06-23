'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/posts')
    }
  }, [user, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">로그인</h1>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => {
              // Google 로그인 처리
            }}
            className="bg-white text-black px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>Google로 로그인</span>
          </button>
        </div>
      </div>
    </main>
  )
} 