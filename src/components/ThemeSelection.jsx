import { useState } from 'react';
import { motion } from 'framer-motion';
import NoiseTexture from './textures/NoiseTexture';
import UnifiedTexture, { TEXTURE_CONFIGS } from './textures/UnifiedTexture';
import '../styles/ThemeSelection.css';

const ThemeSelection = ({ onThemeSelect }) => {
  // Enhanced noise texture generator function
  const generateNoiseTexture = (baseColor, intensity = 0.3) => {
    const encodedSvg = encodeURIComponent(`
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="noiseFilter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix 
              type="saturate" 
              values="0" 
              result="noise"
            />
            <feComponentTransfer result="noise">
              <feFuncA type="discrete" tableValues="0 ${intensity}"/>
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.4"/>
      </svg>
    `);
    
    return `url("data:image/svg+xml,${encodedSvg}")`;
  };

  const themes = [
    {
      name: 'Peachy Orange',
      gradient: 'linear-gradient(180deg, #FFF8F3 0%, #FFDEAD 100%)',
      noiseTexture: generateNoiseTexture('#FFDEAD', 0.4),
      colors: ['#FFF8F3', '#FFDEAD'],
      useShader: true
    },
    {
      name: 'Lavender Dream',
      gradient: 'linear-gradient(180deg, #F8F4FF 0%, #E0BBE4 100%)',
      noiseTexture: generateNoiseTexture('#E0BBE4', 0.35),
      colors: ['#F8F4FF', '#E0BBE4'],
      useShader: true
    },
    {
      name: 'Blush Petal',
      gradient: 'linear-gradient(180deg, #FFF0F5 0%, #FFD1DC 100%)',
      noiseTexture: generateNoiseTexture('#FFD1DC', 0.4),
      colors: ['#FFF0F5', '#FFD1DC'],
      useShader: true
    },
    {
      name: 'Sky',
      gradient: 'linear-gradient(180deg, #F0F8FF 0%, #73E9FE 100%)',
      noiseTexture: generateNoiseTexture('#73E9FE', 0.3),
      colors: ['#F0F8FF', '#73E9FE'],
      useShader: true
    },
    {
      name: 'Pastel Red',
      gradient: 'linear-gradient(180deg, #FFF5F5 0%, #FF898B 100%)',
      noiseTexture: generateNoiseTexture('#FF898B', 0.4),
      colors: ['#FFF5F5', '#FF898B'],
      useShader: true
    }
  ];

  const [selectedTheme, setSelectedTheme] = useState('Blush Petal');
  const [selectedThemeData, setSelectedThemeData] = useState(themes[2]);

  const playClickSound = () => {
    const mouseclick = new Audio();
    mouseclick.src = "https://uploads.sitepoint.com/wp-content/uploads/2023/06/1687569402mixkit-fast-double-click-on-mouse-275.wav";
    mouseclick.volume = 0.3;
    mouseclick.play().catch(() => {
      // Fallback sound if external audio fails
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    });
  };

  const handleThemeSelect = (theme) => {
    playClickSound();
    setSelectedTheme(theme.name);
    setSelectedThemeData(theme);
    onThemeSelect(theme);
  };

  const getDisplayTheme = (theme, index) => {
    const selectedIndex = themes.findIndex(t => t.name === selectedTheme);
    const isMiddle = index === 2;
    
    if (isMiddle) {
      return themes[selectedIndex];
    } else if (index === selectedIndex) {
      return themes[2];
    } else {
      return theme;
    }
  };

  const renderTexture = (themeName) => {
    // Check if we have a shader config for this theme
    if (TEXTURE_CONFIGS[themeName]) {
      return <UnifiedTexture themeName={themeName} />;
    }
    // Fallback to noise texture
    return <NoiseTexture />;
  };

  return (
    <div className="theme-selection-container">
      <h1 className="theme-selection-title">
        Please select a theme before continue seeing the portfolio
      </h1>

      <div className="theme-container">
        {themes.map((theme, index) => {
          const isMiddle = index === 2;
          const displayTheme = getDisplayTheme(theme, index);
          
          return (
            <motion.div
              key={`${index}-${displayTheme.name}`}
              onClick={() => handleThemeSelect(displayTheme)}
              className="theme-item"
            >
              <motion.div 
                className={`theme-circle ${isMiddle ? 'middle' : 'regular'}`}
                whileHover={{
                  y: -8,
                  scale: 1.02
                }}
                whileTap={{
                  y: -4,
                  scale: 0.98
                }}
              >
                {/* Base gradient layer */}
                <motion.div
                  className="theme-gradient"
                  style={{ background: displayTheme.gradient }}
                  animate={{ background: displayTheme.gradient }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.8
                  }}
                />
                
                {/* Enhanced texture layer */}
                {displayTheme.useShader ? (
                  <motion.div
                    className="theme-shader"
                    key={`shader-${displayTheme.name}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3
                    }}
                  >
                    {renderTexture(displayTheme.name)}
                  </motion.div>
                ) : (
                  <motion.div
                    className="theme-noise"
                    style={{ background: displayTheme.noiseTexture }}
                    animate={{ background: displayTheme.noiseTexture }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3
                    }}
                  />
                )}
              </motion.div>
              
              <span className={`theme-label ${isMiddle ? 'middle' : 'regular'}`}>
                {displayTheme.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        className="continue-button"
        style={{ background: selectedThemeData ? selectedThemeData.colors[1] : themes[2].colors[1] }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        onClick={() => {
          playClickSound();
          console.log('Continue with theme:', selectedThemeData);
        }}
      >
        Continue
      </motion.button>
    </div>
  );
};

export default ThemeSelection;
