import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Terminal, Users } from 'lucide-react';
import { StatusIndicator } from '../components/ui/StatusIndicator';

export function AuthPage() {
  const handleGoogleLogin = () => {
    // Handle Google OAuth login
    console.log('Google login initiated');
  };

  return (
    <div className="min-h-screen bg-ms-console-bg text-phosphor-green">
      <div className="container mx-auto px-4 py-8">
        {/* 메인 로그인 콘솔 */}
        <div className="max-w-2xl mx-auto">
          <div className="gundam-console mb-8 crt-scanlines">
            <div className="ms-title-bar">
              PILOT AUTHENTICATION SYSTEM
            </div>
            
            <div className="text-center space-y-8">
              <div className="text-4xl federation-nixie">
                PILOT LOGIN
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Shield className="w-24 h-24 text-primary" />
                </div>
                
                <button
                  onClick={handleGoogleLogin}
                  className="anaheim-button text-xl px-12 py-6 mx-auto block"
                >
                  <Terminal className="w-6 h-6 inline mr-3" />
                  GOOGLE LOGIN
                </button>
                
                <div className="ms-hud-text">
                  SECURE AUTHENTICATION PROTOCOL
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <StatusIndicator status="all-green" label="READY FOR LOGIN" />
                </div>
                
                <div className="ms-hud-text">
                  Mobile Suit OS: 100% READY
                </div>
              </div>
            </div>
          </div>

          {/* 시스템 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="gundam-console">
              <div className="text-center">
                <Terminal className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="mission-title text-lg mb-2">SYSTEM STATUS</div>
                <div className="space-y-2 ms-hud-text">
                  <div>Authentication: ACTIVE</div>
                  <div>Security Level: MAXIMUM</div>
                  <div>Encryption: 256-BIT</div>
                </div>
              </div>
            </div>
            
            <div className="gundam-console">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <div className="mission-title text-lg mb-2">PILOT REGISTRY</div>
                <div className="space-y-2 ms-hud-text">
                  <div>Active Pilots: 42</div>
                  <div>On Standby: 15</div>
                  <div>In Combat: 8</div>
                </div>
              </div>
            </div>
          </div>

          {/* 보안 공지 */}
          <div className="gundam-console">
            <div className="ms-title-bar">
              SECURITY PROTOCOLS
            </div>
            
            <div className="space-y-4">
              <div className="border border-secondary/50 rounded p-4 bg-secondary/10">
                <div className="mission-title text-secondary mb-2">
                  WARNING: CLASSIFIED SYSTEM ACCESS
                </div>
                <div className="ms-hud-text">
                  This system contains classified Federation military information. 
                  Unauthorized access is strictly prohibited and will be prosecuted 
                  under Universal Century military law.
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="pilot-name mb-2">AUTHORIZED PERSONNEL ONLY:</div>
                  <ul className="ms-hud-text space-y-1 text-sm">
                    <li>- Federation Mobile Suit Pilots</li>
                    <li>- White Base Crew Members</li>
                    <li>- Authorized Military Personnel</li>
                    <li>- Anaheim Electronics Engineers</li>
                  </ul>
                </div>
                
                <div>
                  <div className="pilot-name mb-2">SECURITY FEATURES:</div>
                  <ul className="ms-hud-text space-y-1 text-sm">
                    <li>- Multi-factor Authentication</li>
                    <li>- Encrypted Communications</li>
                    <li>- Session Monitoring</li>
                    <li>- Automatic Logout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="text-center mt-8">
            <Link to="/" className="federation-button">
              RETURN TO MAIN CONSOLE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}