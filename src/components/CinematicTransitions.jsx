import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CinematicTransitions = () => {
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Select all scenes for coordinated transitions
            const scenes = gsap.utils.toArray('.scene');

            scenes.forEach((scene, i) => {
                // Ensure scene bg exists
                const bg = scene.querySelector('.scene-bg');
                const content = scene.querySelector('.scene-content');
                if (!bg) return;

                // 1. Cinematic Fade In/Out Logic
                // Instead of hard cuts, we want scenes to bleed into each other
                // The current scene fades OUT as it leaves, revealing the next one

                // Entrance (Fade In) - Handled mostly by CSS usually, but let's enforce smoothness
                gsap.set(scene, { zIndex: i + 1 }); // Ensure stacking order

                // Exit (Fade Out + slight zoom) for a dreamy feel
                if (i < scenes.length - 1) { // Apply to all except the very last scene
                    ScrollTrigger.create({
                        trigger: scene,
                        start: 'top top', // When scene top hits viewport top
                        end: 'bottom top', // When scene bottom hits viewport top
                        scrub: true, // Smooth scrubbing
                        onUpdate: (self) => {
                            // Parallax fade: 
                            // As we scroll past the scene, it doesn't just scroll up.
                            // It fades out and scales slightly to give depth to the INCOMING scene.

                            const progress = self.progress;

                            // Background fades out slow
                            gsap.to(bg, {
                                opacity: 1 - progress,
                                scale: 1 + (progress * 0.1), // Gentle drift 
                                overwrite: 'auto',
                                ease: 'none'
                            });

                            // Content fades out faster to clear the stage
                            if (content) {
                                gsap.to(content, {
                                    opacity: 1 - (progress * 1.5),
                                    y: -100 * progress,
                                    overwrite: 'auto',
                                    ease: 'none'
                                });
                            }
                        }
                    });
                }
            });

            // Global: Smooth scroll-based brightness dimming
            // Dims the screen slightly between scenes for tension
            /* 
            scenes.forEach((scene) => {
                ScrollTrigger.create({
                    trigger: scene,
                    start: 'bottom bottom',
                    end: 'bottom center',
                    scrub: true,
                    onUpdate: (self) => {
                         // This could inject a global overlay dim, but might be too heavy.
                         // Keeping it simple for now to avoid 'jank'.
                    }
                });
            });
            */

        });

        return () => ctx.revert();
    }, []);

    return null; // This component renders nothing visual, just handles logic
};

export default CinematicTransitions;
