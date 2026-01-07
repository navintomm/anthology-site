import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './AudioController.css';

// Placeholder imports - the user will need to place actual files here
// We use direct paths for now or imports if files existed. 
// Since they don't, we'll try to load them from the public folder or src assets if updated.
// For now, we'll assume they will be placed in src/assets/audio/ and imported.

// NOTE: Since files don't exist yet, I'm setting up the structure.
// In a real scenario, we'd import them. For this draft, I will just point to the path string.

const AUDIO_TRACKS = {
    DRY_WIND: '/src/assets/audio/wind_dry.mp3',
    THUNDER: '/src/assets/audio/thunder_distant.mp3',
    HEAVY_RAIN: '/src/assets/audio/monsoon_rain.mp3',
    CONCLUSION: '/src/assets/audio/birds_calm.mp3'
};

const AudioController = () => {
    const [isMuted, setIsMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Audio Refs
    const dryWindRef = useRef(new Audio(AUDIO_TRACKS.DRY_WIND));
    const thunderRef = useRef(new Audio(AUDIO_TRACKS.THUNDER));
    const rainRef = useRef(new Audio(AUDIO_TRACKS.HEAVY_RAIN));
    const conclusionRef = useRef(new Audio(AUDIO_TRACKS.CONCLUSION));

    const audioRefs = [dryWindRef, thunderRef, rainRef, conclusionRef];

    useEffect(() => {
        // Setup Loops
        audioRefs.forEach(ref => {
            ref.current.loop = true;
            ref.current.volume = 0;
            // Preload
            ref.current.load();
        });

        // Cleanup
        return () => {
            audioRefs.forEach(ref => {
                ref.current.pause();
                ref.current.src = "";
            });
        };
    }, []);

    useEffect(() => {
        if (isMuted) {
            audioRefs.forEach(ref => {
                gsap.to(ref.current, { volume: 0, duration: 1 });
            });
            return;
        }

        // Only start playing if muted is false
        // We need to ensure play() is called after a user interaction interaction (browser policy)
        if (!hasInteracted) return;

        // Start all tracks silent if they aren't playing
        audioRefs.forEach(ref => {
            if (ref.current.paused) ref.current.play().catch(e => console.log("Audio play failed:", e));
        });

        // Scroll Logic for Crossfading
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    if (isMuted) return;

                    const prog = self.progress;

                    // 1. Dry Wind (0.0 - 0.25)
                    // Peak at 0.1, fade out by 0.3
                    const volWind = gsap.utils.clamp(0, 1,
                        prog < 0.2 ? gsap.utils.mapRange(0, 0.1, 0, 0.8, prog) : gsap.utils.mapRange(0.2, 0.35, 0.8, 0, prog)
                    );

                    // 2. Thunder (0.2 - 0.45)
                    const volThunder = gsap.utils.clamp(0, 1,
                        prog > 0.15 && prog < 0.3 ? gsap.utils.mapRange(0.15, 0.3, 0, 0.7, prog) :
                            prog >= 0.3 && prog < 0.5 ? gsap.utils.mapRange(0.3, 0.5, 0.7, 0, prog) : 0
                    );

                    // 3. Heavy Rain (0.35 - 0.8)
                    const volRain = gsap.utils.clamp(0, 1,
                        prog > 0.3 && prog < 0.5 ? gsap.utils.mapRange(0.3, 0.5, 0, 1, prog) :
                            prog >= 0.5 && prog < 0.8 ? gsap.utils.mapRange(0.5, 0.8, 1, 0, prog) : 0
                    );

                    // 4. Conclusion (0.8 - 1.0)
                    const volConclusion = gsap.utils.clamp(0, 1,
                        prog > 0.75 ? gsap.utils.mapRange(0.75, 0.9, 0, 0.6, prog) : 0
                    );

                    // Apply volumes smoothly
                    gsap.to(dryWindRef.current, { volume: volWind, duration: 0.5, overwrite: true });
                    gsap.to(thunderRef.current, { volume: volThunder, duration: 0.5, overwrite: true });
                    gsap.to(rainRef.current, { volume: volRain, duration: 0.5, overwrite: true });
                    gsap.to(conclusionRef.current, { volume: volConclusion, duration: 0.5, overwrite: true });
                }
            });
        });

        return () => ctx.revert();
    }, [isMuted, hasInteracted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!hasInteracted) {
            setHasInteracted(true);
            // Try to wake up audio context
            audioRefs.forEach(ref => ref.current.play().catch(() => { }));
        }
    };

    return (
        <div className="audio-controller">
            <button
                className={`audio-toggle ${!isMuted ? 'active' : ''}`}
                onClick={toggleMute}
                title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
            >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                <span className="audio-label">{isMuted ? "SOUND OFF" : "SOUND ON"}</span>
            </button>
        </div>
    );
};

export default AudioController;
