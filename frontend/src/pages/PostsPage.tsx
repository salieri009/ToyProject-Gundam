import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Clock, User, Plus } from 'lucide-react';
import { NixieNumber } from '../components/ui/NixieNumber';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { postsAPI } from '../services/api';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  comment_count: number;
  created_at: string;
  updated_at: string | null;
}

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const loadPosts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsAPI.getPosts(page, 10);
      setPosts(data.posts);
      setTotalPages(data.pagination.total_pages);
    } catch (err: any) {
      console.error('Failed to load posts:', err);
      setError(err.response?.data?.error || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

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
                <NixieNumber number={currentPage} faction="federation" />
                <span>/</span>
                <NixieNumber number={totalPages} faction="federation" />
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
        {loading && (
          <div className="gundam-console text-center py-8">
            <div className="ms-hud-text">LOADING REPORTS...</div>
          </div>
        )}
        
        {error && (
          <div className="gundam-console bg-red-900/50 border border-red-500 rounded p-4 text-red-200 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="gundam-console text-center py-8">
                <div className="ms-hud-text">NO REPORTS AVAILABLE</div>
              </div>
            ) : (
              posts.map((post) => (
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
              ))
            )}
          </div>
        )}

        {/* 페이지네이션 */}
        {!loading && totalPages > 1 && (
          <div className="gundam-console mt-8">
            <div className="flex justify-center items-center space-x-4">
              <button 
                className="federation-button text-sm px-3 py-1" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                PREV
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded ${
                        page === currentPage 
                          ? 'anaheim-button text-sm' 
                          : 'federation-button text-sm'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button 
                className="federation-button text-sm px-3 py-1"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                NEXT
              </button>
            </div>
          </div>
        )}

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