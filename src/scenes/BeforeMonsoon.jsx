import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BeforeMonsoon.css';

import dryEarthImg from '../assets/dry_earth.png';

function BeforeMonsoon() {
    const sceneRef = useRef(null);
    const cracksRef = useRef([]);
    const heatWaveRef = useRef(null);
    const [dustPuffs, setDustPuffs] = useState([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scene = sceneRef.current;

            // Heat distortion effect
            gsap.to(heatWaveRef.current, {
                y: -20,
                opacity: 0.6,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

            // Crack lines appear on scroll
            cracksRef.current.forEach((crack, index) => {
                gsap.from(crack, {
                    scaleX: 0,
                    opacity: 0,
                    duration: 1.5,
                    delay: index * 0.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: scene,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

            // Color transition as user scrolls
            gsap.to(scene, {
                background: 'linear-gradient(180deg, #3e2723 0%, #4e342e 100%)',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1
                }
            });

            // Text animations
            gsap.from('.before-title', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

            gsap.from('.before-text', {
                y: 40,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Cinematic Camera: zoom on scroll
            gsap.to('.dry-earth-bg', {
                scale: 1.15,
                scrollTrigger: {
                    trigger: scene,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

        }, sceneRef);

        const handleMouseMove = (e) => {
            // Subtle heat drift based on cursor
            const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
            const yOffset = (e.clientY / window.innerHeight - 0.5) * 40;

            gsap.to(heatWaveRef.current, {
                x: xOffset,
                y: yOffset,
                duration: 2,
                ease: 'power2.out'
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            ctx.revert();
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleEarthClick = useCallback((e) => {
        // Prevent interaction if clicked on text
        if (e.target.closest('.scene-content')) return;

        const rect = sceneRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newPuff = {
            id: Date.now(),
            x,
            y
        };

        setDustPuffs(prev => [...prev, newPuff]);

        // Cleanup puff after animation (1s)
        setTimeout(() => {
            setDustPuffs(prev => prev.filter(p => p.id !== newPuff.id));
        }, 1000);
    }, []);

    return (
        <section ref={sceneRef} className="scene before-monsoon" onClick={handleEarthClick}>
            {/* Background layers */}
            <div className="scene-bg">
                <div
                    className="parallax-layer dry-earth-bg"
                    data-speed="0.2"
                    style={{ backgroundImage: `url(${dryEarthImg})` }}
                ></div>
                <div className="parallax-layer heat-wave" ref={heatWaveRef}></div>

                {/* Interactive Dust Puffs */}
                {dustPuffs.map(puff => (
                    <div
                        key={puff.id}
                        className="dust-puff"
                        style={{
                            left: puff.x,
                            top: puff.y
                        }}
                    />
                ))}

                {/* Crack lines */}
                <svg className="crack-overlay" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <path
                        ref={el => cracksRef.current[0] = el}
                        className="crack-line"
                        d="M 200,300 Q 250,350 300,320 T 450,340 L 550,380"
                        stroke="rgba(62, 39, 35, 0.8)"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        ref={el => cracksRef.current[1] = el}
                        className="crack-line"
                        d="M 600,400 Q 650,450 720,430 T 850,460"
                        stroke="rgba(62, 39, 35, 0.8)"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        ref={el => cracksRef.current[2] = el}
                        className="crack-line"
                        d="M 100,600 Q 180,650 250,620 T 400,640"
                        stroke="rgba(62, 39, 35, 0.8)"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        ref={el => cracksRef.current[3] = el}
                        className="crack-line"
                        d="M 500,700 Q 580,720 650,690 T 800,710"
                        stroke="rgba(62, 39, 35, 0.8)"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </div>

            {/* Content */}
            <div className="scene-content">
                <h2 className="scene-title before-title">Before the Monsoon</h2>
                <p className="story-text before-text">
                    The land lies parched beneath an unforgiving sun. Cracked earth stretches endlessly,
                    waiting, yearning for the first touch of rain. The air shimmers with heat,
                    and time moves slowly in the silence of anticipation.
                </p>
                <div className="interaction-hint">
                    Click to disturb the dry earth
                </div>
            </div>
        </section>
    );
}

export default BeforeMonsoon;
