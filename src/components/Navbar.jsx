import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GameController, File, List, X } from '@phosphor-icons/react';
import '../styles/Navbar.css';

const Navbar = ({ 
  theme, 
  currentPage, 
  activeTab, 
  onTabClick, 
  onChatOpen, 
  onLogoClick,
  GeminiIcon 
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get theme colors
  const THEME_COLORS = {
    'Peachy Orange': {
      navBg: '#FFFAF2',
      navPills: '#FFEED4',
    },
    'Lavender Dream': {
      navBg: '#FBF1F9',
      navPills: '#F8D2FC',
    },
    'Blush Petal': {
      navBg: '#F9DAED',
      navPills: '#FDF0F8',
    },
    'Sky': {
      navBg: '#BEE3FF',
      navPills: '#D8F1FF',
    },
    'Pastel Red': {
      navBg: '#FFDADF',
      navPills: '#FFF6F8',
    }
  };

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

  const handleTabClick = (itemId) => {
    if (onTabClick) {
      onTabClick(itemId);
    }
    setMobileMenuOpen(false);
  };

  return (
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
            onClick={onLogoClick}
          >
            Panth Shah
          </button>
        </div>

        {/* Navigation Tabs */}
        <ul className="navbar-menu">
          {navItems.map((item) => {
            const Icon = item.Icon;
            const isChatButton = item.id === 'chat';
            const isAboutButton = item.id === 'about';
            
            // Determine if tab is active (not for chat button)
            let isActive = false;
            if (currentPage === 'about' && isAboutButton) {
              isActive = true;
            } else if (currentPage === 'landing' && !isChatButton) {
              isActive = activeTab === item.id;
            }

            // Chat button always has background, other buttons only when active
            const hasBackground = isChatButton || isActive;

            return (
              <li key={item.id} className="navbar-item">
                <button
                  className={`navbar-tab ${isActive ? 'active' : ''} ${isChatButton ? 'chat-button' : ''}`}
                  onClick={() => {
                    if (isChatButton) {
                      onChatOpen();
                    } else if (isAboutButton) {
                      navigate('/about');
                    } else if (item.id === 'playground') {
                      navigate('/playground');
                    } else {
                      handleTabClick(item.id);
                    }
                  }}
                  style={hasBackground ? { backgroundColor: themeColors.navPills } : {}}
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
              const isAboutButton = item.id === 'about';
              
              // Determine if tab is active in mobile menu
              let isActive = false;
              if (currentPage === 'about' && isAboutButton) {
                isActive = true;
              } else if (currentPage === 'landing') {
                isActive = activeTab === item.id;
              }

              return (
                <li key={item.id} className="mobile-menu-item">
                  <button
                    className={`mobile-menu-tab ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (isAboutButton) {
                        navigate('/about');
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
  );
};

export default Navbar;

