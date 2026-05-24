import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Smiley, Buildings } from '@phosphor-icons/react';
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
import '../styles/LandingPage.css';
import '../styles/AboutMeNew.css';

const GeminiIcon = ({ size = 20, className }) => (
  <img
    src={geminiIcon}
    alt="Gemini"
    style={{ width: '20px', height: '18px' }}
    className={className}
  />
);

const THEME_COLORS = {
  'Peachy Orange': {
    navBg: '#FFFAF2',
    navPills: '#FFEED4',
    companyName: '#FFB13D',
  },
  'Lavender Dream': {
    navBg: '#FBF1F9',
    navPills: '#F8D2FC',
    companyName: '#865D95',
  },
  'Blush Petal': {
    navBg: '#F9DAED',
    navPills: '#FDF0F8',
    companyName: '#FB97D4',
  },
  'Sky': {
    navBg: '#BEE3FF',
    navPills: '#D8F1FF',
    companyName: '#1A7FD6',
  },
  'Pastel Red': {
    navBg: '#FFDADF',
    navPills: '#FFF6F8',
    companyName: '#FF7084',
  },
};

const tools = [
  'Figma', 'Framer', 'Protopie', 'React', 'CSS', 'Cursor',
  'User Research', 'Design Systems', 'Accessibility', 'Interaction Design',
];

const hobbies = [
  { icon: '🍳', title: 'Cooking', note: 'Ramen and hash browns — my two constants. I will find a reason to make either on any given day.' },
  { icon: '📷', title: 'Photography', note: 'Just picked up a new Sony. Still figuring out what I\'m doing, but I\'m out there shooting anyway.' },
  { icon: '☕', title: 'Coffee', note: 'Pour-over at home, Blue Bottle on weekends. Slow ritual, fast cooling.' },
  { icon: '🎬', title: 'Movies', note: 'Currently on my second watch of Jack Ryan: The Ghost War. Big fan of anything with a good plot and fast pacing.' },
];

const nowItems = [
  { k: 'Currently', v: 'Samsung Electronics — UX Designer' },
  { k: 'Based in',  v: 'Mountain View, California' },
  { k: 'Open to',   v: 'Full-time roles across the United States.' },
  { k: 'Reading',   v: 'The Knight of Seven Kingdoms — George R.R. Martin' },
  { k: 'Listening', v: 'Frank Ocean and Charlie Puth' },
];

const bootLines = [
  { t: 'booting about-me.sh…',                d: 200, c: 'muted' },
  { t: 'mounting /experience       [OK]',     d: 220, c: 'muted' },
  { t: 'loading personality.json   [OK]',     d: 220, c: 'muted' },
  { t: 'syncing /hobbies & /photos [OK]',     d: 220, c: 'muted' },
  { t: 'ready.',                              d: 250, c: 'accent' },
];

const BootBlock = () => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= bootLines.length) return;
    const id = setTimeout(() => setN((v) => v + 1), bootLines[n].d);
    return () => clearTimeout(id);
  }, [n]);

  return (
    <div className="about-boot">
      {bootLines.slice(0, n).map((l, i) => (
        <div key={i} className={`about-boot-line about-boot-${l.c}`}>{l.t}</div>
      ))}
      {n < bootLines.length && <div className="about-boot-cursor">▍</div>}
    </div>
  );
};

