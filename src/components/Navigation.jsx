import { useEffect, useState } from 'react';
import './Navigation.css';

const chapters = [
    { id: 'before-monsoon', label: 'The Parched Earth' },
    { id: 'arrival-clouds', label: 'Gathering Storm' },
    { id: 'first-rain', label: 'First Drops' },
    { id: 'monsoon-railways', label: 'Journey' },
    { id: 'impact-life', label: 'Life & Rain' },
    { id: 'adaptation-balance', label: 'Renewal' },
    { id: 'conclusion', label: 'Reflection' }
];

function Navigation() {
    const [activeChapter, setActiveChapter] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight * 0.4;

            // Find the current active section
            for (const chapter of chapters) {
                const element = document.querySelector(`.${chapter.id}`); // We need to add these classes to the scenes
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveChapter(chapter.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToChapter = (id) => {
        const element = document.querySelector(`.${id}`);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className="fixed-navigation">
            <div className="nav-track">
                {chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        className={`nav-dot ${activeChapter === chapter.id ? 'active' : ''}`}
                        onClick={() => scrollToChapter(chapter.id)}
                        title={chapter.label}
                    >
                        <span className="nav-label">{chapter.label}</span>
                    </div>
                ))}
            </div>

            <div className="current-chapter-display">
                <span className="chapter-prefix">CHAPTER</span>
                <span className="chapter-name">
                    {chapters.find(c => c.id === activeChapter)?.label || 'PROLOGUE'}
                </span>
            </div>
        </nav>
    );
}

export default Navigation;
