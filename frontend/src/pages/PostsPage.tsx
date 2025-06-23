import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Clock, User, Plus } from 'lucide-react';
import { NixieNumber } from '../components/ui/NixieNumber';
import { StatusIndicator } from '../components/ui/StatusIndicator';

// Mock data for demonstration
const mockPosts = [
  {
    id: '101',
    title: 'New Gundam Field Test Results',
    content: 'Field test results for new beam rifle. Energy output: 1.9MW confirmed. Zaku armor penetration: SUCCESS. Recommend immediate mass production...',
    author: { id: '1', name: 'Amuro Ray' },
    comment_count: 12,
    created_at: '2024-01-15T14:30:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: '100',
    title: 'Zeon Forces Movement Analysis',
    content: 'Intelligence reports indicate significant Zeon mobile suit activity near Side 6. Recommend increased patrol frequency...',
    author: { id: '2', name: 'Char Aznable' },
    comment_count: 8,
    created_at: '2024-01-15T13:45:00Z',
    updated_at: '2024-01-15T13:45:00Z'
  },
  {
    id: '99',
    title: 'Beam Rifle Calibration Protocol',
    content: 'Updated calibration procedures for beam rifle targeting systems. Accuracy improved by 15% with new targeting algorithm...',
    author: { id: '3', name: 'Kai Shiden' },
    comment_count: 5,
    created_at: '2024-01-15T12:20:00Z',
    updated_at: '2024-01-15T12:20:00Z'
  },
  {
    id: '98',
    title: 'White Base Maintenance Schedule',
    content: 'Scheduled maintenance for White Base propulsion systems. Estimated downtime: 6 hours. All mobile suits to standby...',
    author: { id: '4', name: 'Bright Noa' },
    comment_count: 15,
    created_at: '2024-01-15T11:15:00Z',
    updated_at: '2024-01-15T11:15:00Z'
  },
  {
    id: '97',
    title: 'Jaburo Defense Plan Update',
    content: 'Updated defense protocols for Jaburo base. New mobile suit deployment patterns and patrol routes established...',
    author: { id: '5', name: 'Dozle Zabi' },
    comment_count: 22,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  }
];

export function PostsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `U.C.0079.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}.${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-ms-console-bg text-phosphor-green">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="gundam-console mb-8 crt-scanlines">
          <div className="ms-title-bar">
            OPERATION BRIEFING ROOM
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <StatusIndicator status="all-green" label="ALL SYSTEMS GO" />
              <div className="flex items-center space-x-2 ms-hud-text">
                <span>Active Pilots:</span>
                <NixieNumber number={42} faction="federation" />
              </div>
              <div className="flex items-center space-x-2 ms-hud-text">
                <span>Page</span>
                <NixieNumber number={1} faction="federation" />
                <span>/</span>
                <NixieNumber number={10} faction="federation" />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Link to="/posts/new" className="anaheim-button">
                <Plus className="w-4 h-4 inline mr-2" />
                NEW REPORT
              </Link>
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <div key={post.id} className="gundam-console hover:border-primary transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <NixieNumber number={parseInt(post.id)} faction="federation" />
                  <Link to={`/posts/${post.id}`} className="mission-title text-xl hover:text-secondary transition-colors">
                    {post.title}
                  </Link>
                </div>
                <div className="text-sm ms-hud-text">
                  {formatDate(post.created_at)}
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 line-clamp-2">
                {post.content}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="pilot-name">{post.author.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 ms-hud-text">
                    <MessageCircle className="w-4 h-4" />
                    <span>COMM {post.comment_count}</span>
                  </div>
                  <Link to={`/posts/${post.id}`} className="federation-button text-sm px-3 py-1">
                    VIEW REPORT
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="gundam-console mt-8">
          <div className="flex justify-center items-center space-x-4">
            <button className="federation-button text-sm px-3 py-1" disabled>
              PREV
            </button>
            
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded ${
                    page === 1 
                      ? 'anaheim-button text-sm' 
                      : 'federation-button text-sm'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button className="federation-button text-sm px-3 py-1">
              NEXT
            </button>
          </div>
        </div>

        {/* 시스템 상태 */}
        <div className="gundam-console mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="ms-hud-text">Network Status</div>
              <div className="pilot-name">STABLE</div>
            </div>
            <div>
              <div className="ms-hud-text">Connection</div>
              <div className="pilot-name">SECURE</div>
            </div>
            <div>
              <div className="ms-hud-text">System Load</div>
              <div className="pilot-name">OPTIMAL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}