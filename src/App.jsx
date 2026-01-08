import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import BeforeMonsoon from './scenes/BeforeMonsoon';
import ArrivalOfClouds from './scenes/ArrivalOfClouds';
import FirstRain from './scenes/FirstRain';
import MonsoonRailways from './scenes/MonsoonRailways';
import ImpactOnLife from './scenes/ImpactOnLife';
import AdaptationBalance from './scenes/AdaptationBalance';
import Conclusion from './scenes/Conclusion';

import Navigation from './components/Navigation';
import AtmosphereController from './components/AtmosphereController';
import CinematicTransitions from './components/CinematicTransitions';
import AudioController from './components/AudioController';
import ProgressBar from './components/ProgressBar';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // LENIS SMOOTH SCROLL CONFIGURATION
    // "Cinematic" settings: High smooth factor, custom easing
    const lenis = new Lenis({
      duration: 1.8,            // Longer duration for weight
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential release
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP's ticker for perfect frame sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's lag smoothing to ensure direct 1:1 sync with Lenis
    gsap.ticker.lagSmoothing(0);

    // GSAP GLOBAL CONFIG
    gsap.config({
      force3D: true, // Force GPU acceleration
      nullTargetWarn: false
    });

    // Global Timeline Context
    const ctx = gsap.context(() => {

      // PARALLAX SYSTEM
      // Optimization: Using 'scrub: 0' lets Lenis handle the smoothing, avoiding "double-lerp" lag.
      gsap.utils.toArray('.parallax-layer').forEach((layer) => {
        const speed = layer.dataset.speed || 0.5;
        gsap.to(layer, {
          y: () => window.innerHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.closest('.scene'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0
          }
        });
      });

      // HERO HEADER FADE
      // Smooth fade-out of the intro title
      gsap.to('.hero-header', {
        scale: 0.9,
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: '.hero-header',
          start: 'top top',
          end: 'bottom 40%',
          scrub: true    // Smooth scrub to match scroll speed
        }
      });

    });

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="app">
      {/* UI & Global Controllers */}
      <Navigation />
      <ProgressBar />
      <AudioController />
      <CinematicTransitions />
      <AtmosphereController />

      {/* Hero Title Section */}
      <section className="scene hero-scene">
        <header className="hero-header">
          <h1 className="main-title">
            Monsoon<br />in India
          </h1>
          <p className="main-subtitle">An Interactive Story</p>

          <div className="scroll-indicator">
            <span className="scroll-text">SCROLL TO DISCOVER</span>
            <div className="scroll-line"></div>
          </div>
        </header>
      </section>

      {/* Story Scenes */}
      <BeforeMonsoon />
      <ArrivalOfClouds />
      <FirstRain />
      <MonsoonRailways />
      <ImpactOnLife />
      <AdaptationBalance />
      <Conclusion />

      {/* Footer */}
      <footer className="credits">
        <p>An Interactive Storytelling Experience</p>
        <p className="credits-subtext">Scroll-driven • Cinematic • Immersive</p>
      </footer>
    </div>
  );
}

export default App;
