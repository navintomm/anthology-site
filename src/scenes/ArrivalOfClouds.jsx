import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../components/ScrollReveal';
import Antigravity from '../components/Antigravity';
import './ArrivalOfClouds.css';

import stormCloudsImg from '../assets/storm_clouds.png';

function ArrivalOfClouds() {
    const sceneRef = useRef(null);
    const cloudsRef = useRef([]);
    const lightningRef = useRef(null);
    const [lightningVisible, setLightningVisible] = useState(false);
    const [isSummoning, setIsSummoning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        // Ambient Motion: Clouds drifting continuously
        cloudsRef.current.forEach((cloud, index) => {
            if (!cloud) return;
            // Drifting left or right endlessly
            gsap.to(cloud, {
                x: (index % 2 === 0 ? 50 : -50),
                duration: 20 + (index * 5),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });

        const ctx = gsap.context(() => {
            const scene = sceneRef.current;

            // Multi-layer cloud movement with parallax
            cloudsRef.current.forEach((cloud, index) => {
                if (!cloud) return;

                const speed = 0.3 + (index * 0.15);
                const direction = index % 2 === 0 ? 1 : -1;

                gsap.to(cloud, {
                    x: direction * 200,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: scene,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: speed
                    }
                });

                // Individual cloud floating
                gsap.to(cloud, {
                    y: -30,
                    duration: 4 + (index * 0.5),
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true
                });
            });

            // Sky color transition (warm to cool)
            gsap.to(scene, {
                background: 'linear-gradient(180deg, #1a1f28 0%, #2d3541 100%)',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top center',
                    end: 'center center',
                    scrub: 1
                }
            });

            // Distant lighting flickering (Keeping as ambient only)
            const lights = document.querySelectorAll('.distant-light');
            lights.forEach(light => {
                gsap.to(light, {
                    opacity: '+=0.4',
                    duration: 'random(0.1, 0.5)',
                    repeat: -1,
                    yoyo: true,
                    repeatDelay: 'random(1, 5)',
                    ease: 'none'
                });
            });

            // Cinematic Zoom on scroll
            gsap.to('.storm-clouds-bg', {
                scale: 1.2,
                scrollTrigger: {
                    trigger: scene,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // Text animations handled by ScrollReveal component now

        }, sceneRef);

        return () => ctx.revert();
    }, []);

    // Summoning Effect Logic
    useEffect(() => {
        if (isSummoning) {
            // Darken Sky
            gsap.to(sceneRef.current, { background: 'linear-gradient(180deg, #10141a 0%, #1e242e 100%)', duration: 1 });
            gsap.to('.storm-clouds-bg', { filter: 'brightness(0.3) contrast(1.4)', duration: 1 });
            gsap.to('.cloud', { filter: 'brightness(0.4)', duration: 1 });

        } else {
            // Restore Sky
            gsap.to(sceneRef.current, { background: 'linear-gradient(180deg, #1a1f28 0%, #2d3541 100%)', duration: 1 });
            gsap.to('.storm-clouds-bg', { filter: 'brightness(1) contrast(1)', duration: 1 });
            gsap.to('.cloud', { filter: 'brightness(1)', duration: 1 });

            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isSummoning]);

    const handleMouseDown = () => setIsSummoning(true);
    const handleMouseUp = () => setIsSummoning(false);

    return (
        <section
            ref={sceneRef}
            className="scene arrival-clouds"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
        >
            {/* Background layers */}
            <div className="scene-bg">
                {/* Image Background */}
                <div
                    className="parallax-layer storm-clouds-bg"
                    data-speed="0.2"
                    style={{ backgroundImage: `url(${stormCloudsImg})` }}
                ></div>

                {/* Fog Layer */}
                <div className="fog-layer mouse-parallax"></div>

                {/* Cloud layers - multiple independent elements */}
                <div ref={el => cloudsRef.current[0] = el} className="cloud cloud-1 mouse-parallax" data-speed="0.4"></div>
                <div ref={el => cloudsRef.current[1] = el} className="cloud cloud-2" data-speed="0.5"></div>
                <div ref={el => cloudsRef.current[2] = el} className="cloud cloud-3" data-speed="0.6"></div>
                <div ref={el => cloudsRef.current[3] = el} className="cloud cloud-4" data-speed="0.7"></div>
                <div ref={el => cloudsRef.current[4] = el} className="cloud cloud-5" data-speed="0.8"></div>

                {/* Antigravity Fireflies/Mist Particles */}
                <Antigravity
                    count={50}
                    magnetRadius={15}
                    ringRadius={15}
                    particleSize={1}
                    color="#ffd700" // Gold for magical feel
                    opacity={0.3}
                    rotationSpeed={0.2}
                    particleShape="sphere"
                />

                {/* Distant flickering lights */}
                <div className="distant-light light-1"></div>
                <div className="distant-light light-2"></div>
                <div className="distant-light light-3"></div>
            </div>

            {/* Content */}
            <div className="scene-content">
                <ScrollReveal
                    containerClassName="scene-title clouds-title"
                    baseRotation={5}
                    blurStrength={6}
                >
                    Arrival of Clouds
                </ScrollReveal>

                <div className="story-text clouds-text">
                    <ScrollReveal
                        baseOpacity={0.2}
                        baseRotation={2}
                        blurStrength={3}
                        textClassName="story-paragraph"
                    >
                        Dark masses gather on the horizon, rolling in like silent giants. The sky transforms from warm amber to deep indigo.
                    </ScrollReveal>
                </div>

                <div className="cursor-hint-container" style={{ marginTop: '2rem', cursor: 'pointer' }}>
                    <p className={`interaction-hint ${isSummoning ? 'active' : ''}`}>
                        {isSummoning ? "Summoning Storm..." : "Hold to summon the storm"}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default ArrivalOfClouds;
