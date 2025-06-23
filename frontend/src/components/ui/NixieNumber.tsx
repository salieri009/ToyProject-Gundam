import React from 'react';

interface NixieNumberProps {
  number: number;
  faction?: 'federation' | 'zeon' | 'anaheim';
  className?: string;
}

export function NixieNumber({ number, faction = 'federation', className = '' }: NixieNumberProps) {
  const getFactionClass = () => {
    switch (faction) {
      case 'federation':
        return 'federation-nixie';
      case 'zeon':
        return 'zeon-nixie';
      case 'anaheim':
        return 'pilot-name';
      default:
        return 'federation-nixie';
    }
  };

  return (
    <span className={`${getFactionClass()} ${className}`}>
      [{number}]
    </span>
  );
}