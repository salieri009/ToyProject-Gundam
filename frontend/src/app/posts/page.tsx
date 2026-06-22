'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { postsAPI } from '@/services/api'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MessageSquare, Calendar, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
  }
  comment_count: number
  created_at: string
  updated_at: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
}

export default function PostsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await postsAPI.getPosts(page, pagination.limit)
      setPosts(data.posts || [])
      setPagination(data.pagination)
    } catch (err: any) {
      console.error('Failed to fetch posts:', err)
      setError(err.response?.data?.error || '게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [pagination.limit])

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth')
        return
      }
      fetchPosts(pagination.page)
    }
  }, [user, authLoading, router, pagination.page, fetchPosts])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <p className="text-crt-text/80 animate-pulse text-sm">LOADING PILOT SYSTEM...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen justify-between py-4">
      <Header />

      <main className="flex-1 space-y-6 font-mono text-sm">
        {/* HUD control bar */}
        <div className="border border-crt-glow/30 bg-black/40 p-4 rounded flex justify-between items-center relative overflow-hidden">
          <div>
            <h2 className="text-xl font-bold text-crt-text tracking-wider">TACTICAL TRANSMISSIONS</h2>
            <p className="text-xs text-crt-text/50">SECURE COMMUNICATIONS CHANNEL DIRECT FROM FRONT LINES</p>
          </div>
          <button
            onClick={() => router.push('/posts/new')}
            data-testid="write-message"
            className="border border-crt-glow hover:bg-crt-glow/10 px-4 py-2 rounded text-crt-text transition-all tracking-wider font-bold flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>WRITE MESSAGE</span>
          </button>
        </div>

        {error && (
          <div className="border border-red-500 bg-red-950/40 text-red-500 p-4 rounded text-center">
            ERROR: {error}
          </div>
        )}

        {loading ? (
          <div className="border border-crt-glow/20 bg-black/20 p-8 rounded text-center">
            <span className="text-crt-text/80 animate-pulse">DOWNLOAD-LINK ESTABLISHING... RETRIEVING DATA...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="border border-crt-glow/20 bg-black/20 p-8 rounded text-center text-crt-text/50">
                NO TRANSMISSIONS DETECTED IN THIS REGION.
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => router.push(`/posts/${post.id}`)}
                  data-testid="post-card"
                  className="border border-crt-glow/20 bg-black/25 p-5 rounded hover:border-crt-glow/70 hover:bg-crt-glow/5 transition-all cursor-pointer relative group"
                >
                  {/* Neon blue line highlight on hover */}
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-crt-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-crt-text group-hover:glow-text transition-all">
                      {post.title}
                    </h3>
                    <span className="text-[10px] text-crt-text/40 border border-crt-glow/20 px-2 py-0.5 rounded uppercase">
                      ID: {post.id.slice(0, 8)}
                    </span>
                  </div>

                  <p className="text-crt-text/75 line-clamp-2 mb-4 text-xs font-mono leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-xs text-crt-text/65 border-t border-crt-glow/10 pt-3">
                    <div className="flex space-x-4">
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-crt-text/50" />
                        <span>PILOT: {post.author.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-crt-text/50" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <span className="flex items-center space-x-1 bg-crt-glow/5 border border-crt-glow/20 px-2 py-0.5 rounded text-crt-text">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-bold">{post.comment_count} REPLIES</span>
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* Tactical pagination controls */}
        {!loading && pagination.total_pages > 1 && (
          <div className="flex justify-between items-center border border-crt-glow/20 p-3 rounded bg-black/20">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="border border-crt-glow/30 hover:border-crt-glow hover:bg-crt-glow/5 disabled:opacity-30 disabled:hover:bg-transparent px-3 py-1.5 rounded transition-all text-crt-text flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV CHANNEL</span>
            </button>

            <span className="text-xs text-crt-text/80 tracking-widest font-bold">
              SYS.SECTOR [{pagination.page}] / [{pagination.total_pages}]
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages}
              className="border border-crt-glow/30 hover:border-crt-glow hover:bg-crt-glow/5 disabled:opacity-30 disabled:hover:bg-transparent px-3 py-1.5 rounded transition-all text-crt-text flex items-center space-x-1"
            >
              <span>NEXT CHANNEL</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}