'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Terminal, Users, LogOut } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  return (
    <header className="border border-crt-glow/30 bg-black/40 p-4 rounded mb-8 relative font-mono">
      <div className="absolute top-0 left-0 w-full bg-crt-glow/10 px-3 py-0.5 text-[10px] text-crt-text/80 tracking-widest border-b border-crt-glow/20 flex justify-between">
        <span>MOBILE SUIT OS v.U.C.0079 - FEDERATION BBS NETWORK</span>
        <span>SYS.LOC // SIDE-7</span>
      </div>
      
      <nav className="flex flex-col md:flex-row justify-between items-center mt-4 pt-2 space-y-4 md:space-y-0">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
          <Terminal className="w-8 h-8 text-crt-text animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-crt-text glow-text">
              GUNDAM UNIVERSE
            </h1>
            <p className="text-[10px] text-crt-text/60">SIDE-7 SECURE TACTICAL COMMUNICATIONS CHANNEL</p>
          </div>
        </Link>
        
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs">
          <div className="flex items-center space-x-2 text-crt-text/85">
            <span>STATUS:</span>
            <span className="w-2.5 h-2.5 rounded-full bg-crt-text animate-ping"></span>
            <span className="text-crt-text font-bold">ALL GREEN</span>
          </div>
          
          <div className="flex items-center space-x-1.5 text-crt-text/70">
            <Users className="w-3.5 h-3.5" />
            <span>ACTIVE PILOTS: [36]</span>
          </div>

          {user && (
            <div className="text-crt-text/80 border-l border-crt-glow/20 pl-4 font-bold">
              PILOT: <span className="text-crt-text">{user.name}</span>
            </div>
          )}
          
          <div className="flex space-x-3 pl-2">
            <Link href="/posts" className="border border-crt-glow px-4 py-1.5 hover:bg-crt-glow/10 text-crt-text rounded transition-all tracking-wider font-bold">
              VIEW POSTS
            </Link>
            
            {user ? (
              <button 
                onClick={handleLogout}
                className="border border-red-500 px-4 py-1.5 hover:bg-red-500/10 text-red-500 rounded transition-all tracking-wider font-bold flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>
            ) : (
              <Link href="/auth" className="border border-yellow-500 px-4 py-1.5 hover:bg-yellow-500/10 text-yellow-500 rounded transition-all tracking-wider font-bold">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}