'use client'

import { useEffect, useState, useCallback } from 'react'
import { commentsAPI } from '@/services/api'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
  }
  parent_id: string | null
  created_at: string
  updated_at: string | null
  replies?: Comment[]
}

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await commentsAPI.getComments(postId)
      setComments(data.comments || [])
    } catch (err: any) {
      console.error('Failed to fetch comments:', err)
      setError('댓글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return (
    <div className="space-y-6 font-mono">
      <div className="border border-crt-glow/30 bg-black/30 p-4 rounded">
        <h3 className="text-lg font-bold text-crt-text mb-4 tracking-wider">
          COMMENTS CHANNEL ({comments.length})
        </h3>
        <CommentForm postId={postId} onSuccess={fetchComments} />
      </div>

      {loading && <p className="text-xs text-crt-text/70 animate-pulse text-center">RETRIEVING COMMENTS DATA...</p>}
      {error && <p className="text-xs text-red-500 text-center">ERROR: {error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-xs text-crt-text/40 text-center py-4">NO SIGNAL. WRITE THE FIRST COMMENT.</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onUpdate={fetchComments}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
