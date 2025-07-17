import React from 'react';

// Simplified static background with no animations
const AdventurousBackground = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#fbfbfb',
      zIndex: -10
    }} />
  );
};

export default AdventurousBackground;
