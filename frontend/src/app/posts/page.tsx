'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { postsAPI } from '@/services/api'

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
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    fetchPosts()
  }, [user, router, pagination.page])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await postsAPI.getPosts(pagination.page, pagination.limit)
      setPosts(data.posts)
      setPagination(data.pagination)
    } catch (err: any) {
      console.error('Failed to fetch posts:', err)
      setError(err.response?.data?.error || '게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">게시글 목록</h1>
          <button
            onClick={() => router.push('/posts/new')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            글쓰기
          </button>
        </div>

        {loading && <div className="text-center py-8">로딩 중...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">게시글이 없습니다.</div>
            ) : (
              posts.map((post) => (
            <div
              key={post.id}
              className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.content}</p>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>{post.author.name}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
              ))
            )}
          </div>
        )}

        {!loading && pagination.total_pages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPagination({ ...pagination, page })}
              className={`px-3 py-1 rounded ${
                page === pagination.page ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          </div>
        )}
      </div>
    </main>
  )
} 