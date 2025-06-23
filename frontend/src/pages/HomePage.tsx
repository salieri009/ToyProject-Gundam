import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, Rocket } from 'lucide-react';
import { NixieNumber } from '../components/ui/NixieNumber';
import { StatusIndicator } from '../components/ui/StatusIndicator';

export function HomePage() {
  return (
    <div className="min-h-screen bg-ms-console-bg text-phosphor-green">
      <div className="container mx-auto px-4 py-8">
        {/* 메인 콘솔 */}
        <div className="gundam-console text-center mb-8 crt-scanlines">
          <div className="space-y-6">
            <div className="text-6xl federation-nixie mb-4">
              FEDERATION BBS NETWORK
            </div>
            
            <div className="text-2xl ms-hud-text">
              SIDE-7 COMMUNICATIONS TERMINAL
            </div>
            
            <div className="text-xl pilot-name">
              PRESS [ENTER] TO CONTINUE
            </div>
            
            <div className="flex justify-center space-x-8 my-8">
              <StatusIndicator status="all-green" label="ALL SYSTEMS" />
              <div className="flex items-center space-x-2 ms-hud-text">
                <span>Active Pilots:</span>
                <NixieNumber number={42} faction="federation" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Link to="/posts" className="federation-button p-6 block">
                <Terminal className="w-8 h-8 mx-auto mb-2" />
                <div>VIEW POSTS</div>
                <div className="text-sm mt-2">Browse Mission Reports</div>
              </Link>
              
              <Link to="/auth" className="anaheim-button p-6 block">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div>LOGIN</div>
                <div className="text-sm mt-2">Pilot Authentication</div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* 시스템 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="gundam-console">
            <div className="text-center">
              <Terminal className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="mission-title text-lg mb-2">MOBILE SUIT</div>
              <div className="pilot-name">RX-78-2 GUNDAM</div>
              <div className="ms-hud-text text-sm mt-2">
                Energy Output: 1.9MW<br />
                Armor: Luna Titanium<br />
                Pilot: Amuro Ray
              </div>
            </div>
          </div>
          
          <div className="gundam-console">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <div className="mission-title text-lg mb-2">NETWORK STATUS</div>
              <div className="pilot-name">OPERATIONAL</div>
              <div className="ms-hud-text text-sm mt-2">
                Connection: SECURE<br />
                Latency: 0.02ms<br />
                Encryption: ACTIVE
              </div>
            </div>
          </div>
          
          <div className="gundam-console">
            <div className="text-center">
              <Rocket className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="mission-title text-lg mb-2">MISSION STATUS</div>
              <div className="pilot-name">READY</div>
              <div className="ms-hud-text text-sm mt-2">
                Fuel: 100%<br />
                Weapons: ARMED<br />
                Systems: ALL GREEN
              </div>
            </div>
          </div>
        </div>
        
        {/* 최근 작전 보고서 */}
        <div className="gundam-console mt-8">
          <div className="ms-title-bar">
            RECENT OPERATION REPORTS
          </div>
          
          <div className="space-y-4">
            {[
              { id: 101, title: "New Gundam Field Test", pilot: "Amuro Ray", time: "14:30" },
              { id: 100, title: "Zeon Forces Movement", pilot: "Char Aznable", time: "13:45" },
              { id: 99, title: "Beam Rifle Calibration", pilot: "Kai Shiden", time: "12:20" },
              { id: 98, title: "White Base Maintenance", pilot: "Bright Noa", time: "11:15" },
            ].map((report) => (
              <div key={report.id} className="flex justify-between items-center p-3 border border-primary/30 rounded">
                <div className="flex items-center space-x-4">
                  <NixieNumber number={report.id} faction="federation" />
                  <span className="mission-title">{report.title}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="pilot-name">{report.pilot}</span>
                  <span className="ms-hud-text">{report.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link to="/posts" className="federation-button">
              VIEW ALL REPORTS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}