const AboutMeNew = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const themeColors = useMemo(() => {
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  const accent = themeColors.companyName;

  return (
    <div className="about-new-page about-terminal" style={{ '--about-accent': accent }}>
      <Navbar
        theme={theme}
        currentPage="about"
        activeTab="about"
        onTabClick={() => navigate('/home')}
        onChatOpen={() => setIsChatOpen(true)}
        onLogoClick={() => navigate('/home')}
        GeminiIcon={GeminiIcon}
      />

      <main className="about-terminal-main">
        {/* Boot sequence */}
        <section className="about-section about-boot-section">
          <BootBlock />
        </section>

        {/* Hero */}
        <section className="about-section about-hero">
          <div className="about-hero-grid">
            <div className="about-hero-text">
              <h1 className="about-hero-headline">
                Hi, I'm Panth<span style={{ color: accent }}>.</span>
              </h1>
              <div className="about-hero-intro">
                <p>
                  I'm Panth, a Product Designer currently designing eCommerce experiences at Samsung Electronics in Mountain View, California.
                </p>
                <p>
                  My path has taken me from Ahmedabad to Boston to the Bay Area, and each place has shaped how I see people, products, and the small decisions that make an experience feel effortless. I'm especially drawn to complex digital journeys — the kind where clarity, timing, and trust can make all the difference.
                </p>
                <p>
                  Outside of work, I'm usually watching movies, cooking something for my Instagram, saying yes to almost any kind of game, or meeting new people in the most unexpected ways — from coffee shops and conferences to LinkedIn DMs that turn into real conversations.
                </p>
              </div>
            </div>
            <div className="about-hero-image">
              <img src={aboutMe1} alt="Panth Shah" />
            </div>
          </div>
        </section>

        {/* $ now */}
        <Block label="$ now" desc="what i'm up to right now">
          <table className="about-now-table">
            <tbody>
              {nowItems.map((row, i) => (
                <tr key={i}>
                  <td className="about-now-key">{row.k}</td>
                  <td className="about-now-val">{row.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>

        {/* $ ls education/ */}
        <Block label="$ ls education/" desc="formal training">
          <div className="about-timeline">
            <div className="about-timeline-item">
              <div className="about-timeline-header">
                <div className="about-timeline-left">
                  <div className="about-timeline-icon">
                    <Buildings size={18} weight="regular" />
                  </div>
                  <span className="about-timeline-company">Northeastern University</span>
                  <span className="about-timeline-divider">|</span>
                  <span className="about-timeline-role">Master of Science, CS &amp; Design</span>
                </div>
                <span className="about-timeline-period">2022 — 2024</span>
              </div>
            </div>
          </div>
        </Block>

        {/* $ ls tools/ */}
        <Block label="$ ls tools/" desc="things i use to make things">
          <div className="about-tools">
            {tools.map((tool) => (
              <span key={tool} className="about-tool">{tool}</span>
            ))}
          </div>
        </Block>

        {/* $ ls hobbies/ */}
        <Block label="$ ls hobbies/" desc="things i do when nobody's paying me">
          <div className="about-hobbies">
            {hobbies.map((h, i) => (
              <div key={i} className="about-hobby">
                <div className="about-hobby-icon">{h.icon}</div>
                <div className="about-hobby-body">
                  <div className="about-hobby-title">{h.title}</div>
                  <div className="about-hobby-note">{h.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* $ ls photos/ */}
        <Block label="$ ls photos/" desc="frames from the everyday">
          <div className="about-bento">
            {[
              { src: aboutMe8, caption: 'I love to cook', cls: 'about-bento-wide' },
              { src: aboutMe7, caption: 'This is what makes me go at the office', cls: 'about-bento-tall' },
              { src: aboutMe6, caption: 'Shot on iCamera by Nothing', cls: '' },
              { src: aboutMe5, caption: 'People that helped me grow', cls: '' },
              { src: aboutMe4, caption: 'Evenings are my fav part of the day', cls: '' },
              { src: aboutMe3, caption: 'Boston will always be home', cls: 'about-bento-wide' },
              { src: aboutMe2, caption: 'Halloween 2025', cls: '' },
            ].map(({ src, caption, cls }, i) => (
              <div key={i} className={`about-bento-item ${cls}`}>
                <img src={src} alt={caption} />
                <div className="about-bento-caption">{caption}</div>
              </div>
            ))}
          </div>
        </Block>
      </main>

      {/* Footer — untouched */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="floating-elements">
            {[...Array(5)].map((_, i) => {
              const isSmileyIcon = Math.random() > 0.5;
              const delay = i * 0.3;
              const leftPosition = 5 + Math.random() * 30;
              return (
                <div key={`left-${i}`} className="floating-emoji" style={{ left: `${leftPosition}%`, animationDelay: `${delay}s`, color: themeColors.companyName }}>
                  {isSmileyIcon ? <Smiley size={55 + Math.random() * 20} weight="regular" /> : <Heart size={22 + Math.random() * 12} weight="fill" />}
                </div>
              );
            })}
            {[...Array(3)].map((_, i) => {
              const delay = (i + 2) * 0.3;
              const leftPosition = 45 + Math.random() * 10;
              return (
                <div key={`center-${i}`} className="floating-emoji" style={{ left: `${leftPosition}%`, animationDelay: `${delay}s`, color: themeColors.companyName }}>
                  <Heart size={18 + Math.random() * 8} weight="fill" />
                </div>
              );
            })}
            {[...Array(5)].map((_, i) => {
              const isSmileyIcon = Math.random() > 0.5;
              const delay = (i + 3) * 0.3;
              const leftPosition = 65 + Math.random() * 30;
              return (
                <div key={`right-${i}`} className="floating-emoji" style={{ left: `${leftPosition}%`, animationDelay: `${delay}s`, color: themeColors.companyName }}>
                  {isSmileyIcon ? <Smiley size={55 + Math.random() * 20} weight="regular" /> : <Heart size={22 + Math.random() * 12} weight="fill" />}
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

      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        themeColors={themeColors}
      />
      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
    </div>
  );
};

const Block = ({ label, desc, children }) => (
  <section className="about-section about-block">
    <div className="about-block-header">
      <h2 className="about-block-label">{label}</h2>
      <span className="about-block-desc">{desc}</span>
      <span className="about-block-rule" />
    </div>
    <div className="about-block-body">{children}</div>
  </section>
);

export default AboutMeNew;
