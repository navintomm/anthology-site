import React from 'react';

const FactPanel = ({ title, content, style }) => {
    return (
        <div className="railway-board" style={{
            maxWidth: '350px',
            background: '#FFD700', // Indian Railway Yellow
            color: '#000',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '4px solid #000',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255, 165, 0, 0.5)',
            fontFamily: "'Outfit', sans-serif",
            textAlign: 'center',
            transform: 'rotate(-2deg)',
            ...style
        }}>
            <div style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px' }}>{title}</h3>
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>(IR - NETWORK)</span>
            </div>
            <p style={{ fontSize: '1rem', lineHeight: '1.4', fontWeight: '500' }}>
                {content}
            </p>

            {/* Screws/Rivets for realism */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '8px', height: '8px', background: '#333', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: '#333', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '8px', height: '8px', background: '#333', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '8px', height: '8px', background: '#333', borderRadius: '50%' }} />
        </div>
    );
};

export default FactPanel;
