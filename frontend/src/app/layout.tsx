import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GUNDAM UNIVERSE BOARD',
  description: 'A retro-styled bulletin board for Gundam fans',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${vt323.className} bg-crt-bg text-crt-text`}>
        <div className="crt-screen">
          <div className="scan-line"></div>
          <div className="flicker"></div>
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  )
} 