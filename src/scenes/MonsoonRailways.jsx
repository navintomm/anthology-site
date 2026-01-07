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


            // Train movement controlled by scroll
            gsap.to(trainRef.current, {
                x: 800,
                ease: 'none',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    onUpdate: (self) => {
                        // Update train speed based on scroll velocity
                        const velocity = Math.abs(self.getVelocity() / 100);
                        setTrainSpeed(Math.min(velocity, 30));

                        // Control rain intensity
                        if (rainContainerRef.current) {
                            rainContainerRef.current.style.opacity = 0.4 + (self.progress * 0.4);
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

        return () => ctx.revert();
    }, []);

    // Generate rain
    const raindrops = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.8 + Math.random() * 0.8
    }));

    return (
        <section ref={sceneRef} className="scene monsoon-railways">
            {/* Background layers */}
            <div className="scene-bg">
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
