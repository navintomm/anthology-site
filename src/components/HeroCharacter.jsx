import React, { forwardRef } from 'react';
import swing1 from '../assets/swing_1.png';
import swing2 from '../assets/swing_2.png';
import swing3 from '../assets/swing_3.png';

const images = [swing1, swing2, swing3];

const HeroCharacter = forwardRef(({ frame = 0, className = '' }, ref) => {
  // frame is expected to be a float 0..2.99 from GSAP
  // We map it to an integer index
  const imageIndex = Math.min(Math.max(Math.floor(frame), 0), 2);
  const currentImage = images[imageIndex];

  return (
    <div ref={ref} className={`hero-container ${className}`} style={{
      width: '400px',
      height: '400px',
      position: 'relative',
      // Center the image within the container
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Web Line */}
      <svg style={{ position: 'absolute', bottom: '50%', left: '50%', width: '2px', height: '100vh', overflow: 'visible', zIndex: -1, pointerEvents: 'none' }}>
        <line x1="0" y1="0" x2="100" y2="-1000" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      </svg>

      <img
        src={currentImage}
        alt="Masked Hero"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))'
        }}
      />
    </div>
  );
});

export default HeroCharacter;
