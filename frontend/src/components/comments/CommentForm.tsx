'use client'

import { useState } from 'react'
import { commentsAPI } from '@/services/api'

interface CommentFormProps {
  postId: string
  parentId?: string
  onSuccess: () => void
  onCancel?: () => void
}

export function CommentForm({ postId, parentId, onSuccess, onCancel }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    try {
      await commentsAPI.createComment(postId, trimmed, parentId)
      setContent('')
      onSuccess()
    } catch (err: any) {
      console.error('Failed to submit comment:', err)
      setError(err.response?.data?.error || '댓글 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3 font-mono">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? 'ENTER REPLY DATA...' : 'ENTER COMMENT DATA...'}
          maxLength={1000}
          rows={parentId ? 2 : 3}
          className="w-full bg-black/60 border border-crt-glow/30 p-3 rounded text-crt-text placeholder-crt-text/30 focus:outline-none focus:border-crt-glow transition-colors resize-none text-sm"
          required
        />
        <div className="absolute bottom-2 right-3 text-[10px] text-crt-text/40">
          {content.length} / 1000 Bytes
        </div>
      </div>
      
      {error && (
        <p className="text-xs text-red-500 font-mono">ERROR: {error}</p>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 border border-red-500/50 hover:bg-red-950/20 text-red-500 rounded text-xs transition-all uppercase"
          >
            ABORT
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-1.5 border border-crt-glow hover:bg-crt-glow/10 text-crt-text rounded text-xs transition-all disabled:opacity-50 uppercase"
        >
          {loading ? 'TRANSMITTING...' : parentId ? 'SEND REPLY' : 'SEND COMMENT'}
        </button>
      </div>
    </form>
  )
}
