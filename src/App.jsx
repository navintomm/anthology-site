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
import AudioController from './components/AudioController';
import ProgressBar from './components/ProgressBar';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // ... existing useEffect ...

  // Note: I'm keeping the global scroll logic but removing the specific progress-bar tween since Navigation handles UI better,
  // or I can keep it if I want a top bar too. Let's rely on Navigation.

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's lag smoothing to ensure sync
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll configuration for ScrollTrigger
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Global scroll-based animations
    const ctx = gsap.context(() => {
      // Parallax Effects
      gsap.utils.toArray('.parallax-layer').forEach((layer, index) => {
        const speed = layer.dataset.speed || 0.5;
        gsap.to(layer, {
          y: () => window.innerHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.closest('.scene'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0 // Direct scrub for immediate parallax response, let Lenis handle the smoothing
          }
        });
      });

      // Smooth Scene Entries
      gsap.utils.toArray('.scene').forEach((scene, index) => {
        // Fade in content nicely
        gsap.fromTo(scene.querySelector('.scene-content'),
          {
            opacity: 0,
            y: 100,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power3.out', // Smoother easing
            scrollTrigger: {
              trigger: scene,
              start: 'top 65%', // Start transitioning earlier
              end: 'top 25%',
              scrub: 1.5 // Significant smoothing on the scrubbing for a "floating" feel
            }
          }
        );
      });

      // Hero Title Zoom on scroll
      gsap.to('.hero-header', {
        scale: 0.9,
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: '.hero-header',
          start: 'top top',
          end: 'bottom 40%', // Fade out faster
          scrub: 1
        }
      });
    });

    return () => {
      ctx.revert();
      lenis.destroy(); // Cleanup Lenis
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="app">
      <Navigation />
      <ProgressBar />

      {/* Hero Title Card */}
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

      {/* Scene 1: Before the Monsoon */}
      <BeforeMonsoon />

      {/* Scene 2: Arrival of Clouds */}
      <ArrivalOfClouds />

      {/* Scene 3: First Rain */}
      <FirstRain />

      {/* Scene 4: Monsoon & Railways */}
      <MonsoonRailways />

      {/* Scene 5: Impact on Life */}
      <ImpactOnLife />

      {/* Scene 6: Adaptation & Balance */}
      <AdaptationBalance />

      {/* Scene 7: Conclusion */}
      <Conclusion />

      {/* Credits Footer */}
      <footer className="credits">
        <p>An Interactive Storytelling Experience</p>
        <p className="credits-subtext">Scroll-driven • Cinematic • Immersive</p>
      </footer>

      {/* Global Atmosphere Effects */}
      <AtmosphereController />
      <AudioController />
    </div>
  );
}

export default App;
