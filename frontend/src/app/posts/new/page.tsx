'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { postsAPI } from '@/services/api'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Terminal, Send, ArrowLeft } from 'lucide-react'

export default function NewPostPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) return

    setLoading(true)
    setError(null)
    try {
      const data = await postsAPI.createPost(trimmedTitle, trimmedContent)
      router.push(`/posts/${data.id}`)
    } catch (err: any) {
      console.error('Failed to create post:', err)
      setError(err.response?.data?.error || '게시글 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <p className="text-crt-text/80 animate-pulse text-sm">AUTHENTICATING ACCESS...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen justify-between py-4">
      <Header />

      <main className="flex-1 space-y-6 font-mono text-sm">
        <div className="border border-crt-glow/30 bg-black/40 p-4 rounded flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Terminal className="w-5 h-5 text-crt-text" />
            <div>
              <h2 className="text-lg font-bold text-crt-text tracking-wider">NEW TRANSMISSION RECORD</h2>
              <p className="text-xs text-crt-text/50">PREPARE OUTGOING PACKET FOR BROADCAST</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-crt-text/30 hover:border-crt-text px-3 py-1.5 rounded text-crt-text/75 hover:text-crt-text transition-all flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ABORT</span>
          </button>
        </div>

        {error && (
          <div className="border border-red-500 bg-red-950/40 text-red-500 p-4 rounded">
            ERROR CODE: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-crt-glow/20 bg-black/20 p-6 rounded space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-xs font-bold text-crt-text uppercase tracking-widest">
              MESSAGE TITLE //
            </label>
            <input
              type="text"
              id="title"
              data-testid="post-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ENTER PACKET LOG TITLE..."
              maxLength={200}
              className="w-full bg-black/50 border border-crt-glow/30 focus:border-crt-glow p-3 rounded text-crt-text placeholder-crt-text/30 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-xs font-bold text-crt-text uppercase tracking-widest">
              TRANSMISSION TEXT DATA //
            </label>
            <textarea
              id="content"
              data-testid="post-content-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="WRITE SIGNAL DATA STREAM..."
              rows={12}
              maxLength={10000}
              className="w-full bg-black/50 border border-crt-glow/30 focus:border-crt-glow p-3 rounded text-crt-text placeholder-crt-text/30 focus:outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 border-t border-crt-glow/10 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-red-500/50 hover:bg-red-500/10 px-4 py-2 rounded text-red-500 tracking-wider font-bold transition-all uppercase"
            >
              CANCEL
            </button>
            <button
              type="submit"
              data-testid="post-submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="border border-crt-glow hover:bg-crt-glow/15 px-5 py-2 rounded text-crt-text tracking-wider font-bold transition-all flex items-center space-x-2 disabled:opacity-50 uppercase"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'TRANSMITTING...' : 'BROADCAST DATA'}</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}