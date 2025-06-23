import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Users, FileText } from 'lucide-react';

export function Header() {
  return (
    <header className="gundam-console mb-8 crt-scanlines">
      <div className="ms-title-bar">
        MOBILE SUIT OS v.U.C.0079 - FEDERATION BBS NETWORK
      </div>
      
      <nav className="flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <Terminal className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-orbitron font-bold mission-title">
              GUNDAM UNIVERSE
            </h1>
            <p className="text-sm ms-hud-text">SIDE-7 COMMUNICATIONS</p>
          </div>
        </Link>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 ms-hud-text">
            <span>Status:</span>
            <div className="ms-status-led all-green"></div>
            <span>ALL GREEN</span>
          </div>
          
          <div className="flex items-center space-x-2 ms-hud-text">
            <Users className="w-4 h-4" />
            <span>Pilots: [42]</span>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/posts" className="federation-button">
              VIEW POSTS
            </Link>
            <Link to="/auth" className="anaheim-button">
              LOGIN
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}