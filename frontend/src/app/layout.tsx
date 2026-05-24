import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { GoogleOAuthProvider } from '@react-oauth/google'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GUNDAM UNIVERSE BOARD',
  description: 'A retro-styled bulletin board for Gundam fans',
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${vt323.className} bg-crt-bg text-crt-text min-h-screen selection:bg-crt-glow selection:text-black`}>
        <div className="crt-screen flex flex-col min-h-screen">
          <div className="scan-line"></div>
          <div className="flicker"></div>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
              <div className="container mx-auto px-4 py-8 max-w-5xl flex-1 flex flex-col justify-between">
                {children}
              </div>
            </AuthProvider>
          </GoogleOAuthProvider>
        </div>
      </body>
    </html>
  )
}