'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { commentsAPI } from '@/services/api'
import { CommentForm } from './CommentForm'
import { Edit2, Trash2, CornerDownRight } from 'lucide-react'

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

interface CommentItemProps {
  comment: Comment
  postId: string
  onUpdate: () => void
}

export function CommentItem({ comment, postId, onUpdate }: CommentItemProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthor = user?.id === comment.author.id

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editContent.trim()) return

    setLoading(true)
    setError(null)
    try {
      await commentsAPI.updateComment(comment.id, editContent.trim())
      setIsEditing(false)
      onUpdate()
    } catch (err: any) {
      console.error('Failed to update comment:', err)
      setError(err.response?.data?.error || '댓글 수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return

    setLoading(true)
    try {
      await commentsAPI.deleteComment(comment.id)
      onUpdate()
    } catch (err) {
      console.error('Failed to delete comment:', err)
      alert('댓글 삭제에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-crt-glow/20 bg-black/20 p-4 rounded relative font-mono text-sm">
      <div className="flex justify-between items-center mb-2 text-xs border-b border-crt-glow/10 pb-1">
        <span className="text-crt-text font-bold">PILOT: {comment.author.name}</span>
        <div className="flex items-center space-x-3 text-crt-text/60">
          <span>{new Date(comment.created_at).toLocaleString()}</span>
          {comment.updated_at && <span className="text-[10px] text-yellow-500/80">UPDATED</span>}
          {isAuthor && !isEditing && (
            <div className="flex items-center space-x-2 border-l border-crt-glow/20 pl-2">
              <button
                onClick={() => setIsEditing(true)}
                className="hover:text-crt-text transition-colors"
                title="EDIT"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="hover:text-red-500 text-red-500/70 transition-colors"
                title="DELETE"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-black/60 border border-crt-glow/50 p-2.5 rounded text-crt-text text-sm focus:outline-none focus:border-crt-glow resize-none"
            rows={2}
            required
          />
          {error && <p className="text-xs text-red-500 font-mono">ERROR: {error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 border border-red-500/50 text-red-500 rounded text-xs uppercase"
            >
              ABORT
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 border border-crt-glow text-crt-text rounded text-xs uppercase"
            >
              {loading ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-crt-text/90 leading-relaxed whitespace-pre-wrap py-1">{comment.content}</p>
      )}

      {/* 대댓글 작성을 위한 답글 버튼 (부모 댓글에만 노출) */}
      {!comment.parent_id && !isEditing && (
        <div className="mt-2.5 flex justify-start">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs border border-crt-glow/30 hover:border-crt-glow px-2 py-0.5 rounded text-crt-text/70 hover:text-crt-text transition-all flex items-center space-x-1"
          >
            <CornerDownRight className="w-3 h-3" />
            <span>REPLY</span>
          </button>
        </div>
      )}

      {showReplyForm && (
        <div className="mt-3 border-l-2 border-crt-glow/30 pl-4">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={() => {
              setShowReplyForm(false)
              onUpdate()
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* 대댓글(replies) 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-crt-glow/10 pt-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start space-x-2 ml-4">
              <CornerDownRight className="w-4 h-4 text-crt-text/40 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <CommentItem
                  comment={reply}
                  postId={postId}
                  onUpdate={onUpdate}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
