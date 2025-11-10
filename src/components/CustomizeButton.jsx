import { useState, useEffect, useMemo } from 'react';
import ThemeCustomizerModal from './ThemeCustomizerModal';
import magicStickIcon from '../assets/Magic Stick.png';
import cursorCat from '../assets/custom cursor/cursor-cat.png';
import cursorFox from '../assets/custom cursor/cursor cat-1.png';
import cursorCreature from '../assets/custom cursor/cursor-demogorgon.png';
import cursorDog from '../assets/custom cursor/cursor-doggo.png';

const CustomizeButton = ({ theme, onThemeChange }) => {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [buttonBg, setButtonBg] = useState('#FFFAF2');

  const handleCustomizeClick = () => {
    setIsCustomizerOpen(true);
  };

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

  const handleSaveCustomizer = (newThemeName, newCursor) => {
    console.log('Saving theme and cursor:', newThemeName, newCursor);
    
    // Apply cursor globally using image cursor
    const cursorMap = {
      'cat': cursorCat,
      'fox': cursorFox,
      'creature': cursorCreature,
      'dog': cursorDog
    };
    
    if (newCursor && newCursor !== 'default' && cursorMap[newCursor]) {
      const cursorImage = cursorMap[newCursor];
      
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
    } else {
      document.body.style.cursor = 'default';
    }
    
    // Create a simple theme object with just the name
    const newTheme = { name: newThemeName };
    
    // Save to localStorage
    localStorage.setItem('selectedTheme', JSON.stringify(newTheme));
    localStorage.setItem('selectedCursor', newCursor);
    
    // Call parent's theme change handler with the theme object
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
    
    setIsCustomizerOpen(false);
  };

  // Get theme colors - Complete list with useMemo to ensure re-render on theme change
  const themeColors = useMemo(() => {
    const THEME_COLORS = {
      'Peachy Orange': {
        navBg: '#FFFAF2',
        navPills: '#FFEED4',
        companyName: '#FFB13D',
        aboutMeStroke: '#FFB13D'
      },
      'Lavender Dream': {
        navBg: '#FBF1F9',
        navPills: '#F4D9EF',
        companyName: '#D291BC',
        aboutMeStroke: '#D291BC'
      },
      'Blush Petal': {
        navBg: '#FFF0F5',
        navPills: '#FFD9E8',
        companyName: '#FB97D4',
        aboutMeStroke: '#FB97D4'
      },
      'Sky': {
        navBg: '#F0F8FF',
        navPills: '#D4E9FF',
        companyName: '#1A7FD6',
        aboutMeStroke: '#1A7FD6'
      },
      'Pastel Red': {
        navBg: '#FFF5F7',
        navPills: '#FFE0E8',
        companyName: '#FF7084',
        aboutMeStroke: '#FF7084'
      }
    };

    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  // Update button background when theme changes
  useEffect(() => {
    setButtonBg(themeColors.navPills);
  }, [themeColors, theme]);

  return (
    <>
      {/* Sticky Customize Button */}
      <button
        onClick={handleCustomizeClick}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: buttonBg,
          border: 'none',
          borderRadius: '24px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 0.3,
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
      >
        <img 
          src={magicStickIcon} 
          alt="Customize" 
          style={{ 
            width: '20px', 
            height: '20px',
            objectFit: 'contain'
          }} 
        />
      </button>

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentTheme={theme}
        onSave={handleSaveCustomizer}
      />
    </>
  );
};

export default CustomizeButton;

