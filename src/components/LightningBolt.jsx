import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './LightningBolt.css';

const LightningBolt = ({ trigger }) => {
    const [isActive, setIsActive] = useState(false);

    // Different lightning path variations
    const paths = [
        "M150 0 L130 150 L200 150 L100 400 L140 250 L80 250 L120 0",
        "M200 0 L150 120 L220 120 L120 450 L160 280 L40 280 L180 0",
        "M100 0 L140 100 L80 100 L180 350 L120 200 L200 200 L130 0"
    ];

    const [currentPath, setCurrentPath] = useState(paths[0]);
    const [position, setPosition] = useState({ left: '50%', scale: 1 });

    useEffect(() => {
        if (trigger) {
            // Pick random path and position
            setCurrentPath(paths[Math.floor(Math.random() * paths.length)]);
            setPosition({
                left: `${20 + Math.random() * 60}%`, // Avoid edges
                scale: 0.8 + Math.random() * 0.5
            });
            setIsActive(true);

            // Animate
            const timeline = gsap.timeline({
                onComplete: () => setIsActive(false)
            });

            // Flash 1: Quick strike
            timeline.set('.lightning-svg', { opacity: 0 });
            timeline.to('.lightning-svg', { opacity: 1, duration: 0.05, ease: 'power4.in' });
            timeline.to('.lightning-svg', { opacity: 0.1, duration: 0.05 });
            timeline.to('.lightning-svg', { opacity: 0.8, duration: 0.05 });
            timeline.to('.lightning-svg', { opacity: 0, duration: 0.4, ease: 'power2.out' });

        }
    }, [trigger]);

    if (!isActive) return null;

    return (
        <div className="lightning-container">
            <svg
                className="lightning-svg"
                viewBox="0 0 300 500"
                style={{
                    left: position.left,
                    transform: `scale(${position.scale})`
                }}
            >
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <path
                    d={currentPath}
                    fill="white"
                    filter="url(#glow)"
                />
            </svg>
            <div className="lightning-flash-overlay"></div>
        </div>
    );
};

export default LightningBolt;
