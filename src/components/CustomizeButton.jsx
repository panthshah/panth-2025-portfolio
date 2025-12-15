import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import magicStickIcon from '../assets/Magic Stick.png';
import cursorCat from '../assets/custom cursor/cursor-cat.png';
import cursorFox from '../assets/custom cursor/cursor cat-1.png';
import cursorCreature from '../assets/custom cursor/cursor-demogorgon.png';
import cursorDog from '../assets/custom cursor/cursor-doggo.png';
import '../styles/ColorPickerPanel.css';

// Color anchors for the 5 theme colors positioned on the 2D grid
const COLOR_ANCHORS = [
  { x: 0, y: 0, color: '#FF7084', name: 'Pastel Red' },      // Top-left
  { x: 1, y: 0, color: '#FB97D4', name: 'Blush Petal' },     // Top-right
  { x: 0.5, y: 0.5, color: '#FFB13D', name: 'Peachy Orange' }, // Center
  { x: 0, y: 1, color: '#B085C9', name: 'Lavender Dream' },  // Bottom-left
  { x: 1, y: 1, color: '#1A7FD6', name: 'Sky' },             // Bottom-right
];

// Parse hex color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Convert RGB to hex
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Inverse Distance Weighting algorithm
const calculateIDWColor = (x, y, anchors, power = 2) => {
  let totalWeight = 0;
  let r = 0, g = 0, b = 0;
  
  // Check if we're exactly on an anchor
  for (const anchor of anchors) {
    const distance = Math.sqrt(Math.pow(x - anchor.x, 2) + Math.pow(y - anchor.y, 2));
    if (distance < 0.001) {
      return anchor.color;
    }
  }
  
  // Calculate weighted average
  for (const anchor of anchors) {
    const distance = Math.sqrt(Math.pow(x - anchor.x, 2) + Math.pow(y - anchor.y, 2));
    const weight = 1 / Math.pow(distance, power);
    const rgb = hexToRgb(anchor.color);
    
    r += rgb.r * weight;
    g += rgb.g * weight;
    b += rgb.b * weight;
    totalWeight += weight;
  }
  
  return rgbToHex(r / totalWeight, g / totalWeight, b / totalWeight);
};

