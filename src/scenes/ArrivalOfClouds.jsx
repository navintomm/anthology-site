import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ArrivalOfClouds.css';

import stormCloudsImg from '../assets/storm_clouds.png';

function ArrivalOfClouds() {
    const sceneRef = useRef(null);
    const cloudsRef = useRef([]);
    const lightningRef = useRef(null);
    const [lightningVisible, setLightningVisible] = useState(false);

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

            // Lightning flash on scroll peaks
            ScrollTrigger.create({
                trigger: scene,
                start: 'top 30%',
                end: 'bottom 70%',
                onUpdate: (self) => {
                    // Trigger lightning at certain scroll points
                    if (self.progress > 0.3 && self.progress < 0.35) {
                        triggerLightning();
                    } else if (self.progress > 0.7 && self.progress < 0.75) {
                        triggerLightning();
                    }
                }
            });

            // Distant lighting flickering
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

            // Text animations
            gsap.from('.clouds-title', {
                y: 80,
                opacity: 0,
                scale: 0.9,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

            gsap.from('.clouds-text', {
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

    const triggerLightning = () => {
        setLightningVisible(true);

        gsap.to(lightningRef.current, {
            opacity: 0.8,
            duration: 0.1,
            onComplete: () => {
                gsap.to(lightningRef.current, {
                    opacity: 0,
                    duration: 0.2,
                    delay: 0.1,
                    onComplete: () => setLightningVisible(false)
                });
            }
        });
    };

    return (
        <section ref={sceneRef} className="scene arrival-clouds">
            {/* Background layers */}
            <div className="scene-bg">
                {/* Image Background */}
                <div
                    className="parallax-layer storm-clouds-bg"
                    data-speed="0.2"
                    style={{ backgroundImage: `url(${stormCloudsImg})` }}
                ></div>

                {/* Fog Layer */}
                <div className="fog-layer"></div>

                {/* Cloud layers - multiple independent elements */}
                <div ref={el => cloudsRef.current[0] = el} className="cloud cloud-1" data-speed="0.4"></div>
                <div ref={el => cloudsRef.current[1] = el} className="cloud cloud-2" data-speed="0.5"></div>
                <div ref={el => cloudsRef.current[2] = el} className="cloud cloud-3" data-speed="0.6"></div>
                <div ref={el => cloudsRef.current[3] = el} className="cloud cloud-4" data-speed="0.7"></div>
                <div ref={el => cloudsRef.current[4] = el} className="cloud cloud-5" data-speed="0.8"></div>

                {/* Distant flickering lights */}
                <div className="distant-light light-1"></div>
                <div className="distant-light light-2"></div>
                <div className="distant-light light-3"></div>

                {/* Lightning flash overlay */}
                <div
                    ref={lightningRef}
                    className={`lightning-flash ${lightningVisible ? 'active' : ''}`}
                    style={{ '--x': '60%', '--y': '20%' }}
                ></div>
            </div>

            {/* Content */}
            <div className="scene-content">
                <h2 className="scene-title clouds-title">Arrival of Clouds</h2>
                <p className="story-text clouds-text">
                    Dark masses gather on the horizon, rolling in like silent giants.
                    The sky transforms from warm amber to deep indigo. Lightning cracks
                    through the heavens, announcing the imminent arrival of the monsoon.
                </p>
                <div onClick={triggerLightning} style={{ cursor: 'pointer', marginTop: '1rem', display: 'inline-block' }}>
                    <p className="interaction-hint">Click for Lightning ⚡</p>
                </div>
            </div>
        </section>
    );
}

export default ArrivalOfClouds;
