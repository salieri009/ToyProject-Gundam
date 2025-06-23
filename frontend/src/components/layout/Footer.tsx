import React from 'react';

export function Footer() {
  return (
    <footer className="mt-16 gundam-console">
      <div className="text-center space-y-2">
        <div className="ms-hud-text">
          <span>Mobile Suit: RX-78-2 GUNDAM</span>
          <span className="mx-4">|</span>
          <span>Network: STABLE</span>
          <span className="mx-4">|</span>
          <span>Connection: SECURE</span>
        </div>
        <div className="text-sm text-gray-500">
          (C) U.C.0079 ANAHEIM ELECTRONICS - ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}