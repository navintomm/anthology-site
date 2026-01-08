import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../components/ScrollReveal';
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
        // Auto-ripples for "Always Alive" feeling
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // Random chance
                const x = 20 + Math.random() * 60; // Keep somewhat central
                const y = 20 + Math.random() * 60;
                createRipple(x, y);
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scene = sceneRef.current;

            // Scroll Control: Speed -> Wind/Intensity
            ScrollTrigger.create({
                trigger: scene,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: (self) => {
                    const velocity = self.getVelocity();
                    const isScrollingDown = self.direction > 0;

                    // Wind effect based on scroll speed (max slant 20deg)
                    const slant = Math.min(Math.abs(velocity / 50), 20) * (isScrollingDown ? -1 : 1);

                    if (rainContainerRef.current) {
                        // Intensity based on progress
                        const opacity = 0.3 + (self.progress * 0.6);

                        // Apply transforms
                        gsap.to(rainContainerRef.current, {
                            skewX: slant,
                            opacity: opacity,
                            duration: 0.5,
                            ease: 'power1.out'
                        });
                    }
                }
            });

            // Cinematic Camera: zoom on scroll
            // Note: Moved inside context for proper cleanup
            gsap.to('.rain-background', {
                scale: 1.1,
                scrollTrigger: {
                    trigger: scene,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // Text animations are now handled by ScrollReveal

        }, sceneRef);

        return () => ctx.revert();
    }, []);

    const createRipple = (x, y) => {
        const newRipple = {
            id: Date.now() + Math.random(),
            x,
            y
        };
        setRipples(prev => [...prev, newRipple]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1500);
    };

    const handleMouseMove = (e) => {
        const rect = sceneRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Interaction: Create ripple
        createRipple(x, y);
    };

    const handleSceneClick = (e) => {
        const rect = sceneRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Big splash on click
        createRipple(x, y);

        // Trigger a "Thunder flash" from the atmosphere controller indirectly
        // by dispatching a global click or something similar. 
        // Our AtmosphereController already listens to 'window click'.
    };

    return (
        <section
            ref={sceneRef}
            className="scene first-rain"
            onMouseMove={handleMouseMove}
            onClick={handleSceneClick}
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
                <ScrollReveal
                    containerClassName="scene-title rain-title"
                    baseRotation={-2}
                    blurStrength={5}
                >
                    First Rain
                </ScrollReveal>

                <div className="story-text rain-text">
                    <ScrollReveal
                        baseOpacity={0.1}
                        baseRotation={1}
                        blurStrength={3}
                        textClassName="story-paragraph"
                    >
                        The first drops fall, tentative and gentle. Each one a messenger of renewal.
                        They tap against the earth, creating ripples that spread across still waters.
                        The rain grows stronger as you witness its journey, transforming the landscape
                        with every passing moment.
                    </ScrollReveal>
                </div>

                <p className="interaction-hint">Move your cursor to create ripples</p>
            </div>
        </section>
    );
}

export default FirstRain;
