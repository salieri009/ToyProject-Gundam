import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, MessageCircle, Edit, Trash2, Reply } from 'lucide-react';
import { NixieNumber } from '../components/ui/NixieNumber';
import { StatusIndicator } from '../components/ui/StatusIndicator';

// Mock data
const mockPost = {
  id: '101',
  title: 'New Gundam Field Test Results',
  content: `Field test results for new beam rifle conducted at Side-7 testing facility.

MISSION PARAMETERS:
- Target: Zaku II armor plating
- Distance: 500m, 1000m, 1500m
- Energy output: 1.9MW confirmed
- Beam convergence: 99.7% efficiency

RESULTS:
> Zaku armor penetration: SUCCESS at all ranges
> Energy consumption: Within acceptable parameters
> Targeting accuracy: 95% hit rate
> Weapon stability: Excellent

RECOMMENDATIONS:
> Recommend immediate mass production
> Deploy to all RX-78 units
> Additional training required for optimal usage
> Consider upgrading existing beam weapons

The new beam rifle represents a significant advancement in mobile suit weaponry. The increased power output and improved focusing system make it highly effective against current Zeon armor configurations.

PILOT ASSESSMENT:
The weapon handles well in combat situations. Recoil is minimal due to the improved stabilization system. Recommend standard deployment to all Federation mobile suit units.

END REPORT`,
  author: { id: '1', name: 'Amuro Ray' },
  created_at: '2024-01-15T14:30:00Z',
  updated_at: '2024-01-15T14:30:00Z'
};

const mockComments = [
  {
    id: '1',
    content: 'Impressive firepower! The beam rifle\'s performance exceeds expectations. This could change the tide of the war.',
    author: { id: '2', name: 'Char Aznable' },
    parent_id: null,
    created_at: '2024-01-15T15:00:00Z',
    updated_at: '2024-01-15T15:00:00Z',
    replies: [
      {
        id: '2',
        content: 'Char, you saw that?! The Zaku armor was like paper against this new weapon.',
        author: { id: '3', name: 'White Base Crew' },
        parent_id: '1',
        created_at: '2024-01-15T15:15:00Z',
        updated_at: '2024-01-15T15:15:00Z'
      }
    ]
  },
  {
    id: '3',
    content: 'Excellent work, Amuro. The technical specifications look solid. We should prioritize production immediately.',
    author: { id: '4', name: 'Bright Noa' },
    parent_id: null,
    created_at: '2024-01-15T15:30:00Z',
    updated_at: '2024-01-15T15:30:00Z',
    replies: []
  }
];

export function PostDetailPage() {
  const { id } = useParams();
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `U.C.0079.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}.${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission
    console.log('Submitting comment:', newComment);
    setNewComment('');
    setShowReplyForm(null);
  };

  return (
    <div className="min-h-screen bg-ms-console-bg text-phosphor-green">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="gundam-console mb-8 crt-scanlines">
          <div className="ms-title-bar">
            OPERATION REPORT: <NixieNumber number={parseInt(id || '101')} faction="federation" />
          </div>
          
          <div className="flex justify-between items-center">
            <Link to="/posts" className="federation-button">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              BACK TO BRIEFING
            </Link>
            
            <div className="flex items-center space-x-6">
              <StatusIndicator status="all-green" label="SECURE CONNECTION" />
              <div className="ms-hud-text">
                Classification: FEDERATION EYES ONLY
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 내용 */}
        <div className="gundam-console mb-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl mission-title mb-4">{mockPost.title}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span className="ms-hud-text">PILOT:</span>
                    <span className="pilot-name">{mockPost.author.name}</span>
                    <span className="ms-hud-text">(RX-78-2)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="ms-hud-text">TIMESTAMP:</span>
                    <span className="pilot-name">{formatDate(mockPost.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="anaheim-button text-sm px-3 py-1">
                    <Edit className="w-4 h-4 inline mr-1" />
                    EDIT
                  </button>
                  <button className="federation-button text-sm px-3 py-1 text-secondary border-secondary">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    DELETE
                  </button>
                </div>
              </div>
            </div>
            
            <div className="ms-hud-text">
              <span>LOCATION: Side-7 Colony</span>
              <span className="mx-4">|</span>
              <span>SECURITY LEVEL: CLASSIFIED</span>
            </div>
            
            <div className="border-t border-primary/30 pt-6">
              <pre className="whitespace-pre-wrap font-vt323 text-lg leading-relaxed text-gray-300">
                {mockPost.content}
              </pre>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="gundam-console">
          <div className="ms-title-bar">
            PILOT COMMUNICATIONS
          </div>
          
          {/* 새 댓글 작성 */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <label className="block ms-hud-text mb-2">
                TRANSMIT MESSAGE:
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="ms-input w-full h-24 resize-none"
                placeholder="ENTER COMMUNICATION MESSAGE..."
              />
            </div>
            <button type="submit" className="anaheim-button">
              TRANSMIT MESSAGE
            </button>
          </form>
          
          {/* 댓글 목록 */}
          <div className="space-y-6">
            {mockComments.map((comment) => (
              <div key={comment.id} className="border border-primary/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-4">
                    <span className="pilot-name">{comment.author.name}</span>
                    <span className="ms-hud-text text-sm">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setShowReplyForm(showReplyForm === comment.id ? null : comment.id)}
                    className="federation-button text-xs px-2 py-1"
                  >
                    <Reply className="w-3 h-3 inline mr-1" />
                    REPLY
                  </button>
                </div>
                
                <p className="text-gray-300 mb-3 font-vt323 text-lg">
                  {comment.content}
                </p>
                
                {showReplyForm === comment.id && (
                  <form onSubmit={handleSubmitComment} className="mt-4 ml-8">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="ms-input w-full h-20 resize-none text-sm"
                      placeholder="REPLY TO COMMUNICATION..."
                    />
                    <div className="flex space-x-2 mt-2">
                      <button type="submit" className="anaheim-button text-xs px-3 py-1">
                        SEND REPLY
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReplyForm(null)}
                        className="federation-button text-xs px-3 py-1"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}
                
                {/* 대댓글 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-secondary/50 pl-4">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="pilot-name text-sm">{reply.author.name}</span>
                          <span className="ms-hud-text text-xs">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-300 font-vt323">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 명령어 */}
        <div className="gundam-console mt-8">
          <div className="text-center ms-hud-text">
            {"CMD> COMM Reply | EDIT Modify | ESC Exit | HOME Return to Base"}
          </div>
        </div>
      </div>
    </div>
  );
}