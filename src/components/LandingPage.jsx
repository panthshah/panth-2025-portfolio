import { useState, useMemo, useEffect } from 'react';
import { ArrowUpRight, Copy, Heart, Smiley } from '@phosphor-icons/react';
import Navbar from './Navbar';
import FlipPhone3D from './FlipPhone3D';
import ChatSidebar from './ChatSidebar';
import CustomizeButton from './CustomizeButton';
import project1Image from '../assets/776shots_so.png';
import geminiIcon from '../assets/gemini 1.svg';
import zeenatAvatar from '../assets/Testimonial/Zeenat.jpeg';
import joshAvatar from '../assets/Testimonial/Josh.jpeg';
import saloniAvatar from '../assets/Testimonial/saloni.jpeg';
import shefaliAvatar from '../assets/Testimonial/shefali.jpeg';
import kyleAvatar from '../assets/Testimonial/kyle.jpeg';
import pradeepAvatar from '../assets/Testimonial/pradeep.jpeg';
import cursorCat from '../assets/custom cursor/cursor-cat.png';
import cursorFox from '../assets/custom cursor/cursor cat-1.png';
import cursorCreature from '../assets/custom cursor/cursor-demogorgon.png';
import cursorDog from '../assets/custom cursor/cursor-doggo.png';
import '../styles/LandingPage.css';

// Custom Gemini Icon Component
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
    aboutMeStroke: '#FFB13D'
  },
  'Lavender Dream': {
    navBg: '#FBF1F9',
    navPills: '#F8D2FC',
    companyName: '#865D95',
    aboutMeStroke: '#865D95'
  },
  'Blush Petal': {
    navBg: '#F9DAED',
    navPills: '#FDF0F8',
    companyName: '#FB97D4',
    aboutMeStroke: '#FB97D4'
  },
  'Sky': {
    navBg: '#BEE3FF',
    navPills: '#D8F1FF',
    companyName: '#1A7FD6',
    aboutMeStroke: '#1A7FD6'
  },
  'Pastel Red': {
    navBg: '#FFDADF',
    navPills: '#FFF6F8',
    companyName: '#FF7084',
    aboutMeStroke: '#FF7084'
  }
};

