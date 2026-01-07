import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProgressBar.css';

gsap.registerPlugin(ScrollTrigger);

const ProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const trigger = ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                setProgress(self.progress * 100);
            }
        });

        return () => trigger.kill();
    }, []);

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
            ></div>
            <div className="progress-text">
                {Math.round(progress)}% DISCOVERED
            </div>
        </div>
    );
};

export default ProgressBar;
