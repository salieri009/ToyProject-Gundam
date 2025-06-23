import React from 'react';

export const SeasonRuler: React.FC = () => {
  const getCurrentSeason = () => {
    const now = new Date();
    const month = now.getMonth();
    
    if (month >= 2 && month <= 4) return 0; // Spring
    if (month >= 5 && month <= 7) return 1; // Summer
    if (month >= 8 && month <= 10) return 2; // Fall
    return 3; // Winter
  };

  const seasons = [
    { name: 'Spring', class: 'season-spring' },
    { name: 'Summer', class: 'season-summer' },
    { name: 'Fall', class: 'season-fall' },
    { name: 'Winter', class: 'season-winter' }
  ];

  const currentSeason = getCurrentSeason();

  return (
    <div className="ruler-container mb-6">
      <div className="season-marks">
        {seasons.map((season, index) => (
          <div 
            key={index} 
            className={`season-mark ${season.class} ${index === currentSeason ? 'current-season' : ''}`}
          >
            <div className="season-mark-line"></div>
            <span className="season-label">{season.name}</span>
            {index === currentSeason && (
              <div className="season-marker"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};