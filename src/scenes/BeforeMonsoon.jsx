import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BeforeMonsoon.css';
import dryEarthImg from '../assets/dry_earth.png';

function BeforeMonsoon() {
    const sceneRef = useRef(null);
    const canvasRef = useRef(null);
    const heatWaveRef = useRef(null);
    const cracksRef = useRef([]);

    useEffect(() => {
        const scene = sceneRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let shockwaves = [];

        // Set pointer-events: none on canvas so clicks pass through to text, 
        // BUT we need to capture mouse events on the SCENE to feed the canvas.
        // Canvas sizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // PARTICLE SYSTEM
        class DustParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 1.5;
                this.speedY = (Math.random() * -1) - 0.5; // Drift up
                this.life = 1.0;
                this.decay = Math.random() * 0.02 + 0.01;
                this.color = `rgba(189, 165, 155, ${this.life})`; // Dust color
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY; // Rise with heat
                this.life -= this.decay;
                this.size *= 0.98; // Shrink slightly
            }
            draw(context) {
                context.fillStyle = `rgba(189, 165, 155, ${this.life})`;
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fill();
            }
        }

        class Shockwave {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 10;
                this.maxRadius = 150;
                this.opacity = 0.8;
                this.lineWidth = 5;
            }
            update() {
                this.radius += 5; // Expand fast
                this.opacity -= 0.03;
                this.lineWidth *= 0.95;
            }
            draw(context) {
                context.strokeStyle = `rgba(255, 204, 128, ${this.opacity})`; // Warm amber
                context.lineWidth = this.lineWidth;
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                context.stroke();
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update/Draw Dust
            particles.forEach((p, index) => {
                p.update();
                p.draw(ctx);
                if (p.life <= 0) particles.splice(index, 1);
            });

            // Update/Draw Shockwaves
            shockwaves.forEach((s, index) => {
                s.update();
                s.draw(ctx);
                if (s.opacity <= 0) shockwaves.splice(index, 1);
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // INTERACTION HANDLERS
        const handleMouseMove = (e) => {
            // Heat drift parallax for background (existing effect)
            if (heatWaveRef.current) {
                const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
                const yOffset = (e.clientY / window.innerHeight - 0.5) * 40;
                gsap.to(heatWaveRef.current, {
                    x: xOffset,
                    y: yOffset,
                    duration: 2,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }

            // Spawn dust on move (trail)
            // Limit spawn rate for performance? Na, pure random is organic.
            if (Math.random() < 0.4) { // 40% chance per frame interaction
                // Get mouse pos relative to scene? 
                // Easiest is just clientX/Y if canvas is fixed/absolute covering screen.
                // Assuming canvas covers viewport.
                particles.push(new DustParticle(e.clientX, e.clientY));
            }
        };

        const handleClick = (e) => {
            // Spawn Shockwave
            shockwaves.push(new Shockwave(e.clientX, e.clientY));

            // Spawn burst of dust
            for (let i = 0; i < 15; i++) {
                particles.push(new DustParticle(e.clientX, e.clientY));
            }
        };

        // Attach listeners to WINDOW to ensure capture, or Scene. 
        // Window is safer for "mouse trail" feeling.
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        // GSAP CONTEXT (Existing Animations)
        const gsapCtx = gsap.context(() => {
            // Heat wave animation
            gsap.to(heatWaveRef.current, {
                y: -20,
                opacity: 0.6,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

            // Cracks
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

            // Color shift
            gsap.to(scene, {
                background: 'linear-gradient(180deg, #3e2723 0%, #4e342e 100%)',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1
                }
            });

            // Parallax
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

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
            gsapCtx.revert();
        };
    }, []);

    return (
        <section ref={sceneRef} className="scene before-monsoon">
            {/* Background layers */}
            <div className="scene-bg">
                <div
                    className="parallax-layer dry-earth-bg"
                    data-speed="0.2"
                    style={{ backgroundImage: `url(${dryEarthImg})` }}
                ></div>
                <div className="parallax-layer heat-wave" ref={heatWaveRef}></div>

                {/* VISUAL EFFECTS CANVAS */}
                <canvas
                    ref={canvasRef}
                    className="vfx-canvas"
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}
                />

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
