import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Smiley } from '@phosphor-icons/react';
import Navbar from './Navbar';
import CustomizeButton from './CustomizeButton';
import ChatSidebar from './ChatSidebar';
import aboutMe1 from '../assets/AboutMe /About Me 1.png';
import aboutMe2 from '../assets/AboutMe /About Me 2.png';
import aboutMe3 from '../assets/AboutMe /About Me 3.png';
import aboutMe4 from '../assets/AboutMe /About Me 4.png';
import aboutMe5 from '../assets/AboutMe /About Me 5.png';
import aboutMe6 from '../assets/AboutMe /About Me 6.png';
import aboutMe7 from '../assets/AboutMe /About Me 7.png';
import aboutMe8 from '../assets/AboutMe /About Me 8.png';
import geminiIcon from '../assets/gemini 1.svg';
import linkedInIcon from '../assets/LinkedIn1.png';
import githubIcon from '../assets/github.png';
import xIcon from '../assets/X.png';
import nowSamsung from '../assets/about/samsung-logo.png';
import nowMountainView from '../assets/about/now-mountain-view.png';
import nowCharliePuth from '../assets/about/now-charlie-puth.png';
import nowKnightBook from '../assets/about/now-knight-book.png';
import stickerFigma from '../assets/about/sticker-figma.png';
import stickerClaude from '../assets/about/sticker-claude.png';
import stickerFigmaMake from '../assets/about/sticker-figma-make.png';
import '../styles/LandingPage.css';
import '../styles/AboutMeNew.css';

const GeminiIcon = ({ size = 20, className }) => (
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
    k: 'Currently',
    v: 'Samsung Electronics — UX Designer',
    visual: <img src={nowSamsung} alt="Samsung" className="about-now-sticker about-now-sticker--icon" />,
  },
  {
    k: 'Based in',
    v: 'Mountain View, California',
    visual: <img src={nowMountainView} alt="Mountain View, California" className="about-now-sticker about-now-sticker--wide" />,
  },
  {
    k: 'Reading',
    v: 'The Knight of Seven Kingdoms — George R.R. Martin',
    visual: <img src={nowKnightBook} alt="A Knight of the Seven Kingdoms" className="about-now-sticker about-now-sticker--tall" />,
  },
  {
    k: 'Listening',
    v: 'Frank Ocean and Charlie Puth',
    visual: <img src={nowCharliePuth} alt="Charlie Puth — CHARLIE" className="about-now-sticker about-now-sticker--album" />,
  },
];

const bentoPhotos = [
  { src: aboutMe8, caption: 'I love to cook',                    cls: 'ab-wide' },
  { src: aboutMe7, caption: 'This is what makes me go at work',  cls: 'ab-tall' },
  { src: aboutMe6, caption: 'Shot on iCamera by Nothing',        cls: '' },
  { src: aboutMe5, caption: 'People that helped me grow',        cls: '' },
  { src: aboutMe4, caption: 'Evenings are my fav part of the day', cls: '' },
  { src: aboutMe3, caption: 'Boston will always be home',        cls: 'ab-wide' },
  { src: aboutMe2, caption: 'Halloween 2025',                    cls: '' },
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

      <main className="about-main">

        {/* ── HERO ── */}
        <section className="about-hero">
          <h1 className="about-heading">
            Hi, I'm Panth<span style={{ color: accent }}>.</span>
          </h1>
          <div className="about-hero-grid">
            <div className="about-bio">
              <p>
                I'm Panth, a Product Designer currently designing eCommerce experiences at Samsung Electronics in Mountain View, California.
              </p>
              <p>
                My path has taken me from Ahmedabad to Boston to the Bay Area, and each place has shaped how I see people, products, and the small decisions that make an experience feel effortless. I'm especially drawn to complex digital journeys — the kind where clarity, timing, and trust can make all the difference.
              </p>
              <p>
                Outside of work, I'm usually watching movies, cooking something for my Instagram, saying yes to almost any kind of game, or meeting new people in the most unexpected ways — from coffee shops and conferences to LinkedIn DMs that turn into real conversations.
              </p>
              <div className="about-stickers">
                <span className="about-sticker-label">Tools I lean on</span>
                <div className="about-sticker-row">
                  <img src={stickerFigmaMake} alt="Figma Make" className="about-sticker-img" />
                  <img src={stickerClaude} alt="Claude" className="about-sticker-img" />
                  <img src={stickerFigma} alt="Figma" className="about-sticker-img" />
                </div>
              </div>
            </div>
            <div className="about-hero-photo">
              <img src={aboutMe1} alt="Panth Shah" />
            </div>
          </div>
        </section>

        {/* ── NOW ── */}
        <section className="about-section">
          <h2 className="about-section-label">Now</h2>
          <div className="about-now">
            {nowItems.map((row, i) => (
              <div key={i} className="about-now-row">
                <span className="about-now-key">{row.k}</span>
                <span className="about-now-val">{row.v}</span>
                <div className="about-now-visual-wrap">{row.visual}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section className="about-section">
          <h2 className="about-section-label">Education</h2>
          <div className="about-edu-row">
            <div className="about-edu-left">
              <span className="about-edu-school">Northeastern University</span>
              <span className="about-edu-degree">Master of Science, Computer Science &amp; Design</span>
            </div>
            <span className="about-edu-year">2022 — 2024</span>
          </div>
        </section>

        {/* ── PHOTOS ── */}
        <section className="about-section">
          <h2 className="about-section-label">Photos</h2>
          <div className="about-bento">
            {bentoPhotos.map(({ src, caption, cls }, i) => (
              <div key={i} className={`about-bento-item ${cls}`}>
                <img src={src} alt={caption} />
              </div>
            ))}
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
