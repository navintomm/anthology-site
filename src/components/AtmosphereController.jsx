import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlobalRainOverlay from './GlobalRainOverlay';
const AtmosphereController = () => {
    const [weatherState, setWeatherState] = useState({
        intensity: 0, // 0 to 1
        wind: 0,     // -1 to 1 (direction/speed)
        flash: 0,    // 0 or 1 (thunder)
        blur: 0      // 0 to 10px
    });

    const containerRef = useRef(null);
    const cursorRef = useRef(null);

    useEffect(() => {
        // --- 1. Scroll-Driven Weather Logic ---
        const scrollTracker = ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity());
                const direction = self.direction; // 1 = down, -1 = up
                const progress = self.progress;

                // Base intensity from progress (The Story Arc: CALM -> BUILDUP -> CHAOS -> CALM)
                let baseIntensity = 0;
                if (progress <= 0.25) baseIntensity = 0;
                else if (progress > 0.25 && progress <= 0.4) baseIntensity = gsap.utils.mapRange(0.25, 0.4, 0, 0.3, progress);
                else if (progress > 0.4 && progress <= 0.55) baseIntensity = gsap.utils.mapRange(0.4, 0.55, 0.3, 0.7, progress);
                else if (progress > 0.5 && progress <= 0.75) baseIntensity = gsap.utils.mapRange(0.5, 0.75, 0.7, 0.95, progress);
                else if (progress > 0.75 && progress <= 0.88) baseIntensity = gsap.utils.mapRange(0.75, 0.88, 0.7, 0, progress);
                else if (progress > 0.88) baseIntensity = 0;

                // Dynamic modifier from velocity (The "Control")
                // Only add extra rain if there is already a base intensity (i.e., we are in a rain zone)
                const velocityFactor = Math.min(velocity / 4000, 0.3);

                // Gate the final intensity: If base is 0, stay at 0.
                const finalIntensity = baseIntensity > 0
                    ? Math.min(baseIntensity + velocityFactor, 1.0)
                    : 0;

                // Wind based on velocity and direction
                // Wind can still happen even if no rain is visible
                const windForce = (velocity / 5000) * direction * -1;

                setWeatherState(prev => ({
                    ...prev,
                    intensity: finalIntensity,
                    wind: windForce
                }));

                // Motion Blur effect on container
                if (velocity > 2000) {
                    document.body.style.filter = `blur(${Math.min((velocity - 2000) / 1000, 2)}px)`;
                } else {
                    document.body.style.filter = 'none';
                }
            }
        });

        // --- 2. Cursor Interactions ---
        const moveCursor = (e) => {
            if (!cursorRef.current) return;

            // Move custom cursor
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });

            // Global Parallax for specific elements
            const xPct = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10
            const yPct = (e.clientY / window.innerHeight - 0.5) * 20;

            gsap.to('.mouse-parallax', {
                x: xPct,
                y: yPct,
                duration: 1,
                ease: 'power2.out'
            });
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            scrollTracker.kill();
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    return (
        <>
            <GlobalRainOverlay
                intensity={weatherState.intensity}
                wind={weatherState.wind}
            />

            <div ref={cursorRef} className="custom-cursor-glow" />
        </>
    );
};

export default AtmosphereController;
