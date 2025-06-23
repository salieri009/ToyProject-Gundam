import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, X } from 'lucide-react';
import { StatusIndicator } from '../components/ui/StatusIndicator';

export function NewPostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting post:', formData);
    // Navigate back to posts page
    navigate('/posts');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-ms-console-bg text-phosphor-green">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="gundam-console mb-8 crt-scanlines">
          <div className="ms-title-bar">
            COMPOSE OPERATION REPORT
          </div>
          
          <div className="flex justify-between items-center">
            <Link to="/posts" className="federation-button">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              CANCEL MISSION
            </Link>
            
            <div className="flex items-center space-x-6">
              <StatusIndicator status="all-green" label="ALL GREEN" />
              <div className="ms-hud-text">
                System Status: READY FOR INPUT
              </div>
            </div>
          </div>
        </div>

        {/* 작성 폼 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="gundam-console">
            <div className="space-y-6">
              <div>
                <label className="block ms-hud-text text-lg mb-3">
                  MISSION DESIGNATION:
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="ms-input w-full text-xl"
                  placeholder="ENTER MISSION TITLE..."
                  required
                  maxLength={200}
                />
                <div className="text-right text-sm ms-hud-text mt-1">
                  {formData.title.length}/200 characters
                </div>
              </div>
              
              <div>
                <label className="block ms-hud-text text-lg mb-3">
                  OPERATION DETAILS:
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="ms-input w-full h-96 resize-none font-vt323 text-lg leading-relaxed"
                  placeholder="ENTER DETAILED OPERATION REPORT...

MISSION PARAMETERS:
- 

RESULTS:
> 

RECOMMENDATIONS:
> 

END REPORT"
                  required
                  maxLength={10000}
                />
                <div className="text-right text-sm ms-hud-text mt-1">
                  {formData.content.length}/10,000 characters
                </div>
              </div>
            </div>
          </div>

          {/* 미리보기 */}
          {(formData.title || formData.content) && (
            <div className="gundam-console">
              <div className="ms-title-bar">
                MISSION REPORT PREVIEW
              </div>
              
              <div className="space-y-4">
                {formData.title && (
                  <h2 className="text-2xl mission-title">{formData.title}</h2>
                )}
                
                <div className="ms-hud-text">
                  <span>PILOT: Amuro Ray (RX-78-2)</span>
                  <span className="mx-4">|</span>
                  <span>TIMESTAMP: U.C.0079.01.15.14:30</span>
                  <span className="mx-4">|</span>
                  <span>LOCATION: Side-7 Colony</span>
                </div>
                
                {formData.content && (
                  <div className="border-t border-primary/30 pt-4">
                    <pre className="whitespace-pre-wrap font-vt323 text-lg leading-relaxed text-gray-300">
                      {formData.content}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="gundam-console">
            <div className="flex justify-center space-x-6">
              <button
                type="submit"
                className="anaheim-button text-lg px-8 py-4"
                disabled={!formData.title.trim() || !formData.content.trim()}
              >
                <Send className="w-5 h-5 inline mr-2" />
                TRANSMIT REPORT
              </button>
              
              <Link to="/posts" className="federation-button text-lg px-8 py-4">
                <X className="w-5 h-5 inline mr-2" />
                CANCEL
              </Link>
            </div>
            
            <div className="text-center mt-4 ms-hud-text">
              System Status: READY FOR TRANSMISSION
            </div>
          </div>
        </form>

        {/* 도움말 */}
        <div className="gundam-console mt-8">
          <div className="ms-title-bar">
            OPERATION REPORT GUIDELINES
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="mission-title mb-3">FORMATTING GUIDELINES:</h3>
              <ul className="ms-hud-text space-y-1">
                <li>- Use clear, concise military language</li>
                <li>- Include mission parameters and results</li>
                <li>- Provide specific technical details</li>
                <li>- End with recommendations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="mission-title mb-3">SECURITY PROTOCOLS:</h3>
              <ul className="ms-hud-text space-y-1">
                <li>- Classification: FEDERATION EYES ONLY</li>
                <li>- No unauthorized personnel access</li>
                <li>- Encrypt sensitive technical data</li>
                <li>- Follow chain of command</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}