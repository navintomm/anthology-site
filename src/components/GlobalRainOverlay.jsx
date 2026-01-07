import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const GlobalRainOverlay = ({ intensity, wind, time }) => {
    const canvasRef = useRef(null);
    const dropsRef = useRef([]);
    const requestRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        // Initialize drops
        // Max drops depends on intensity (0 to 1)
        // 0 = 0 drops, 1 = 1000 drops
        const maxDrops = 1000;

        // Drop class/object structure reduced to simple arrays for performance if needed, 
        // but objects are fine for 1000 items.

        const createDrop = () => ({
            x: Math.random() * width,
            y: Math.random() * height - height, // Start above
            length: Math.random() * 20 + 10,
            speed: Math.random() * 10 + 15,
            opacity: Math.random() * 0.5 + 0.1
        });

        // Fill pool
        if (dropsRef.current.length === 0) {
            for (let i = 0; i < maxDrops; i++) {
                dropsRef.current.push(createDrop());
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Calculate active drop count based on intensity
            // Intensity 0.0 -> 0 drops
            // Intensity 1.0 -> maxDrops
            // We'll just render a subset of the pool
            const activeCount = Math.floor(intensity * maxDrops);

            ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';

            // Wind affects x movement
            const windOffset = wind * 5;

            for (let i = 0; i < activeCount; i++) {
                const drop = dropsRef.current[i];

                // Update
                drop.y += drop.speed + (intensity * 10); // Faster when intense
                drop.x += windOffset;

                // Reset if out of bounds
                if (drop.y > height) {
                    drop.y = -drop.length - Math.random() * 100;
                    drop.x = Math.random() * (width + Math.abs(windOffset * 100)) - (windOffset > 0 ? Math.abs(windOffset * 50) : 0);
                    // Randomize speed again
                    drop.speed = Math.random() * 10 + 15;
                }

                // Wrap X if wind blows it off side
                if (drop.x > width + 50) drop.x = -50;
                if (drop.x < -50) drop.x = width + 50;

                // Draw
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x + windOffset, drop.y + drop.length);

                // Dynamic opacity based on individual drop + global intensity
                ctx.globalAlpha = drop.opacity * (0.5 + intensity * 0.5);
                ctx.stroke();
            }

            // Thunder Flash effect (simple overlay)
            // We can handle this via CSS on the container, but canvas is fine too if we pass a flash prop.
            // Leaving separate for now.

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(requestRef.current);
        };
    }, [intensity, wind]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9000, // Very high
                opacity: intensity > 0.01 ? 1 : 0,
                transition: 'opacity 0.5s ease'
            }}
        />
    );
};

GlobalRainOverlay.propTypes = {
    intensity: PropTypes.number.isRequired, // 0.0 to 1.0
    wind: PropTypes.number.isRequired, // -1.0 to 1.0
    time: PropTypes.number // optional ticker
};

export default GlobalRainOverlay;
