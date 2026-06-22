'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { postsAPI } from '@/services/api'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CommentList } from '@/components/comments/CommentList'
import { Calendar, User, ArrowLeft, Edit3, Trash2 } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
  }
  created_at: string
  updated_at: string | null
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const postData = await postsAPI.getPost(params.id)
      setPost(postData)
    } catch (err: any) {
      console.error('Failed to fetch post:', err)
      setError(err.response?.data?.error || '게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
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

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

    try {
      await postsAPI.deletePost(params.id)
      router.push('/posts')
    } catch (err) {
      console.error('Failed to delete post:', err)
      alert('게시글 삭제에 실패했습니다.')
    }
  }

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <p className="text-crt-text/80 animate-pulse text-sm">DECRYPTING USER SECTOR...</p>
      </div>
    )
  }

  const isAuthor = user?.id === post?.author.id

  return (
    <div className="flex flex-col min-h-screen justify-between py-4">
      <Header />

      <main className="flex-1 space-y-6 font-mono text-sm">
        {/* Navigation & Control HUD */}
        <div className="border border-crt-glow/30 bg-black/40 p-4 rounded flex justify-between items-center">
          <button
            onClick={() => router.push('/posts')}
            className="border border-crt-text/30 hover:border-crt-text px-3 py-1.5 rounded text-crt-text/75 hover:text-crt-text transition-all flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO ARCHIVE</span>
          </button>

          {post && isAuthor && (
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/posts/${params.id}/edit`)}
                className="border border-yellow-500/50 hover:bg-yellow-500/10 px-3 py-1.5 rounded text-yellow-500 transition-all flex items-center space-x-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>EDIT LOG</span>
              </button>
              <button
                onClick={handleDelete}
                className="border border-red-500/50 hover:bg-red-500/10 px-3 py-1.5 rounded text-red-500 transition-all flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>DELETE LOG</span>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="border border-red-500 bg-red-950/40 text-red-500 p-4 rounded">
            ERROR RESPONSE: {error}
          </div>
        )}

        {loading ? (
          <div className="border border-crt-glow/20 bg-black/20 p-8 rounded text-center">
            <span className="text-crt-text/80 animate-pulse">DOWNLOADING SIGNAL TRANSMISSION...</span>
          </div>
        ) : (
          post && (
            <article className="border border-crt-glow/30 bg-black/20 p-6 rounded space-y-6">
              {/* Post Header */}
              <div className="border-b border-crt-glow/20 pb-4">
                <span className="text-[10px] text-crt-text/50 uppercase tracking-widest block mb-1">
                  SYS.LOG // LOG-ENTRY
                </span>
                <h2 data-testid="post-detail-title" className="text-2xl font-bold text-crt-text tracking-wide mb-3">
                  {post.title}
                </h2>
                
                <div className="flex flex-wrap gap-4 text-xs text-crt-text/70">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-crt-text/40" />
                    <span>PILOT LOGGED BY: {post.author.name}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-crt-text/40" />
                    <span>DATETIME: {new Date(post.created_at).toLocaleString()}</span>
                  </span>
                  {post.updated_at && (
                    <span className="text-yellow-500/70">
                      (MODIFIED: {new Date(post.updated_at).toLocaleString()})
                    </span>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="text-crt-text/90 leading-relaxed whitespace-pre-wrap text-sm font-mono tracking-wide py-2 min-h-[150px]">
                {post.content}
              </div>
            </article>
          )
        )}

        {/* Comments Section */}
        {post && (
          <div className="mt-8">
            <CommentList postId={params.id} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}