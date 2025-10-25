import { useState, useMemo } from 'react';
import { User, GameController, File, ChatCircle, ArrowUpRight, Copy, Heart, Smiley, List, X } from '@phosphor-icons/react';
import FlipPhone3D from './FlipPhone3D';
import ChatSidebar from './ChatSidebar';
import project1Image from '../assets/776shots_so.png';
import '../styles/LandingPage.css';

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

const LandingPage = ({ theme, onNavigateToTheme }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const themeColors = useMemo(() => {
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  const handleLogoClick = () => {
    console.log('Logo clicked, navigating to theme selection');
    if (onNavigateToTheme) {
      onNavigateToTheme();
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'about', label: 'About', Icon: User },
    { id: 'playground', label: 'Playground', Icon: GameController },
    { id: 'resume', label: 'Resume', Icon: File },
    { id: 'chat', label: 'Chat', Icon: ChatCircle }
  ];

  return (
    <div className="landing-page">
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
              onClick={handleLogoClick}
            >
              Panth Shah
            </button>
          </div>

          {/* Navigation Tabs */}
          <ul className="navbar-menu">
            {navItems.map((item) => {
              const Icon = item.Icon;
              const isActive = item.id === 'chat' ? true : activeTab === item.id;
              const isChatButton = item.id === 'chat';
              return (
                <li key={item.id} className="navbar-item">
                  <button
                    className={`navbar-tab ${isActive ? 'active' : ''} ${isChatButton ? 'chat-button' : ''}`}
                    onClick={() => isChatButton ? setIsChatOpen(true) : setActiveTab(item.id)}
                    style={isActive ? { backgroundColor: themeColors.navPills } : {}}
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
              {navItems.map((item) => {
                const Icon = item.Icon;
                const isActive = item.id === 'chat' ? true : activeTab === item.id;
                const isChatButton = item.id === 'chat';
                return (
                  <li key={item.id} className="mobile-menu-item">
                    <button
                      className={`mobile-menu-tab ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        if (isChatButton) {
                          setIsChatOpen(true);
                          setMobileMenuOpen(false);
                        } else {
                          handleTabClick(item.id);
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
                <div className="testimonial-avatar"></div>
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
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Zeenat Vastrad</h3>
                  <p className="testimonial-position">Head of Product Design at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 3 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Zeenat Vastrad</h3>
                  <p className="testimonial-position">Head of Product Design at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 4 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Zeenat Vastrad</h3>
                  <p className="testimonial-position">Head of Product Design at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 5 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Zeenat Vastrad</h3>
                  <p className="testimonial-position">Head of Product Design at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
                Panth is a fantastic designer who enjoys exploring.
              </p>
            </div>

            {/* Testimonial Card 6 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Zeenat Vastrad</h3>
                  <p className="testimonial-position">Head of Product Design at Samsung</p>
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
            <h2 className="footer-title">all done!</h2>
            <p className="footer-subtitle">
              We're just verifying a few details and will reach out if we need anything else.
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
    </div>
  );
};

export default LandingPage;

