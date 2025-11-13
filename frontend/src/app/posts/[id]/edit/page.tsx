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
  }
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    fetchPost()
  }, [user, router, params.id])

  const fetchPost = async () => {
    try {
      const data = await postsAPI.getPost(params.id)
      setPost(data)
      setTitle(data.title)
      setContent(data.content)
    } catch (error) {
      console.error('Failed to fetch post:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      await postsAPI.updatePost(params.id, title, content)
      router.push(`/posts/${params.id}`)
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  if (!post) return <div>Loading...</div>
  if (user?.id !== post.author.id) {
    router.push(`/posts/${params.id}`)
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8">게시글 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 border rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 border rounded-lg"
              rows={10}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </main>
  )
} 