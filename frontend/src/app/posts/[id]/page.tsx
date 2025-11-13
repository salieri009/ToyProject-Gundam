'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { postsAPI, commentsAPI } from '@/services/api'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
  }
  created_at: string
  updated_at: string | null
  replies: Comment[]
}

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
  }
  comments: Comment[]
  created_at: string
  updated_at: string | null
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    fetchPost()
  }, [user, router, params.id])

  const fetchPost = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        postsAPI.getPost(params.id),
        commentsAPI.getComments(params.id)
      ])
      setPost({
        ...postData,
        comments: commentsData.comments || []
      })
    } catch (error) {
      console.error('Failed to fetch post:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await commentsAPI.createComment(params.id, newComment, replyTo || undefined)
      setNewComment('')
      setReplyTo(null)
      fetchPost()
    } catch (error) {
      console.error('Failed to submit comment:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

    try {
      await postsAPI.deletePost(params.id)
      router.push('/posts')
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  if (!post) return <div>Loading...</div>

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-between items-center text-gray-500">
            <span>{post.author.name}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <p>{post.content}</p>
        </div>

        {user?.id === post.author.id && (
          <div className="flex justify-end space-x-4 mb-8">
            <button
              onClick={() => router.push(`/posts/${params.id}/edit`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              삭제
            </button>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">댓글</h2>
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
              className="w-full p-4 border rounded-lg mb-2"
              rows={3}
            />
            <div className="flex justify-between">
              {replyTo && (
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-gray-500"
                >
                  답글 취소
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {replyTo ? '답글 작성' : '댓글 작성'}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{comment.author.name}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mb-2">{comment.content}</p>
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-blue-500 text-sm"
                >
                  답글
                </button>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{reply.author.name}</span>
                          <span className="text-gray-500 text-sm">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 