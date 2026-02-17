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
import exp1Icon from '../assets/experience1.png';
import exp2Icon from '../assets/experience2.png';
import exp3Icon from '../assets/experience3.png';
import exp4Icon from '../assets/experience4.png';
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
  }
};

const experiences = [
  {
    company: 'Samsung Electronics America',
    role: 'UX Designer',
    period: 'May 2025 — Present',
    icon: exp1Icon,
  },
  {
    company: 'Phealth',
    role: 'Founding Product Design Engineer',
    period: 'Jan 2025 — Apr 2025',
    icon: exp2Icon,
  },
  {
    company: 'Northeastern University',
    role: 'UX Designer',
    period: 'May 2023 — Dec 2024',
    icon: exp3Icon,
  },
  {
    company: 'FounderWay',
    role: 'UX Intern',
    period: 'Jan 2024 — May 2024',
    icon: exp4Icon,
  },
  {
    company: 'Unify Pvt Ltd',
    role: 'Product Designer',
    period: 'May 2021 — Jul 2023',
    icon: null,
  },
];

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

  return (
    <div className="about-new-page">
      <Navbar 
        theme={theme}
        currentPage="about"
        activeTab="about"
        onTabClick={() => navigate('/home')}
        onChatOpen={() => setIsChatOpen(true)}
        onLogoClick={() => navigate('/home')}
        GeminiIcon={GeminiIcon}
      />

      {/* Hero Section - 2 Column: Text Left, Image Right */}
      <section className="about-new-hero">
        <div className="about-new-hero-grid">
          <div className="about-new-hero-text">
            <h1 className="about-new-headline">
              Hi, I'm Panth — it's really nice to meet you<span style={{ color: themeColors.companyName }}>.</span>
            </h1>
            <div className="about-new-intro">
              <p>
                I'm currently based out of Mountain View, California, working at Samsung Electronics as a UX Designer.
              </p>
              <p>
                My adventure started during the COVID pandemic, when I was still in college and stuck in my tiny dorm room. I fell into a rabbit hole of design, spending late nights recreating layouts I saw on Dribbble and Behance just for fun.
              </p>
              <p>
                At first, I was only focused on how things looked. But over time, I realized that visuals and functionality aren't separate — they work together. That clicked for me when I saw how a small interaction or layout change could completely change how someone felt using a product.
              </p>
              <p>
                I've always loved coding because it feels a bit like magic: a few lines of code and suddenly something new appears on my screen. Combining that with design made me obsessed with creating interfaces that not only look good, but feel effortless to use.
              </p>
              <p>
                I'm still exploring, learning, and experimenting with how design can make our digital world a little more thoughtful, intuitive, and fun.
              </p>
            </div>
          </div>
          <div className="about-new-hero-image">
            <img src={aboutMe1} alt="Panth Shah" />
          </div>
        </div>
      </section>

      {/* Photo Bento Grid */}
      <section className="about-new-photos">
        <div className="about-new-photos-inner">
          <div className="about-new-bento">
            <div className="about-bento-item about-bento-wide">
              <img src={aboutMe8} alt="I love to cook" />
            </div>
            <div className="about-bento-item">
              <img src={aboutMe7} alt="This is what makes me go at Office" />
            </div>
            <div className="about-bento-item">
              <img src={aboutMe6} alt="Shot on iCamera by Nothing" />
            </div>
            <div className="about-bento-item">
              <img src={aboutMe5} alt="People that helped me grow" />
            </div>
            <div className="about-bento-item">
              <img src={aboutMe4} alt="Evenings are my fav part of the day" />
            </div>
            <div className="about-bento-item about-bento-wide">
              <img src={aboutMe3} alt="Boston will always be home" />
            </div>
            <div className="about-bento-item">
              <img src={aboutMe2} alt="Halloween 2025" />
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="about-new-experience">
        <div className="about-new-experience-inner">
          <h2 className="about-new-section-title">Experience</h2>
          <div className="about-new-timeline">
            {experiences.map((exp, i) => (
              <div key={i} className="about-new-timeline-item">
                <div className="about-new-timeline-header">
                  <div className="about-new-timeline-left">
                    <div className="about-new-company-icon">
                      {exp.icon ? (
                        <img src={exp.icon} alt={exp.company} />
                      ) : (
                        <Buildings size={20} weight="regular" />
                      )}
                    </div>
                    <span className="about-new-company">{exp.company}</span>
                    <span className="about-new-divider">|</span>
                    <span className="about-new-role">{exp.role}</span>
                  </div>
                  <span className="about-new-period">{exp.period}</span>
                </div>
                {i < experiences.length - 1 && <div className="about-new-timeline-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="about-new-education">
        <div className="about-new-education-inner">
          <h2 className="about-new-section-title">Education</h2>
          <div className="about-new-timeline">
            <div className="about-new-timeline-item">
              <div className="about-new-timeline-header">
                <div className="about-new-timeline-left">
                  <span className="about-new-company">Northeastern University</span>
                  <span className="about-new-divider">|</span>
                  <span className="about-new-role">Master of Science, CS & Design</span>
                </div>
                <span className="about-new-period">2023 — 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

export default AboutMeNew;
