import { useState, useEffect } from 'react';
import { X, Check } from '@phosphor-icons/react';
import cursorCat from '../assets/custom cursor/cursor-cat.png';
import cursorFox from '../assets/custom cursor/cursor cat-1.png';
import cursorCreature from '../assets/custom cursor/cursor-demogorgon.png';
import cursorDog from '../assets/custom cursor/cursor-doggo.png';
import '../styles/ThemeCustomizerModal.css';

const ThemeCustomizerModal = ({ isOpen, onClose, currentTheme, onSave }) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [selectedCursor, setSelectedCursor] = useState('default');

  // Load saved cursor from localStorage
  useEffect(() => {
    const savedCursor = localStorage.getItem('selectedCursor') || 'default';
    setSelectedCursor(savedCursor);
  }, []);

  // Update selectedTheme when currentTheme changes
  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  const themes = [
    { name: 'Pastel Red', color: '#FF7084' },
    { name: 'Peachy Orange', color: '#FFB13D' },
    { name: 'Lavender Dream', color: '#B085C9' },
    { name: 'Sky', color: '#1A7FD6' },
    { name: 'Blush Petal', color: '#FB97D4' }
  ];

  const cursors = [
    { id: 'cat', image: cursorCat, name: 'Cat' },
    { id: 'fox', image: cursorFox, name: 'Fox' },
    { id: 'creature', image: cursorCreature, name: 'Creature' },
    { id: 'dog', image: cursorDog, name: 'Dog' }
  ];

  const handleSave = () => {
    // Save cursor to localStorage
    localStorage.setItem('selectedCursor', selectedCursor);
    
    // Call onSave with theme NAME and cursor (not the full theme object)
    onSave(selectedTheme?.name || selectedTheme, selectedCursor);
    
    // Close modal
    onClose();
  };

  const handleClose = () => {
    // Revert to current theme
    setSelectedTheme(currentTheme);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="customizer-overlay" onClick={handleClose}>
      <div className="customizer-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="customizer-close" onClick={handleClose}>
          <X size={20} weight="bold" />
        </button>

        {/* Content */}
        <div className="customizer-content">
          {/* Change Theme Section */}
          <section className="customizer-section theme-section">
            <h2 className="customizer-title">Change theme</h2>
            <div className="theme-grid">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  className={`theme-circle ${selectedTheme?.name === theme.name ? 'selected' : ''}`}
                  style={{ backgroundColor: theme.color }}
                  onClick={() => setSelectedTheme(theme)}
                  aria-label={theme.name}
                >
                  {selectedTheme?.name === theme.name && (
                    <Check size={10} weight="bold" color="#000000" className="checkmark-icon" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Choose Cursor Section */}
          <section className="customizer-section cursor-section">
            <h2 className="customizer-title">Choose your cursor</h2>
            <div className="cursor-grid">
              {cursors.map((cursor) => (
                <button
                  key={cursor.id}
                  className={`cursor-option ${selectedCursor === cursor.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCursor(cursor.id)}
                  aria-label={cursor.name}
                >
                  <img src={cursor.image} alt={cursor.name} className="cursor-icon" />
                </button>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <button className="customizer-save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizerModal;

