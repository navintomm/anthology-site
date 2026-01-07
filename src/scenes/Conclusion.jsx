import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Conclusion.css';

import conclusionSunsetImg from '../assets/conclusion_sunset.png';

function Conclusion() {
    const sceneRef = useRef(null);
    const drizzleRef = useRef(null);
    const messageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scene = sceneRef.current;



            // Reflection message fades in slowly
            gsap.from(messageRef.current, {
                opacity: 0,
                y: 60,
                duration: 2.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Title animation
            gsap.from('.conclusion-title', {
                y: 80,
                opacity: 0,
                duration: 1.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Subtitle stagger
            gsap.from('.conclusion-subtitle', {
                y: 40,
                opacity: 0,
                duration: 1.5,
                delay: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Reflection paragraphs stagger
            gsap.from('.reflection-paragraph', {
                y: 30,
                opacity: 0,
                duration: 1.2,
                stagger: 0.3,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: messageRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Ambient motion: Sunset Sky hue shift
            gsap.to('.calm-sky', {
                filter: 'hue-rotate(15deg) brightness(1.1)',
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Final zoom on closing symbol
            gsap.to('.closing-symbol', {
                scale: 1.5,
                scrollTrigger: {
                    trigger: '.closing-symbol',
                    start: 'top bottom',
                    end: 'bottom center',
                    scrub: 1
                }
            });

        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="scene conclusion">
            {/* Background layers */}
            <div className="scene-bg">
                <div
                    className="parallax-layer calm-sky"
                    data-speed="0.2"
                    style={{ backgroundImage: `url(${conclusionSunsetImg})` }}
                ></div>


            </div>

            {/* Content */}
            <div className="scene-content conclusion-content">
                <h2 className="conclusion-title">
                    <span className="title-top">The Circle</span>
                    <span className="title-bottom">Completes</span>
                </h2>
                <p className="scene-subtitle conclusion-subtitle">
                    A Reflection on Monsoon, Resilience & Balance
                </p>

                {/* Reflection Message */}
                <div ref={messageRef} className="reflection-message">
                    <p className="reflection-paragraph">
                        The monsoon is more than rain—it is a cycle of transformation.
                        From the cracked earth yearning for change, to the torrent that
                        reshapes the land, to the quiet balance that follows.
                    </p>

                    <p className="reflection-paragraph">
                        It teaches resilience. Communities adapt, infrastructure endures,
                        and nature finds its rhythm. The rain departs, but its essence
                        remains—in rivers that flow, crops that grow, and stories that echo.
                    </p>

                    <p className="reflection-paragraph">
                        Like the monsoon, life moves in seasons. There is the waiting,
                        the storm, the adaptation, and the calm. Each phase necessary,
                        each transition sacred.
                    </p>

                    <div className="closing-symbol">☔</div>
                </div>
            </div>
        </section>
    );
}

export default Conclusion;
