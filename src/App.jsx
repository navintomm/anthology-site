import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BeforeMonsoon from './scenes/BeforeMonsoon';
import ArrivalOfClouds from './scenes/ArrivalOfClouds';
import FirstRain from './scenes/FirstRain';
import MonsoonRailways from './scenes/MonsoonRailways';
import ImpactOnLife from './scenes/ImpactOnLife';
import AdaptationBalance from './scenes/AdaptationBalance';
import Conclusion from './scenes/Conclusion';
import Navigation from './components/Navigation';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // ... existing useEffect ...

  // Note: I'm keeping the global scroll logic but removing the specific progress-bar tween since Navigation handles UI better,
  // or I can keep it if I want a top bar too. Let's rely on Navigation.

  useEffect(() => {
    // ... (logic remains mostly same, maybe remove progress bar tween if not needed)
    // Smooth scroll configuration
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Global scroll-based animations
    const ctx = gsap.context(() => {
      // ... existing parallax logic ...
      gsap.utils.toArray('.parallax-layer').forEach((layer, index) => {
        // ...
        const speed = layer.dataset.speed || 0.5;
        gsap.to(layer, {
          y: () => window.innerHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.closest('.scene'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      });

      // ... existing scene fade logic ...
      gsap.utils.toArray('.scene').forEach((scene, index) => {
        gsap.from(scene.querySelector('.scene-content'), {
          opacity: 0,
          y: 60,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: scene,
            start: 'top 75%',
            end: 'top 30%',
            toggleActions: 'play none none reverse'
          }
        });
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="app">
      <Navigation />

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
    </div>
  );
}

export default App;
