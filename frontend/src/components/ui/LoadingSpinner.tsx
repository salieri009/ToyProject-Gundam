import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="gundam-console p-8 text-center">
        <div className="animate-gundam-boot">
          <div className="text-4xl federation-nixie mb-4">⚡⚡⚡</div>
          <div className="ms-hud-text">MOBILE SUIT OS LOADING...</div>
          <div className="mt-4">
            <div className="w-64 h-2 bg-ms-console-surface rounded-full mx-auto">
              <div className="h-full bg-federation-blue rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}