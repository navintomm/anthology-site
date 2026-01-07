import React, { forwardRef } from 'react';
import trainImg from '../assets/train.png';

const Train = forwardRef(({ className = '' }, ref) => {
    return (
        <div ref={ref} className={`train-container ${className}`} style={{
            width: '800px',
            height: '300px',
            background: `url(${trainImg}) no-repeat center center / contain`,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
        }}>
            {/* Image replaced SVG */}
        </div>
    );
});

export default Train;
