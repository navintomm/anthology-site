import React, { useEffect, useRef } from 'react';
import './SpideySense.css';
import stationDay from '../assets/station_day.png';
import stationDanger from '../assets/station_danger.png';

const SpideySense = () => {
    const containerRef = useRef(null);
    const revealRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const reveal = revealRef.current;

        let mouseX = 0;
        let mouseY = 0;
        let x = 0;
        let y = 0;

        const animate = () => {
            // Smooth follow logic (lerp)
            x += (mouseX - x) * 0.1;
            y += (mouseY - y) * 0.1;

            if (reveal) {
                reveal.style.setProperty('--x', `${x}px`);
                reveal.style.setProperty('--y', `${y}px`);
            }

            requestAnimationFrame(animate);
        };

        const move = (e) => {
            // Get relative position within the specific container
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const animationId = requestAnimationFrame(animate);
        container.addEventListener('mousemove', move);

        return () => {
            cancelAnimationFrame(animationId);
            container.removeEventListener('mousemove', move);
        };
    }, []);

    return (
        <div className="spidey-sense-container" ref={containerRef}>
            {/* Base Layer: Peaceful Day */}
            <div className="layer-day" style={{ backgroundImage: `url(${stationDay})` }}>
                <h2 className="layer-title">MUMBAI CENTRAL</h2>
            </div>

            {/* Reveal Layer: Danger (Masked) */}
            <div className="layer-danger" ref={revealRef} style={{ backgroundImage: `url(${stationDanger})` }}>
                <h2 className="layer-title danger-text">DANGER DETECTED</h2>
            </div>

            <div className="instruction-text">Hover to enable Spidey Sense</div>
        </div>
    );
};

export default SpideySense;
