import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MonsoonRailways.css';

import railwayWaterfallImg from '../assets/railway_waterfall.png';

function MonsoonRailways() {
    const sceneRef = useRef(null);
    const fogRef = useRef(null);
    const rainContainerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scene = sceneRef.current;


            // Storm Intensity: Slant rain based on scroll direction & speed
            ScrollTrigger.create({
                trigger: scene,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    const velocity = self.getVelocity();
                    const speed = Math.abs(velocity / 100);
                    const isScrollingDown = self.direction > 0;
                    const slant = Math.min(Math.abs(velocity / 40), 30) * (isScrollingDown ? -1 : 1);

                    if (rainContainerRef.current) {
                        gsap.to(rainContainerRef.current, {
                            skewX: slant,
                            opacity: 0.4 + (self.progress * 0.5),
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

            // Reflections on tracks (keeping as a subtle environmental detail)
            gsap.to('.track-reflection', {
                opacity: 0.3,
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

                {/* Railway tracks with subtle reflections */}
                <div className="railway-tracks">
                    <div className="track track-1"></div>
                    <div className="track track-2"></div>
                    <div className="track-reflection"></div>
                </div>
            </div>

            {/* Content */}
            <div className="scene-content">
                <h2 className="scene-title railway-title">Monsoon & Railways</h2>
                <p className="story-text railway-text">
                    In the heart of the Western Ghats, the tracks wind through misty peaks.
                    Sheets of rain fall over the ancient iron, while distant waterfalls
                    surge with new life. Even in the height of the storm, the landscape
                    possesses a haunting, metallic beauty.
                </p>
                <p className="interaction-hint">Click to trigger lightning</p>
            </div>
        </section>
    );
}

export default MonsoonRailways;
