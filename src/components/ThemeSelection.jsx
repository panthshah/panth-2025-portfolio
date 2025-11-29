import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NoiseTexture from './textures/NoiseTexture';
import UnifiedTexture, { TEXTURE_CONFIGS } from './textures/UnifiedTexture';
import '../styles/ThemeSelection.css';

// Constants for Wheel
const ITEM_ANGLE_GAP = 25; // Gap between items
const WHEEL_RADIUS = 350; 
const TOTAL_SPAN = 5 * ITEM_ANGLE_GAP; // 125 degrees

const ThemeSelection = ({ selectedTheme: initialTheme }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Wheel state
  const [rotation, setRotation] = useState(0); // Start at 0
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchY = useRef(0);
  const velocity = useRef(0);
  const animationFrame = useRef(null);

  // Check for mobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);
  
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

  // Always start fresh with default theme (middle position)
  const [selectedTheme, setSelectedTheme] = useState('Blush Petal');
  const [selectedThemeData, setSelectedThemeData] = useState(themes[2]); // Middle theme

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

  const handleThemeClick = (theme) => {
    playClickSound();
    setSelectedTheme(theme.name);
    setSelectedThemeData(theme);
  };

  // --- WHEEL LOGIC FOR MOBILE ---
  
  // Handle touch start
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setIsDragging(true);
    lastTouchY.current = e.touches[0].clientY;
    velocity.current = 0;
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
  };

  // Handle touch move (rotate wheel)
  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - lastTouchY.current;
    
    // Sensitivity factor
    const sensitivity = 0.5; 
    setRotation(prev => prev + (deltaY * sensitivity));
    
    velocity.current = deltaY;
    lastTouchY.current = currentY;
  };

  // Handle touch end (momentum & snap)
  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsDragging(false);
    
    // Momentum & Snap logic
    const snapToGrid = () => {
      const currentRot = rotation;
      
      // With infinite loop, we just snap to nearest multiple of GAP
      // Target rotation = k * GAP
      // Find k such that (currentRot - k*GAP) is minimized
      
      const gap = ITEM_ANGLE_GAP;
      const remainder = currentRot % gap;
      
      // If remainder is small, snap to current multiple
      // If large, snap to next
      let snapTarget = currentRot - remainder;
      if (Math.abs(remainder) > gap / 2) {
        snapTarget += (remainder > 0 ? gap : -gap);
      }
      
      // Animate to snap point
      const animateSnap = () => {
        setRotation(prev => {
          const diff = snapTarget - prev;
          if (Math.abs(diff) < 0.5) return snapTarget;
          return prev + diff * 0.15; 
        });
        
        if (Math.abs(snapTarget - rotation) > 0.5) {
          animationFrame.current = requestAnimationFrame(animateSnap);
        }
      };
      
      animateSnap();
    };
    
    snapToGrid();
  };

  // Update active theme based on rotation
  useEffect(() => {
    if (!isMobile) return;
    
    // Find item closest to 0 degrees in the wrapped space
    let bestIndex = 0;
    let minDiff = Infinity;
    
    themes.forEach((theme, index) => {
      // Calculate wrapped angle for this item
      const rawAngle = rotation + (index * ITEM_ANGLE_GAP);
      // Normalize to [-TOTAL_SPAN/2, TOTAL_SPAN/2]
      const offset = rawAngle + (TOTAL_SPAN / 2);
      const wrapped = ((offset % TOTAL_SPAN) + TOTAL_SPAN) % TOTAL_SPAN;
      const finalAngle = wrapped - (TOTAL_SPAN / 2);
      
      const diff = Math.abs(finalAngle);
      if (diff < minDiff) {
        minDiff = diff;
        bestIndex = index;
      }
    });

    const newTheme = themes[bestIndex];
    if (newTheme && newTheme.name !== selectedTheme) {
      if (!isDragging) playClickSound(); 
      setSelectedTheme(newTheme.name);
      setSelectedThemeData(newTheme);
    }
  }, [rotation, isMobile, themes, selectedTheme, isDragging]);

  const getDisplayTheme = (theme, index) => {
    // On mobile, we don't swap themes in array, we just rotate
    if (isMobile) {
      return theme;
    }
    
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
  
  const isThemeSelected = (theme) => {
    return theme.name === selectedTheme;
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
        {isMobile ? 'Theme Selection' : 'Please select a theme before continue seeing the portfolio'}
      </h1>

      <div 
        className="theme-container" 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={isMobile ? { touchAction: 'none' } : {}}
      >
        {themes.map((theme, index) => {
          const displayTheme = getDisplayTheme(theme, index);
          const isMiddle = isMobile ? isThemeSelected(displayTheme) : index === 2;
          
          // Calculate wheel position for mobile
          let wheelStyle = {};
          let labelStyle = {};
          
          if (isMobile) {
            // Infinite Loop Logic
            // Calculate wrapped angle for positioning
            // We want items to cycle within the visual arc.
            
            const rawAngle = rotation + (index * ITEM_ANGLE_GAP);
            
            // Wrap angle into [-TOTAL_SPAN/2, TOTAL_SPAN/2] range
            const offset = rawAngle + (TOTAL_SPAN / 2);
            const wrapped = ((offset % TOTAL_SPAN) + TOTAL_SPAN) % TOTAL_SPAN;
            const angleDeg = wrapped - (TOTAL_SPAN / 2);
            
            // Angle in radians
            const angleRad = angleDeg * (Math.PI / 180);
            
            // Calculate X, Y
            const xOffset = Math.cos(angleRad) * WHEEL_RADIUS;
            const yOffset = Math.sin(angleRad) * WHEEL_RADIUS;
            
            // Wheel Center positioned on LEFT side of screen
            // We want the Active Item (at 0 deg) to be centered at x=200px (Shifted right)
            // Active X = CenterX + Radius
            // So CenterX = 200 - Radius = 200 - 350 = -150
            
            const wheelCenterX = -150; 
            const wheelCenterY = 0; 
            
            const x = wheelCenterX + xOffset;
            const y = wheelCenterY + yOffset;
            
            wheelStyle = {
              position: 'absolute',
              left: '0', // Anchor to left side
              top: '50%',
              transform: `translate(${x}px, calc(-50% + ${y}px))`,
              zIndex: isMiddle ? 10 : 1
            };

            // Label: Positioned relative to the theme-item (which wraps the circle)
            // We want it to the left of the circle.
            labelStyle = {
              position: 'absolute',
              right: '100%', // Start from left edge of circle container
              marginRight: '24px', // Gap between circle and text
              top: '50%',
              transform: 'translateY(-50%)',
              width: '200px', // Enough width for long names
              textAlign: 'right',
              opacity: isMiddle ? 1 : 0,
              transition: 'opacity 0.3s',
              pointerEvents: 'none',
              fontFamily: "'Samsung Sharp Sans', system-ui, sans-serif",
              fontWeight: '700',
              zIndex: 20,
              whiteSpace: 'nowrap'
            };
          }

          return (
            <motion.div
              key={`${index}-${displayTheme.name}`}
              onClick={() => handleThemeClick(displayTheme)}
              className="theme-item"
              style={isMobile ? wheelStyle : {}}
            >
              {isMobile && (
                 <span className={`theme-label ${isMiddle ? 'middle' : 'regular'}`} style={labelStyle}>
                  {displayTheme.name}
                </span>
              )}
              
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
              
              <span className={`theme-label ${isMiddle ? 'middle' : 'regular'}`} style={isMobile ? { display: 'none' } : {}}>
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
          localStorage.setItem('selectedTheme', JSON.stringify(selectedThemeData));
          navigate('/home');
        }}
      >
        Continue
      </motion.button>
    </div>
  );
};

export default ThemeSelection;