// Find the closest theme based on color
const findClosestTheme = (color) => {
  const targetRgb = hexToRgb(color);
  let closestTheme = COLOR_ANCHORS[0].name;
  let minDistance = Infinity;
  
  for (const anchor of COLOR_ANCHORS) {
    const anchorRgb = hexToRgb(anchor.color);
    const distance = Math.sqrt(
      Math.pow(targetRgb.r - anchorRgb.r, 2) +
      Math.pow(targetRgb.g - anchorRgb.g, 2) +
      Math.pow(targetRgb.b - anchorRgb.b, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestTheme = anchor.name;
    }
  }
  
  return closestTheme;
};

const CustomizeButton = ({ theme, onThemeChange }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [buttonBg, setButtonBg] = useState('#FFFAF2');
  const [handlePosition, setHandlePosition] = useState({ x: 0.5, y: 0.5 }); // Center default
  const [isDragging, setIsDragging] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FFB13D');
  const [selectedCursor, setSelectedCursor] = useState('default');
  const [sparkles, setSparkles] = useState([]);
  const gridRef = useRef(null);
  const sparkleIdRef = useRef(0);
  const panelRef = useRef(null);
  const fabRef = useRef(null);

  // Load saved cursor on mount
  useEffect(() => {
    const savedCursor = localStorage.getItem('selectedCursor') || 'default';
    setSelectedCursor(savedCursor);
    
    if (savedCursor && savedCursor !== 'default') {
      applyCursor(savedCursor);
    }
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isPanelOpen &&
        panelRef.current &&
        fabRef.current &&
        !panelRef.current.contains(e.target) &&
        !fabRef.current.contains(e.target)
      ) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelOpen]);

  // Apply cursor function
  const applyCursor = useCallback((cursorId) => {
    const cursorMap = {
      'cat': cursorCat,
      'fox': cursorFox,
      'creature': cursorCreature,
      'dog': cursorDog
    };
    
    const cursorImage = cursorMap[cursorId];
    if (cursorImage) {
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
  }, []);

  // Update color when handle moves
  useEffect(() => {
    const newColor = calculateIDWColor(handlePosition.x, handlePosition.y, COLOR_ANCHORS);
    setCurrentColor(newColor);
  }, [handlePosition]);

  // Check if handle is near any anchor point
  const nearestAnchorDistance = useMemo(() => {
    let minDistance = Infinity;
    for (const anchor of COLOR_ANCHORS) {
      const distance = Math.sqrt(
        Math.pow(handlePosition.x - anchor.x, 2) + 
        Math.pow(handlePosition.y - anchor.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
    return minDistance;
  }, [handlePosition]);

  // Only show gradient when near an anchor (within 0.25 distance)
  const showGradient = nearestAnchorDistance < 0.25;
  const gradientOpacity = showGradient ? Math.round((1 - nearestAnchorDistance / 0.25) * 40) : 0;

  // Reset handle to center when panel opens
  useEffect(() => {
    if (isPanelOpen) {
      setHandlePosition({ x: 0.5, y: 0.5 });
      setCurrentColor('#FFB13D'); // Peachy Orange (center)
    }
  }, [isPanelOpen]);

  // Apply theme
  const applyTheme = useCallback((themeName) => {
    const newTheme = { name: themeName };
    localStorage.setItem('selectedTheme', JSON.stringify(newTheme));
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  }, [onThemeChange]);

  // Handle drag start
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    // Prevent body scroll on mobile while dragging
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }, []);

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!isDragging || !gridRef.current) return;
    
    // Prevent page scroll on mobile while dragging
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const rect = gridRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    let x = (clientX - rect.left) / rect.width;
    let y = (clientY - rect.top) / rect.height;
    
    // Clamp values between 0 and 1
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    
    setHandlePosition({ x, y });
    
    // Apply theme in real-time while dragging
    const newColor = calculateIDWColor(x, y, COLOR_ANCHORS);
    const themeName = findClosestTheme(newColor);
    applyTheme(themeName);
    
    // Create sparkles while dragging
    const newSparkles = [];
    for (let i = 0; i < 3; i++) {
      sparkleIdRef.current += 1;
      newSparkles.push({
        id: sparkleIdRef.current,
        x: x * 100 + (Math.random() - 0.5) * 15,
        y: y * 100 + (Math.random() - 0.5) * 15,
        size: Math.random() * 6 + 3,
        delay: Math.random() * 0.1,
      });
    }
    
    setSparkles(prev => [...prev, ...newSparkles].slice(-50)); // Keep last 50 sparkles
  }, [isDragging, applyTheme]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Restore body scroll on mobile
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      // Clear sparkles after animation completes
      setTimeout(() => setSparkles([]), 800);
    }
  }, [isDragging]);

  // Add global mouse/touch event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      // Use passive: false to allow preventDefault() on touch events
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
      // Ensure body scroll is restored on cleanup
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle preset click
  const handlePresetClick = (anchor) => {
    setHandlePosition({ x: anchor.x, y: anchor.y });
    applyTheme(anchor.name);
  };

  // Handle cursor selection
  const handleCursorClick = (cursorId) => {
    setSelectedCursor(cursorId);
    localStorage.setItem('selectedCursor', cursorId);
    applyCursor(cursorId);
  };

  // Toggle panel
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // Get theme colors
  const themeColors = useMemo(() => {
    const THEME_COLORS = {
      'Peachy Orange': { navBg: '#FFFAF2', navPills: '#FFEED4' },
      'Lavender Dream': { navBg: '#FBF1F9', navPills: '#F8D2FC' },
      'Blush Petal': { navBg: '#F9DAED', navPills: '#FDF0F8' },
      'Sky': { navBg: '#BEE3FF', navPills: '#D8F1FF' },
      'Pastel Red': { navBg: '#FFDADF', navPills: '#FFF6F8' }
    };
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  // Update button background when theme changes
  useEffect(() => {
    setButtonBg(themeColors.navPills);
  }, [themeColors, theme]);

  // Cursor options
  const cursors = [
    { id: 'default', name: 'Default' },
    { id: 'cat', image: cursorCat, name: 'Cat' },
    { id: 'fox', image: cursorFox, name: 'Fox' },
    { id: 'creature', image: cursorCreature, name: 'Creature' },
    { id: 'dog', image: cursorDog, name: 'Dog' }
  ];

  return (
    <>
      {/* Glassmorphic Panel */}
      <div ref={panelRef} className={`color-picker-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="panel-content">
          {/* 2D Color Grid */}
          <div className="color-grid-section">
            <span className="section-label">Drag to change color</span>
            <div 
              className={`color-grid ${isDragging ? 'is-dragging' : ''}`}
              ref={gridRef}
              style={{
                '--handle-x': `${handlePosition.x * 100}%`,
                '--handle-y': `${handlePosition.y * 100}%`,
                '--current-color': currentColor,
                background: showGradient
                  ? `radial-gradient(circle at ${handlePosition.x * 100}% ${handlePosition.y * 100}%, ${currentColor}${gradientOpacity.toString(16).padStart(2, '0')} 0%, ${currentColor}${Math.round(gradientOpacity * 0.3).toString(16).padStart(2, '0')} 30%, transparent 55%), radial-gradient(circle, #e8e8e8 1px, transparent 1px)`
                  : `radial-gradient(circle, #e8e8e8 1px, transparent 1px)`,
                backgroundColor: '#f8f8f8',
                backgroundSize: showGradient ? '100% 100%, 12px 12px' : '12px 12px'
              }}
            >
              {/* Sparkle trail while dragging */}
              {sparkles.map((sparkle) => (
                <div
                  key={sparkle.id}
                  className="sparkle"
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                    width: sparkle.size,
                    height: sparkle.size,
                    backgroundColor: currentColor,
                    animationDelay: `${sparkle.delay}s`,
                  }}
                />
              ))}
              {/* Grid lines */}
              <div className="grid-lines">
                <div className="grid-line horizontal" style={{ top: '33.33%' }} />
                <div className="grid-line horizontal" style={{ top: '66.66%' }} />
                <div className="grid-line vertical" style={{ left: '33.33%' }} />
                <div className="grid-line vertical" style={{ left: '66.66%' }} />
              </div>
              
              {/* Anchor indicators */}
              {COLOR_ANCHORS.map((anchor, index) => (
                <div 
                  key={index}
                  className="anchor-dot"
                  style={{
                    left: `${anchor.x * 100}%`,
                    top: `${anchor.y * 100}%`,
                    backgroundColor: anchor.color
                  }}
                />
              ))}
              
              {/* Draggable handle */}
              <div
                className={`drag-handle ${isDragging ? 'dragging' : ''}`}
                style={{
                  left: `${handlePosition.x * 100}%`,
                  top: `${handlePosition.y * 100}%`,
                  backgroundColor: currentColor,
                  '--current-color': currentColor
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              >
                <div className="handle-inner" />
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div className="presets-section">
            <span className="section-label">Quick pick</span>
            <div className="preset-row">
              {COLOR_ANCHORS.map((anchor, index) => (
                <button
                  key={index}
                  className={`preset-btn ${theme?.name === anchor.name ? 'active' : ''}`}
                  style={{ backgroundColor: anchor.color }}
                  onClick={() => handlePresetClick(anchor)}
                  title={anchor.name}
                />
              ))}
            </div>
          </div>

          {/* Cursor Selection */}
          <div className="cursor-section">
            <span className="section-label">Choose your cursor</span>
            <div className="cursor-row">
              {cursors.map((cursor) => (
                <button
                  key={cursor.id}
                  className={`cursor-btn ${selectedCursor === cursor.id ? 'active' : ''}`}
                  onClick={() => handleCursorClick(cursor.id)}
                  title={cursor.name}
                >
                  {cursor.id === 'default' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35z" fill="currentColor"/>
                    </svg>
                  ) : (
                    <img src={cursor.image} alt={cursor.name} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        ref={fabRef}
        onClick={togglePanel}
        className={`customize-fab ${isPanelOpen ? 'active' : ''}`}
        style={{ backgroundColor: buttonBg }}
      >
        <img 
          src={magicStickIcon} 
          alt="Customize" 
          className="fab-icon"
        />
      </button>
    </>
  );
};

export default CustomizeButton;
