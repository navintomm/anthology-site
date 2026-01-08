import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './AudioController.css';

// Audio tracks referencing files in the public/audio folder
const AUDIO_TRACKS = {
    DRY_WIND: '/audio/wind_dry.mp3',
    THUNDER: '/audio/thunder_distant.mp3',
    HEAVY_RAIN: '/audio/monsoon_rain.mp3',
    CONCLUSION: '/audio/birds_calm.mp3'
};

const AudioController = () => {
    const [isMuted, setIsMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Use a ref to store our Audio instances so they persist across renders
    const audioInstancesRef = useRef({});

    useEffect(() => {
        // Initialize audio objects once
        Object.keys(AUDIO_TRACKS).forEach(key => {
            const audio = new Audio(AUDIO_TRACKS[key]);
            audio.loop = true;
            audio.volume = 0;
            audio.preload = 'auto'; // Attempt to preload

            // Error handling
            audio.onerror = () => {
                console.warn(`Audio loading failed for: ${AUDIO_TRACKS[key]}. Make sure the file exists in public/audio/`);
            };

            audioInstancesRef.current[key] = audio;
        });

        // Cleanup on unmount
        return () => {
            Object.values(audioInstancesRef.current).forEach(audio => {
                audio.pause();
                audio.src = "";
            });
        };
    }, []);

    useEffect(() => {
        const { DRY_WIND, THUNDER, HEAVY_RAIN, CONCLUSION } = audioInstancesRef.current;
        if (!DRY_WIND) return; // Guard in case init failed somehow

        if (isMuted) {
            Object.values(audioInstancesRef.current).forEach(audio => {
                gsap.to(audio, { volume: 0, duration: 1 });
            });
            return;
        }

        // Only start playing if user has interacted (browser autoplay policy)
        if (!hasInteracted) return;

        // Ensure all tracks are playing (but volume managed by scroll)
        Object.values(audioInstancesRef.current).forEach(audio => {
            if (audio.paused) {
                audio.play().catch(e => {
                    // This is common if user hasn't interacted enough or files missing
                    console.log("Audio play deferred or failed:", e.message);
                });
            }
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
                    if (DRY_WIND) gsap.to(DRY_WIND, { volume: volWind, duration: 0.5, overwrite: true });
                    if (THUNDER) gsap.to(THUNDER, { volume: volThunder, duration: 0.5, overwrite: true });
                    if (HEAVY_RAIN) gsap.to(HEAVY_RAIN, { volume: volRain, duration: 0.5, overwrite: true });
                    if (CONCLUSION) gsap.to(CONCLUSION, { volume: volConclusion, duration: 0.5, overwrite: true });
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
            Object.values(audioInstancesRef.current).forEach(audio => {
                audio.play().catch(() => { });
            });
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
