import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FirstRain.css';

import rainRipplesImg from '../assets/rain_ripples.png';

function FirstRain() {
    const sceneRef = useRef(null);
    const rainContainerRef = useRef(null);
    const [raindrops, setRaindrops] = useState([]);
    const [ripples, setRipples] = useState([]);

    useEffect(() => {
        // Generate initial raindrops
        const drops = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 1 + Math.random() * 1,
            height: 40 + Math.random() * 80
        }));
        setRaindrops(drops);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scene = sceneRef.current;

            // Increase rain density based on scroll
            ScrollTrigger.create({
                trigger: scene,
                start: 'top center',
                end: 'bottom center',
                onUpdate: (self) => {
                    const intensity = self.progress;
                    if (rainContainerRef.current) {
                        rainContainerRef.current.style.opacity = 0.3 + (intensity * 0.5);
                    }
                },
                scrub: true
            });

            // Text animations
            gsap.from('.rain-title', {
                y: 70,
                opacity: 0,
                duration: 1.4,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

            gsap.from('.rain-text', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                delay: 0.3,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

        }, sceneRef);

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e) => {
        // Intensify rain locally on hover
        const rect = sceneRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Create ripple at hover position
        const newRipple = {
            id: Date.now(),
            x,
            y
        };
        setRipples(prev => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1500);
    };

    return (
        <section
            ref={sceneRef}
            className="scene first-rain"
            onMouseMove={handleMouseMove}
        >
            {/* Background layers */}
            <div className="scene-bg">
                <div
                    className="parallax-layer rain-background"
                    data-speed="0.2"
                    style={{ backgroundImage: `url(${rainRipplesImg})` }}
                ></div>

                {/* Rain container */}
                <div ref={rainContainerRef} className="rain-container">
                    {raindrops.map((drop) => (
                        <div
                            key={drop.id}
                            className="raindrop"
                            style={{
                                left: `${drop.left}%`,
                                animationDelay: `${drop.delay}s`,
                                animationDuration: `${drop.duration}s`,
                                height: `${drop.height}px`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Water ripples */}
                <div className="ripples-container">
                    {ripples.map((ripple) => (
                        <div
                            key={ripple.id}
                            className="ripple"
                            style={{
                                left: `${ripple.x}%`,
                                top: `${ripple.y}%`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="scene-content">
                <h2 className="scene-title rain-title">First Rain</h2>
                <p className="story-text rain-text">
                    The first drops fall, tentative and gentle. Each one a messenger of renewal.
                    They tap against the earth, creating ripples that spread across still waters.
                    The rain grows stronger as you witness its journey, transforming the landscape
                    with every passing moment.
                </p>
                <p className="interaction-hint">Move your cursor to create ripples</p>
            </div>
        </section>
    );
}

export default FirstRain;
