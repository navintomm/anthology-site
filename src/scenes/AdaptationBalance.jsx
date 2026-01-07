import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AdaptationBalance.css';
import lushGreenImg from '../assets/lush_green.png';

function AdaptationBalance() {
    const sceneRef = useRef(null);
    const riverRef = useRef(null);
    const trainRef = useRef(null);
    const greensRef = useRef([]);
    const lightRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scene = sceneRef.current;

            // Rain slows down (reduce intensity)
            gsap.to('.gentle-rain', {
                opacity: 0.2,
                scrollTrigger: {
                    trigger: scene,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1
                }
            });

            // River flows calmly
            gsap.to(riverRef.current, {
                backgroundPosition: '200% 0',
                ease: 'none',
                duration: 15,
                repeat: -1
            });

            // Train moves steadily (not scroll-dependent)
            gsap.to(trainRef.current, {
                x: '100vw',
                duration: 20,
                ease: 'none',
                repeat: -1
            });

            // Greenery appears and grows
            greensRef.current.forEach((green, index) => {
                if (!green) return;

                gsap.from(green, {
                    scale: 0,
                    opacity: 0,
                    duration: 1.5,
                    delay: index * 0.3,
                    ease: 'elastic.out(1, 0.5)',
                    scrollTrigger: {
                        trigger: scene,
                        start: 'top 60%',
                        toggleActions: 'play none none reverse'
                    }
                });

                // Gentle sway
                gsap.to(green, {
                    rotate: index % 2 === 0 ? 3 : -3,
                    duration: 3 + (index * 0.5),
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    transformOrigin: 'bottom center'
                });
            });

            // Warm light returns gradually
            gsap.to(lightRef.current, {
                opacity: 0.6,
                scale: 1.5,
                scrollTrigger: {
                    trigger: scene,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1
                }
            });

            // Background color transition to warmer tones
            gsap.to(scene, {
                background: 'linear-gradient(180deg, #2d3541 0%, #2d5016 100%)',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1
                }
            });

            // Text animations
            gsap.from('.adaptation-title', {
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

            gsap.from('.adaptation-text', {
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

    return (
        <section ref={sceneRef} className="scene adaptation-balance">
            {/* Background layers */}
            <div className="scene-bg">
                {/* Background Image Layer */}
                <div
                    className="parallax-layer lush-bg"
                    data-speed="0.2"
                    style={{ backgroundImage: `url(${lushGreenImg})` }}
                ></div>

                {/* Warm light glow */}
                <div ref={lightRef} className="warm-light"></div>

                {/* Gentle rain (reduced) */}
                <div className="gentle-rain"></div>

                {/* Flowing river */}
                <div ref={riverRef} className="calm-river"></div>

                {/* Greenery elements */}
                <div ref={el => greensRef.current[0] = el} className="greenery green-1"></div>
                <div ref={el => greensRef.current[1] = el} className="greenery green-2"></div>
                <div ref={el => greensRef.current[2] = el} className="greenery green-3"></div>
                <div ref={el => greensRef.current[3] = el} className="greenery green-4"></div>
                <div ref={el => greensRef.current[4] = el} className="greenery green-5"></div>

                {/* Steady train */}
                <div ref={trainRef} className="steady-train">
                    <div className="train-mini-body"></div>
                </div>
            </div>

            {/* Content */}
            <div className="scene-content">
                <h2 className="scene-title adaptation-title">Adaptation & Balance</h2>
                <p className="story-text adaptation-text">
                    The rain softens to a gentle drizzle. Life finds its rhythm once more.
                    Rivers flow steady and calm, trains resume their journeys, and green
                    life bursts forth from the nourished earth. Balance is restored.
                </p>
            </div>
        </section>
    );
}

export default AdaptationBalance;
