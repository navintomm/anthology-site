import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MonsoonRailways.css';

import railwayWaterfallImg from '../assets/railway_waterfall.png';

function MonsoonRailways() {
    const sceneRef = useRef(null);
    const trainRef = useRef(null);
    const headlightRef = useRef(null);
    const signalRef = useRef(null);
    const fogRef = useRef(null);
    const rainContainerRef = useRef(null);
    const [trainSpeed, setTrainSpeed] = useState(10);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scene = sceneRef.current; // ... existing code ...


            // Train movement & Storm effects
            gsap.to(trainRef.current, {
                x: 800,
                ease: 'none',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    onUpdate: (self) => {
                        const velocity = self.getVelocity();
                        const speed = Math.abs(velocity / 100);

                        // Update train speed
                        setTrainSpeed(Math.min(speed, 30));

                        // Storm Intensity: Slant rain based on scroll direction & speed
                        const isScrollingDown = self.direction > 0;
                        const slant = Math.min(Math.abs(velocity / 40), 30) * (isScrollingDown ? -1 : 1);

                        if (rainContainerRef.current) {
                            gsap.to(rainContainerRef.current, {
                                skewX: slant,
                                opacity: 0.4 + (self.progress * 0.5), // More rain as we go deep
                                duration: 0.2,
                                ease: 'power1.out'
                            });
                        }

                        // LIGHTNING: Trigger flash if scrolling very fast
                        if (speed > 15 && Math.random() > 0.95) {
                            const flash = document.querySelector('.lightning-flash');
                            if (flash) {
                                gsap.to(flash, { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 1 });
                            }
                        }
                    }
                }
            });

            // Headlight glow effect
            gsap.to(headlightRef.current, {
                opacity: 0.8,
                scale: 1.2,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

            // Signal blinking
            gsap.to(signalRef.current, {
                opacity: 1,
                duration: 1,
                ease: 'steps(2)',
                repeat: -1,
                yoyo: true
            });

            // Fog movement
            gsap.to(fogRef.current, {
                x: -100,
                y: 30,
                duration: 8,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

            // Reflections on tracks
            gsap.to('.track-reflection', {
                opacity: 0.6,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

            // Text animations
            gsap.from('.railway-title', {
                y: 80,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

            gsap.from('.railway-text', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                delay: 0.4,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

        }, sceneRef);

        // Continuous chugging animation
        gsap.to(trainRef.current, {
            y: "-=5",
            duration: 0.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e) => {
        // Influence headlight glow based on cursor proximity
        if (!headlightRef.current) return;
        const rect = headlightRef.current.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        const intensity = Math.max(0.8, 2 - dist / 300);
        gsap.to(headlightRef.current, {
            scale: intensity * 1.2,
            opacity: Math.min(intensity, 1),
            duration: 0.3
        });
    };

    const handleSceneClick = () => {
        // Clicking triggers a cinematic lightning flash locally too
        const flash = document.querySelector('.lightning-flash');
        if (flash) {
            gsap.fromTo(flash,
                { opacity: 1 },
                { opacity: 0, duration: 0.4, ease: "power2.in" }
            );
        }
    };

    // Generate rain
    const raindrops = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.8 + Math.random() * 0.8
    }));

    return (
        <section
            ref={sceneRef}
            className="scene monsoon-railways"
            onMouseMove={handleMouseMove}
            onClick={handleSceneClick}
        >
            {/* Background layers */}
            <div className="scene-bg">
                <div className="lightning-flash"></div>
                <div
                    className="parallax-layer railway-background-img"
                    data-speed="0.3"
                    style={{ backgroundImage: `url(${railwayWaterfallImg})` }}
                ></div>

                {/* Fog layer */}
                <div ref={fogRef} className="fog-layer"></div>

                {/* Rain */}
                <div ref={rainContainerRef} className="rain-container-railways">
                    {raindrops.map((drop) => (
                        <div
                            key={drop.id}
                            className="raindrop heavy"
                            style={{
                                left: `${drop.left}%`,
                                animationDelay: `${drop.delay}s`,
                                animationDuration: `${drop.duration}s`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Railway tracks with reflections */}
                <div className="railway-tracks">
                    <div className="track track-1"></div>
                    <div className="track track-2"></div>
                    <div className="track-reflection"></div>
                </div>

                {/* Signal lights */}
                <div className="signal-post">
                    <div ref={signalRef} className="signal-light"></div>
                </div>

                {/* Train */}
                <div ref={trainRef} className="train" style={{ '--speed': trainSpeed }}>
                    <div className="train-body">
                        <div ref={headlightRef} className="headlight"></div>
                        <div className="train-window"></div>
                        <div className="train-window"></div>
                        <div className="train-wheel"></div>
                        <div className="train-wheel"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="scene-content">
                <h2 className="scene-title railway-title">Monsoon & Railways</h2>
                <p className="story-text railway-text">
                    Through sheets of rain, the train cuts across the landscape.
                    Its headlights pierce the fog, illuminating tracks that glisten
                    with reflected light. Signals blink in rhythm with the storm,
                    guiding journeys through the monsoon's embrace.
                </p>
                <p className="interaction-hint">Scroll faster to increase train speed</p>
            </div>
        </section>
    );
}

export default MonsoonRailways;
