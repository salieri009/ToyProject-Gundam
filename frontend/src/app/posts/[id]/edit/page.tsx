'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { postsAPI } from '@/services/api'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Terminal, Save, ArrowLeft } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
  }
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    try {
      setError(null)
      const data = await postsAPI.getPost(params.id)
      setPost(data)
      setTitle(data.title)
      setContent(data.content)
    } catch (err: any) {
      console.error('Failed to fetch post:', err)
      setError(err.response?.data?.error || '게시글을 불러오는데 실패했습니다.')
    }
  }, [params.id])

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth')
        return
      }
      fetchPost()
    }
  }, [user, authLoading, router, fetchPost])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) return

    setLoading(true)
    setError(null)
    try {
      await postsAPI.updatePost(params.id, trimmedTitle, trimmedContent)
      router.push(`/posts/${params.id}`)
    } catch (err: any) {
      console.error('Failed to update post:', err)
      setError(err.response?.data?.error || '게시글 수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || (!post && !error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <p className="text-crt-text/80 animate-pulse text-sm">RETRIEVING PILOT SIGNALS...</p>
      </div>
    )
  }

  if (post && user && user.id !== post.author.id) {
    router.push(`/posts/${params.id}`)
    return null
  }

  return (
    <div className="flex flex-col min-h-screen justify-between py-4">
      <Header />

      <main className="flex-1 space-y-6 font-mono text-sm">
        <div className="border border-crt-glow/30 bg-black/40 p-4 rounded flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Terminal className="w-5 h-5 text-crt-text" />
            <div>
              <h2 className="text-lg font-bold text-crt-text tracking-wider">EDIT LOG ENTRY</h2>
              <p className="text-xs text-crt-text/50">MODIFY EXISTING BROADCAST DATA PACKET</p>
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
            ERROR: {error}
          </div>
        )}

        {post && (
          <form onSubmit={handleSubmit} className="border border-crt-glow/20 bg-black/20 p-6 rounded space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-xs font-bold text-crt-text uppercase tracking-widest">
                LOG TITLE //
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className="w-full bg-black/50 border border-crt-glow/30 focus:border-crt-glow p-3 rounded text-crt-text focus:outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-xs font-bold text-crt-text uppercase tracking-widest">
                LOG DATA STREAM //
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                maxLength={10000}
                className="w-full bg-black/50 border border-crt-glow/30 focus:border-crt-glow p-3 rounded text-crt-text focus:outline-none transition-all resize-none"
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
                disabled={loading || !title.trim() || !content.trim()}
                className="border border-crt-glow hover:bg-crt-glow/15 px-5 py-2 rounded text-crt-text tracking-wider font-bold transition-all flex items-center space-x-2 disabled:opacity-50 uppercase"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'TRANSMITTING...' : 'SAVE CHANGES'}</span>
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}