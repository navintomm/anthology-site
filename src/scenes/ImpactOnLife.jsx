import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ImpactOnLife.css';
import rainyStreetImg from '../assets/rainy_street.png';

function ImpactOnLife() {
    const sceneRef = useRef(null);
    const waterLevelRef = useRef(null);
    const peopleRef = useRef([]);
    const [activeFact, setActiveFact] = useState(null);

    const facts = [
        {
            id: 1,
            title: "Monsoon Agriculture",
            content: "Nearly 60% of India's agricultural land depends on monsoon rainfall, sustaining millions of farmers."
        },
        {
            id: 2,
            title: "Urban Adaptation",
            content: "Cities transform during monsoon, with daily life adapting to heavy rains and flooding."
        },
        {
            id: 3,
            title: "Natural Renewal",
            content: "Monsoons replenish rivers, groundwater, and bring life to parched landscapes."
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scene = sceneRef.current;

            // Water level rises with scroll
            gsap.to(waterLevelRef.current, {
                height: '60%',
                ease: 'none',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1
                }
            });

            // People moving with umbrellas
            peopleRef.current.forEach((person, index) => {
                if (!person) return;

                gsap.to(person, {
                    x: index % 2 === 0 ? 100 : -100,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: scene,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2
                    }
                });

                // Bobbing animation
                gsap.to(person, {
                    y: -15,
                    duration: 2 + (index * 0.3),
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true
                });
            });

            // Text animations
            gsap.from('.impact-title', {
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

            gsap.from('.impact-text', {
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

            // Fact cards stagger (Premium Slide Up)
            // Ensure we start from visible opacity if trigger fails, 
            // but normally .from() handles this.
            gsap.from('.clickable-fact', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%', // Adjusted trigger point
                    toggleActions: 'play none none reverse'
                }
            });

        }, sceneRef);

        return () => ctx.revert();
    }, []);

    const handleFactClick = (factId) => {
        setActiveFact(activeFact === factId ? null : factId);
    };

    return (
        <section ref={sceneRef} className="scene impact-life">
            {/* Background layers */}
            <div className="scene-bg">
                {/* Background Image Layer */}
                <div
                    className="parallax-layer impact-bg"
                    data-speed="0.2"
                    style={{ backgroundImage: `url(${rainyStreetImg})` }}
                ></div>

                {/* Rising water level */}
                <div ref={waterLevelRef} className="water-level"></div>

                {/* People with umbrellas */}
                <div ref={el => peopleRef.current[0] = el} className="person person-1">
                    <div className="umbrella"></div>
                    <div className="person-body"></div>
                </div>
                <div ref={el => peopleRef.current[1] = el} className="person person-2">
                    <div className="umbrella"></div>
                    <div className="person-body"></div>
                </div>
                <div ref={el => peopleRef.current[2] = el} className="person person-3">
                    <div className="umbrella"></div>
                    <div className="person-body"></div>
                </div>

                {/* Rain effect - now handled globally, but we keep a local subtle overlay for depth */}
                <div className="rain-overlay local-rain"></div>

                {/* Interaction Layer for Ripples */}
                <div
                    className="interaction-layer"
                    onMouseMove={(e) => {
                        // Create ripple logic here or just visual feedback
                        // Simple ripple via class toggle or quick dom append is complex in React without state,
                        // GSAP quickSetter is better.
                        const ripple = document.createElement('div');
                        ripple.className = 'ripple-effect';
                        ripple.style.left = `${e.nativeEvent.offsetX}px`;
                        ripple.style.top = `${e.nativeEvent.offsetY}px`;
                        e.currentTarget.appendChild(ripple);

                        gsap.to(ripple, {
                            scale: 4,
                            opacity: 0,
                            duration: 1,
                            onComplete: () => ripple.remove()
                        });
                    }}
                ></div>
            </div>

            {/* Content */}
            <div className="scene-content">
                <h2 className="scene-title impact-title">Impact on Life</h2>
                <p className="story-text impact-text">
                    The monsoon touches every aspect of life. Streets become rivers,
                    umbrellas bloom like flowers, and communities adapt to the rhythm
                    of the rain. Click below to discover how monsoons shape existence.
                </p>

                {/* Interactive fact cards */}
                <div className="facts-container">
                    {facts.map((fact) => (
                        <div
                            key={fact.id}
                            className="clickable-fact"
                            onClick={() => handleFactClick(fact.id)}
                        >
                            <h3 className="fact-title">{fact.title}</h3>
                            {activeFact === fact.id && (
                                <p className="fact-content">{fact.content}</p>
                            )}
                            <span className="fact-icon">{activeFact === fact.id ? '−' : '+'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ImpactOnLife;
