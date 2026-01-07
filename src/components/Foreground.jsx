import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Foreground = () => {
    const layerRef = useRef(null);

    useEffect(() => {
        // Create electric poles
        const poles = [];
        for (let i = 0; i < 5; i++) {
            poles.push(
                <div key={i} className="pole" style={{
                    position: 'absolute',
                    left: `${i * 30 + 10}%`,
                    top: '-20%',
                    height: '140%',
                    width: '20px',
                    background: '#111',
                    zIndex: 20,
                    filter: 'blur(4px)' // Depth of field
                }}>
                    {/* Wires */}
                    <div style={{ position: 'absolute', top: '20%', width: '300px', height: '2px', background: '#222', transform: 'rotate(10deg)' }} />
                </div>
            )
        }

        // Parallax movement
        gsap.to(".fg-layer", {
            x: '-100vw',
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 2 // Faster scrub than background
            }
        });

    }, []);

    return (
        <div className="fg-layer" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '200vw', // Wider for scrolling
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50, // Topmost
            display: 'flex',
            opacity: 0.6
        }}>
            {/* Abstract Electric Poles/Wires passing by */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: `${i * 400 + 100}px`,
                    top: 0,
                    height: '100%',
                    width: '10px',
                    background: 'black',
                    filter: 'blur(3px)'
                }}>
                    <div style={{ width: '100px', height: '10px', background: '#111', marginLeft: '-40px', marginTop: '20vh' }}></div>
                </div>
            ))}
        </div>
    );
};

export default Foreground;
