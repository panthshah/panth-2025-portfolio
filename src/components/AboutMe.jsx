import { useState, useMemo } from 'react';
import { User, GameController, File, List, X } from '@phosphor-icons/react';
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
import '../styles/LandingPage.css';
import '../styles/AboutMe.css';

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

const AboutMe = ({ theme, onBack, onThemeChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const themeColors = useMemo(() => {
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  const navItems = [
    { id: 'about', label: 'About', Icon: User },
    { id: 'playground', label: 'Playground', Icon: GameController },
    { id: 'resume', label: 'Resume', Icon: File },
    { id: 'chat', label: 'Chat', Icon: GeminiIcon }
  ];

  return (
    <div className="about-me-page">
      {/* Navigation Bar */}
      <nav className="navbar" style={{ backgroundColor: themeColors.navBg }}>
        <div className="navbar-container">
          {/* Logo/Name */}
          <div className="navbar-logo">
            <button 
              className="logo-text" 
              style={{ 
                backgroundColor: themeColors.navPills,
                color: '#000000'
              }}
              onClick={onBack}
            >
              Panth Shah
            </button>
          </div>

          {/* Navigation Tabs */}
          <ul className="navbar-menu">
            {navItems.map((item) => {
              const Icon = item.Icon;
              const isActive = item.id === 'about';
              const isChatButton = item.id === 'chat';
              return (
                <li key={item.id} className="navbar-item">
                  <button
                    className={`navbar-tab ${isActive ? 'active' : ''} ${isChatButton ? 'chat-button' : ''}`}
                    onClick={() => {
                      if (isChatButton) {
                        setIsChatOpen(true);
                      } else if (item.id === 'about') {
                        // Already on about page
                      } else {
                        onBack();
                      }
                    }}
                    style={(isActive || isChatButton) ? { backgroundColor: themeColors.navPills } : {}}
                  >
                    <Icon size={16} weight="regular" className="tab-icon" />
                    <span className="tab-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Hamburger Menu Button */}
          <button 
            className="hamburger-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ backgroundColor: themeColors.navPills }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} weight="bold" />
            ) : (
              <List size={24} weight="bold" />
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer" style={{ backgroundColor: themeColors.navBg }}>
            <ul className="mobile-menu-list">
              {navItems.filter(item => item.id !== 'chat').map((item) => {
                const Icon = item.Icon;
                const isActive = item.id === 'about';
                return (
                  <li key={item.id} className="mobile-menu-item">
                    <button
                      className={`mobile-menu-tab ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        if (item.id === 'about') {
                          setMobileMenuOpen(false);
                        } else {
                          onBack();
                          setMobileMenuOpen(false);
                        }
                      }}
                      style={isActive ? { backgroundColor: themeColors.navPills } : {}}
                    >
                      <Icon size={18} weight="regular" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Bento Grid Container */}
      <div className="about-me-container">
        <div className="bento-grid">
          {/* Row 1 - Large left image */}
          <div className="bento-item large-left" data-caption="This was me in New York few days back">
            <img src={aboutMe1} alt="About Me 1" />
          </div>
          
          {/* Row 1 - Top right images */}
          <div className="bento-item top-right-1" data-caption="Halloween 2025 👻">
            <img src={aboutMe2} alt="About Me 2" />
          </div>
          <div className="bento-item top-right-2" data-caption="Boston will be always home">
            <img src={aboutMe3} alt="About Me 3" />
          </div>

          {/* Row 1 - Bottom right images */}
          <div className="bento-item bottom-right-1" data-caption="This is what makes me go at Office">
            <img src={aboutMe7} alt="About Me 7" />
          </div>
          <div className="bento-item bottom-right-2" data-caption="I love to cook">
            <img src={aboutMe8} alt="About Me 8" />
          </div>

          {/* Row 2 - Bottom left images */}
          <div className="bento-item bottom-left-1" data-caption="If you loved this picture, it was taken on icamera by nothing">
            <img src={aboutMe6} alt="About Me 6" />
          </div>
          <div className="bento-item bottom-left-2" data-caption="Evenings are my fav part of the day">
            <img src={aboutMe4} alt="About Me 4" />
          </div>

          {/* Row 2 - Large bottom right image */}
          <div className="bento-item large-bottom-right" data-caption="People that helped me grow">
            <img src={aboutMe5} alt="About Me 5" />
          </div>
        </div>
      </div>

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

export default AboutMe;

