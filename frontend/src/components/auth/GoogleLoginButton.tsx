'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { authAPI } from '@/services/api'
import { useState } from 'react'

export function GoogleLoginButton() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSuccess = async (credentialResponse: any) => {
    setLoading(true)
    setError(null)
    try {
      const idToken = credentialResponse.credential
      if (!idToken) {
        throw new Error('ID Token not found')
      }
      
      const data = await authAPI.googleLogin(idToken)
      login(data.access_token)
      // refresh token과 user 정보는 로컬스토리지에 저장
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      router.push('/posts')
    } catch (err: any) {
      console.error('Google login failed:', err)
      setError(err.response?.data?.error || '로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleError = () => {
    setError('Google 로그인 중 오류가 발생했습니다.')
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
      <div className="border border-crt-glow/50 bg-black/40 p-6 rounded-lg w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-crt-glow to-transparent opacity-70"></div>
        <h2 className="text-xl mb-4 font-mono tracking-wider text-crt-text">SYSTEM AUTHENTICATION</h2>
        <p className="text-xs mb-6 font-mono text-crt-text/70">PLEASE IDENTITY YOUR PILOT CREDENTIALS</p>
        
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            theme="filled_black"
            shape="rectangular"
            text="signin_with"
            locale="ko"
          />
        </div>
      </div>
      
      {loading && (
        <p className="text-xs font-mono text-yellow-400 animate-pulse">
          INITIALIZING PILOT SESSION... STAND BY...
        </p>
      )}
      
      {error && (
        <div className="border border-red-500 bg-red-950/40 text-red-500 p-3 rounded font-mono text-xs w-full text-center">
          ERROR: {error}
        </div>
      )}
    </div>
  )
}
