import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from '@phosphor-icons/react';
import Navbar from './Navbar';
import ChatSidebar from './ChatSidebar';
import CustomizeButton from './CustomizeButton';
import FlipPhone3D from './FlipPhone3D';
import geminiIcon from '../assets/gemini 1.svg';
import camerapIcon from '../assets/camerap.png';
import flip7Icon from '../assets/flip7.png';
import '../styles/Playground.css';

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
    accent: '#FFB13D'
  },
  'Lavender Dream': {
    navBg: '#FBF1F9',
    navPills: '#F8D2FC',
    accent: '#865D95'
  },
  'Blush Petal': {
    navBg: '#F9DAED',
    navPills: '#FDF0F8',
    accent: '#FB97D4'
  },
  'Sky': {
    navBg: '#BEE3FF',
    navPills: '#D8F1FF',
    accent: '#1A7FD6'
  },
  'Pastel Red': {
    navBg: '#FFDADF',
    navPills: '#FFF6F8',
    accent: '#FF7084'
  }
};

// --- PLAYGROUND PROJECTS DATA ---
const PLAYGROUND_PROJECTS = [
  {
    id: 'retro-app',
    label: 'Retro app',
    icon: camerapIcon,
    title: 'NYC Retro Polaroid app',
    description: 'Last month in New York right by wall street, 2 people were clicking pictures of visitors with a polaroid for free. The print looked like NYT front page, with your photo embedded in the layout. I tried recreating that vibe using Gemini and Claude.',
    prototype: 'https://retro-camera-red.vercel.app/',
    prototypeType: 'iframe'
  },
  {
    id: 'flip-7',
    label: 'Flip 7',
    icon: flip7Icon,
    title: 'Galaxy Flip 7',
    description: 'An experimental 3D flip phone built with React Three Fiber. Features interactive apps, weather widgets, and custom wallpapers - all rendered in real-time WebGL.',
    prototype: null,
    prototypeType: 'component'
  }
];

export default function Playground({ theme, onThemeChange }) {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(PLAYGROUND_PROJECTS[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const themeColors = useMemo(() => {
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  const handleNavClick = (project) => {
    setActiveProject(project);
  };

  return (
    <div className="playground-page">
      <Navbar 
        theme={theme}
        currentPage="playground"
        activeTab="playground"
        onTabClick={() => {}}
        onChatOpen={() => setIsChatOpen(true)}
        onLogoClick={() => navigate('/home')}
        GeminiIcon={GeminiIcon}
      />

      <div className="playground-container">
        
        {/* LEFT SIDE - Navigation */}
        <nav className="playground-nav">
          {PLAYGROUND_PROJECTS.map((project) => (
            <div
              key={project.id}
              className={`nav-item ${activeProject.id === project.id ? 'active' : ''}`}
              onClick={() => handleNavClick(project)}
            >
              <div className="nav-item-icon">
                {project.icon ? (
                  <img src={project.icon} alt={project.label} />
                ) : (
                  <Image weight="light" />
                )}
              </div>
              <span className="nav-item-label">{project.label}</span>
            </div>
          ))}
        </nav>

        {/* RIGHT SIDE - Content */}
        <div className="playground-content">
          <div className="content-header">
            <h1 className="content-title">{activeProject.title}</h1>
            <p className="content-description">{activeProject.description}</p>
          </div>

          <div className="prototype-area">
            {activeProject.prototypeType === 'iframe' && activeProject.prototype ? (
              <div className="iframe-wrapper">
                <iframe 
                  src={activeProject.prototype} 
                  title={activeProject.title}
                  allow="camera; microphone"
                />
              </div>
            ) : activeProject.prototypeType === 'component' ? (
              <div className="phone-component-wrapper">
                <FlipPhone3D />
              </div>
            ) : activeProject.prototype ? (
              <img src={activeProject.prototype} alt={activeProject.title} />
            ) : (
              <div className="prototype-placeholder">
                <Image weight="light" />
                <span>Prototype preview</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Chat Sidebar */}
      <ChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        themeColors={themeColors}
      />

      {/* Customize Button */}
      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
    </div>
  );
}
