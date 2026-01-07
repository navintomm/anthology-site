import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Particles = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const particleCount = 30;

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random initial properties
            const size = Math.random() * 4 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            gsap.set(particle, {
                width: size,
                height: size,
                x: `${x}vw`,
                y: `${y}vh`,
                opacity: Math.random() * 0.5 + 0.1,
                background: i % 3 === 0 ? '#ff9933' : '#e62e2e', // Saffron & Red sparks
                position: 'absolute',
                borderRadius: '50%',
                boxShadow: `0 0 ${size * 2}px ${i % 3 === 0 ? '#ff9933' : '#e62e2e'}`
            });

            container.appendChild(particle);

            // Animate
            gsap.to(particle, {
                y: `+=${Math.random() * 20 + 10}vh`, // Float down/up
                x: `+=${Math.random() * 10 - 5}vw`,
                opacity: 0,
                duration: Math.random() * 5 + 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random() * 5
            });
        }
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1 // Behind hero, above background
            }}
        />
    );
};

export default Particles;
