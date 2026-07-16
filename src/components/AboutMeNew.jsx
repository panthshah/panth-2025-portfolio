import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Smiley } from '@phosphor-icons/react';
import Navbar from './Navbar';
import CustomizeButton from './CustomizeButton';
import ChatSidebar from './ChatSidebar';
import heroHike from '../assets/AboutMe /hero-hike.png';
import heroGame from '../assets/AboutMe /hero-game.png';
import aboutMe8 from '../assets/AboutMe /About Me 8.png';
import galleryGoldenGate from '../assets/AboutMe/gallery/golden-gate.png';
import galleryOneWorldTrade from '../assets/AboutMe/gallery/one-world-trade.png';
import galleryManhattanBuildings from '../assets/AboutMe/gallery/manhattan-buildings.png';
import galleryManhattanSkyline from '../assets/AboutMe/gallery/manhattan-skyline.png';
import galleryPanthNewYork from '../assets/AboutMe/gallery/panth-new-york.png';
import galleryRainyFoodTruck from '../assets/AboutMe/gallery/rainy-food-truck.png';
import galleryRainyMidtown from '../assets/AboutMe/gallery/rainy-midtown.png';
import galleryConcertStage from '../assets/AboutMe/gallery/concert-stage.png';
import gallerySanFranciscoSunset from '../assets/AboutMe/gallery/san-francisco-sunset.png';
import geminiIcon from '../assets/gemini 1.svg';
import linkedInIcon from '../assets/LinkedIn1.png';
import githubIcon from '../assets/github.png';
import xIcon from '../assets/X.png';
import '../styles/LandingPage.css';
import '../styles/AboutMeNew.css';

const GeminiIcon = ({ className }) => (
  <img src={geminiIcon} alt="Gemini" style={{ width: '20px', height: '18px' }} className={className} />
);

const THEME_COLORS = {
  'Peachy Orange': { navBg: '#FFFAF2', navPills: '#FFEED4', companyName: '#FFB13D' },
  'Lavender Dream': { navBg: '#FBF1F9', navPills: '#F8D2FC', companyName: '#865D95' },
  'Blush Petal': { navBg: '#F9DAED', navPills: '#FDF0F8', companyName: '#FB97D4' },
  'Sky': { navBg: '#BEE3FF', navPills: '#D8F1FF', companyName: '#1A7FD6' },
  'Pastel Red': { navBg: '#FFDADF', navPills: '#FFF6F8', companyName: '#FF7084' },
};

const nowItems = [
  {
    k: 'Based in',
    v: 'Mountain View, California',
  },
  {
    k: 'Education',
    v: 'Northeastern University, CS and Design',
    visual: null,
  },
];

const galleryPhotos = [
  { src: galleryGoldenGate, alt: 'Golden Gate Bridge at dusk', size: 'narrow' },
  { src: galleryOneWorldTrade, alt: 'One World Trade Center against a blue sky', size: 'narrow' },
  { src: galleryManhattanBuildings, alt: 'A cluster of Manhattan buildings', size: 'medium' },
  { src: galleryManhattanSkyline, alt: 'Lower Manhattan skyline', size: 'medium-wide' },
  { src: galleryPanthNewYork, alt: 'Panth by the New York waterfront', size: 'narrow' },
  { src: galleryRainyFoodTruck, alt: 'A rainy day beside an ice cream truck', size: 'narrow' },
  { src: galleryRainyMidtown, alt: 'A traffic officer working in the rain', size: 'narrow' },
  { src: galleryConcertStage, alt: 'A concert performance on a checkered stage', size: 'medium' },
  { src: gallerySanFranciscoSunset, alt: 'San Francisco homes glowing at sunset', size: 'anchor' },
];

