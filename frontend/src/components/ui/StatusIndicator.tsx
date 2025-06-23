import React from 'react';

interface StatusIndicatorProps {
  status: 'all-green' | 'caution' | 'alert';
  label: string;
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  return (
    <div className="flex items-center space-x-2 ms-hud-text">
      <div className={`ms-status-led ${status}`}></div>
      <span>{label}</span>
    </div>
  );
}