import { useState, useMemo } from 'react';
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
  const [isChatOpen, setIsChatOpen] = useState(false);

  const themeColors = useMemo(() => {
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  return (
    <div className="about-me-page">
      {/* Navigation Bar */}
      <Navbar 
        theme={theme}
        currentPage="about"
        activeTab="about"
        onTabClick={onBack}
        onChatOpen={() => setIsChatOpen(true)}
        onNavigateToAbout={() => {}}
        onLogoClick={onBack}
        GeminiIcon={GeminiIcon}
      />

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