const AboutMeNew = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const themeColors = useMemo(() => {
    const name = theme?.name || 'Peachy Orange';
    return THEME_COLORS[name] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  const accent = themeColors.companyName;

  return (
    <div className="about-page" style={{ '--accent': accent }}>
      <Navbar
        theme={theme}
        currentPage="about"
        activeTab="about"
        onTabClick={() => navigate('/home')}
        onChatOpen={() => setIsChatOpen(true)}
        onLogoClick={() => navigate('/home')}
        GeminiIcon={GeminiIcon}
      />

      <main className="about-main site-container">

        {/* ── HERO ── */}
        <section className="about-hero">
          <div className="about-hero-grid">
            <div className="about-bio">
              <h1 className="about-heading">
                Hi, I'm Panth<span style={{ color: accent }}>.</span>
              </h1>
              <p>
                I'm Panth. I design eCommerce experiences at Samsung Electronics in Mountain View.
              </p>
              <p>
                I grew up in Ahmedabad, studied in Boston, and ended up in the Bay Area. Every move taught me something new about how people actually use things. I care most about the messy, complex flows, checkout, onboarding, the stuff nobody notices when it works.
              </p>
              <p>
                Outside of work? I take way too many photos. I'll say yes to almost any game, and I've made real friends from cold LinkedIn DMs. Embarrassing to admit, but it works.
              </p>
              <div className="about-hero-now" aria-label="Current details">
                {nowItems.map((row, i) => (
                  <div key={i} className="about-hero-now-row">
                    <span className="about-hero-now-key">{row.k}</span>
                    <span className="about-hero-now-val">{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-hero-collage" aria-label="Photos from Panth's life">
              <div className="about-hero-photo about-hero-photo--primary">
                <img src={heroHike} alt="Panth Shah" />
              </div>
              <div className="about-hero-photo about-hero-photo--secondary">
                <img src={aboutMe8} alt="Cooking moment" />
              </div>
              <div className="about-hero-photo about-hero-photo--secondary">
                <img src={heroGame} alt="Catching a game at sunset" />
              </div>
            </div>
          </div>
        </section>

        {/* ── PHOTO FILMSTRIP ── */}
        <section className="about-section about-gallery" aria-label="Personal photo gallery">
          <div className="about-gallery-intro">
            <h2 className="about-heading about-gallery-heading">I carry a camera everywhere</h2>
            <p className="about-gallery-description">
              Photos and little videos from wherever I end up. No theme, just things that caught my eye.
            </p>
          </div>
          <div className="about-gallery-viewport">
            <div className="about-filmstrip">
              {[0, 1].map((sequenceIndex) => (
                <div
                  key={sequenceIndex}
                  className="about-filmstrip-sequence"
                  aria-hidden={sequenceIndex === 1 ? 'true' : undefined}
                >
                  {galleryPhotos.map(({ src, alt, size }) => (
                    <figure key={src} className={`about-gallery-photo about-gallery-photo--${size}`}>
                      <img
                        src={src}
                        alt={sequenceIndex === 0 ? alt : ''}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="floating-elements">
            {[...Array(5)].map((_, i) => {
              const isSmiley = Math.random() > 0.5;
              return (
                <div key={`l-${i}`} className="floating-emoji" style={{ left: `${5 + Math.random() * 30}%`, animationDelay: `${i * 0.3}s`, color: themeColors.companyName }}>
                  {isSmiley ? <Smiley size={55 + Math.random() * 20} weight="regular" /> : <Heart size={22 + Math.random() * 12} weight="fill" />}
                </div>
              );
            })}
            {[...Array(3)].map((_, i) => (
              <div key={`c-${i}`} className="floating-emoji" style={{ left: `${45 + Math.random() * 10}%`, animationDelay: `${(i + 2) * 0.3}s`, color: themeColors.companyName }}>
                <Heart size={18 + Math.random() * 8} weight="fill" />
              </div>
            ))}
            {[...Array(5)].map((_, i) => {
              const isSmiley = Math.random() > 0.5;
              return (
                <div key={`r-${i}`} className="floating-emoji" style={{ left: `${65 + Math.random() * 30}%`, animationDelay: `${(i + 3) * 0.3}s`, color: themeColors.companyName }}>
                  {isSmiley ? <Smiley size={55 + Math.random() * 20} weight="regular" /> : <Heart size={22 + Math.random() * 12} weight="fill" />}
                </div>
              );
            })}
          </div>
          <div className="footer-content">
            <h2 className="footer-title">Thank you for visiting!</h2>
            <p className="footer-subtitle">Created with MagicPath + Figma + Paper + Cursor.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
              <a href="https://www.linkedin.com/in/panthshah19/" target="_blank" rel="noopener noreferrer">
                <img src={linkedInIcon} alt="LinkedIn" style={{ width: '42px', height: '42px', cursor: 'pointer' }} />
              </a>
              <a href="https://github.com/panthshah" target="_blank" rel="noopener noreferrer">
                <img src={githubIcon} alt="GitHub" style={{ width: '54px', height: '42px', cursor: 'pointer' }} />
              </a>
              <a href="https://x.com/panthshah_" target="_blank" rel="noopener noreferrer">
                <img src={xIcon} alt="X" style={{ width: '42px', height: '42px', cursor: 'pointer' }} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} themeColors={themeColors} />
      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
    </div>
  );
};

export default AboutMeNew;