const LandingPage = ({ theme, onNavigateToTheme, onThemeChange, onNavigateToAbout }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const themeColors = useMemo(() => {
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  // Load saved cursor on mount
  useEffect(() => {
    const savedCursor = localStorage.getItem('selectedCursor');
    if (savedCursor && savedCursor !== 'default') {
      const cursorMap = {
        'cat': cursorCat,
        'fox': cursorFox,
        'creature': cursorCreature,
        'dog': cursorDog
      };
      
      const cursorImage = cursorMap[savedCursor];
      if (cursorImage) {
        // Create an image element to load and convert to canvas
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 32, 32);
          const dataUrl = canvas.toDataURL();
          document.body.style.cursor = `url('${dataUrl}') 16 16, auto`;
        };
        img.src = cursorImage;
      }
    }
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <Navbar 
        theme={theme}
        currentPage="landing"
        activeTab={activeTab}
        onTabClick={handleTabClick}
        onChatOpen={() => setIsChatOpen(true)}
        onNavigateToAbout={onNavigateToAbout}
        onLogoClick={() => {}}
        GeminiIcon={GeminiIcon}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left Side - Content */}
          <div className="hero-content">
            <h1 className="hero-headline">
              Meet Panth, a product designer who thrives on experimenting and trying new things
            </h1>
            
            <p className="hero-description">
              When I'm not designing, I enjoy playing pickleball, trying new recipes, editing fun videos, trying exploring ideas into functional prototypes using cursor
            </p>
            
            <p className="hero-current">
              Currently Product designer at{' '}
              <a 
                href="https://www.samsung.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hero-link"
                style={{ color: themeColors.companyName }}
              >
                Samsung Electronics America
              </a>
            </p>
            
            <div className="hero-buttons">
              <button 
                className="btn-primary btn-about-me"
                onClick={onNavigateToAbout}
                style={{
                  backgroundColor: 'transparent',
                  border: `1.5px solid ${themeColors.aboutMeStroke}`,
                  color: '#000000'
                }}
              >
                About Me
                <ArrowUpRight size={16} weight="bold" />
              </button>
              <button className="btn-secondary">
                <Copy size={16} weight="regular" />
                Copy Email
              </button>
            </div>
          </div>

          {/* Right Side - 3D Phone */}
          <div className="hero-visual">
            <FlipPhone3D />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="projects-container">
          {/* Project 1 - Samsung */}
          <div className="project-card">
            <div className="project-content">
              <h2 className="project-title">Samsung Electronics America</h2>
              <p className="project-description">
                Led UX design for the "Buy More, Save More" feature on Samsung's platform to boost annual sales by $1M through improved visibility and engagement.
              </p>
              <a href="#" className="project-link">
                Read Case study
                <ArrowUpRight size={16} weight="regular" />
              </a>
            </div>
            <div className="project-image">
              <img 
                src={project1Image}
                alt="Samsung Electronics America project"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">Testimonials</h2>
          
          <div className="testimonials-grid">
            {/* Testimonial Card 1 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={zeenatAvatar} alt="Zeenat Vastrad" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Zeenat Vastrad</h3>
                  <p className="testimonial-position">Head of Product Design at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 2 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={joshAvatar} alt="Josh Turner" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Josh Turner</h3>
                  <p className="testimonial-position">Senior Product Designer at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 3 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={saloniAvatar} alt="Saloni Gosalia" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Saloni Gosalia</h3>
                  <p className="testimonial-position">Senior Designer at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 4 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={shefaliAvatar} alt="Shefali Kotnala" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Shefali Kotnala</h3>
                  <p className="testimonial-position">Senior Product Manager at SEA</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 5 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={kyleAvatar} alt="Kyle Reguero" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Kyle Reguero</h3>
                  <p className="testimonial-position">Lead Product Designer at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 6 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={pradeepAvatar} alt="Pradeep Panwar" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Pradeep Panwar</h3>
                  <p className="testimonial-position">Director of Engineering at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-container">
          {/* Floating Animation Elements */}
          <div className="floating-elements">
            {/* LEFT SIDE EMOJIS - 5 emojis on left of "all done!" */}
            {[...Array(5)].map((_, i) => {
              const isSmiley = Math.random() > 0.5;
              const delay = i * 0.3;
              const leftPosition = 5 + Math.random() * 30; // 5-35%
              
              return (
                <div
                  key={`left-${i}`}
                  className="floating-emoji"
                  style={{
                    left: `${leftPosition}%`,
                    animationDelay: `${delay}s`,
                    color: themeColors.companyName
                  }}
                >
                  {isSmiley ? (
                    <Smiley size={55 + Math.random() * 20} weight="regular" />
                  ) : (
                    <Heart size={22 + Math.random() * 12} weight="fill" />
                  )}
                </div>
              );
            })}
            
            {/* CENTER HEARTS - 3 small hearts in middle */}
            {[...Array(3)].map((_, i) => {
              const delay = (i + 2) * 0.3;
              const leftPosition = 45 + Math.random() * 10; // 45-55%
              
              return (
                <div
                  key={`center-${i}`}
                  className="floating-emoji"
                  style={{
                    left: `${leftPosition}%`,
                    animationDelay: `${delay}s`,
                    color: themeColors.companyName
                  }}
                >
                  <Heart size={18 + Math.random() * 8} weight="fill" />
                </div>
              );
            })}
            
            {/* RIGHT SIDE EMOJIS - 5 emojis on right of "all done!" */}
            {[...Array(5)].map((_, i) => {
              const isSmiley = Math.random() > 0.5;
              const delay = (i + 3) * 0.3;
              const leftPosition = 65 + Math.random() * 30; // 65-95%
              
              return (
                <div
                  key={`right-${i}`}
                  className="floating-emoji"
                  style={{
                    left: `${leftPosition}%`,
                    animationDelay: `${delay}s`,
                    color: themeColors.companyName
                  }}
                >
                  {isSmiley ? (
                    <Smiley size={55 + Math.random() * 20} weight="regular" />
                  ) : (
                    <Heart size={22 + Math.random() * 12} weight="fill" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Content */}
          <div className="footer-content">
            <h2 className="footer-title">Thank you for visiting!</h2>
            <p className="footer-subtitle">
              Created with MagicPath + Figma + Paper + Cursor.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Sidebar */}
      <ChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        themeColors={themeColors}
      />

      {/* Reusable Customize Button Component */}
      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
    </div>
  );
};

export default LandingPage;

