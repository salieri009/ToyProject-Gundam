'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../services/api'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1단계: 로컬스토리지에서 세션 복원 시도
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('auth_token')
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse saved user:', e)
      }
    }
    
    // 2단계: 백그라운드에서 API 서버로 토큰 유효성 및 최신 정보 검증
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }
      
      const data = await authAPI.getCurrentUser()
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to check auth:', error)
      // 만약 네트워크 에러가 아닌 인증 에러(401) 등으로 실패하면 클리어
      // api.ts 인터셉터가 401을 처리하므로 여기서는 상세 체크만 수행
    } finally {
      setLoading(false)
    }
  }

  const login = (token: string) => {
    localStorage.setItem('auth_token', token)
    checkAuth()
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}