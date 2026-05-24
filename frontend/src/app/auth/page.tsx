'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AuthPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/posts')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <p className="text-crt-text/80 animate-pulse text-sm">CHECKING USER CREDENTIALS...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen justify-between py-4">
      <Header />
      
      <main className="flex flex-col items-center justify-center my-12">
        <div className="w-full max-w-md p-2 bg-crt-glow/5 border border-crt-glow/20 rounded">
          <div className="border border-crt-glow/30 p-8 rounded bg-black flex flex-col items-center">
            <h1 className="text-3xl font-bold tracking-widest text-crt-text mb-2 font-mono">PILOT LOGIN</h1>
            <p className="text-xs text-crt-text/50 font-mono mb-8 text-center">
              ACCESS DEPLOYMENT ARCHIVES & COMMUNICATE WITH FELLOW OFFISERS
            </p>
            
            <GoogleLoginButton />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}