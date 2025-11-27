import { useState } from 'react';
import { CaretLeft, Check } from '@phosphor-icons/react';
import phoneBackground from '../../assets/phonebackground.png';
import dayViewBg from '../../assets/Day View.png';
import wallpaper1 from '../../assets/phonewallpaper1.png';
import wallpaper2 from '../../assets/phonewallpaper2.png';
import wallpaper3 from '../../assets/phonewallpaper3.png';
import wallpaper4 from '../../assets/phonewallpaper4.png';
import wallpaper5 from '../../assets/phonewallpaper5.png';

const WallpaperApp = ({ onClose, currentBackground, onSave }) => {
  const [selectedBg, setSelectedBg] = useState(currentBackground);

  const wallpapers = [
    { id: 'default', src: phoneBackground, name: 'Default' },
    { id: 'day', src: dayViewBg, name: 'Day View' },
    { id: 'wp1', src: wallpaper1, name: 'Abstract 1' },
    { id: 'wp2', src: wallpaper2, name: 'Abstract 2' },
    { id: 'wp3', src: wallpaper3, name: 'Abstract 3' },
    { id: 'wp4', src: wallpaper4, name: 'Abstract 4' },
    { id: 'wp5', src: wallpaper5, name: 'Abstract 5' }
  ];

  const handleSave = () => {
    onSave(selectedBg);
    onClose();
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#000',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <CaretLeft size={24} weight="bold" />
        </button>
        <span style={{
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: '"Samsung Sharp Sans", sans-serif'
        }}>Wallpapers</span>
        <button
          onClick={handleSave}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#00D4AA',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            opacity: 1 // Always active as requested
          }}
        >
          <span style={{ fontWeight: '600', fontSize: '14px' }}>Done</span>
        </button>
      </div>

      {/* Preview Area - Increased Height */}
      <div style={{
        flex: 2, // Increased flex to take up more space
        position: 'relative',
        margin: '20px',
        marginBottom: '10px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.2)'
      }}>
        <img 
          src={selectedBg} 
          alt="Preview" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Mock UI overlay centered */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '4px'
          }}>
            12:00 <span style={{ fontSize: '32px', fontWeight: '700' }}>PM</span>
          </div>
          <div style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '14px',
            fontWeight: '700',
            opacity: 0.9
          }}>
            Tue, Nov 27
          </div>
        </div>
      </div>

      {/* Wallpaper Grid - Horizontal Scroll */}
      <div style={{
        padding: '16px',
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px 20px 0 0',
        minHeight: '100px',
        alignItems: 'center',
        scrollbarWidth: 'none', // Hide scrollbar for cleaner look
        msOverflowStyle: 'none'
      }}>
        {wallpapers.map((wp) => (
          <div
            key={wp.id}
            onClick={() => setSelectedBg(wp.src)}
            style={{
              position: 'relative',
              minWidth: '100px', // Fixed width for scrolling items
              height: '80px',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: selectedBg === wp.src ? '2px solid #00D4AA' : '2px solid transparent',
              transition: 'all 0.2s',
              flexShrink: 0 // Prevent shrinking
            }}
          >
            <img 
              src={wp.src} 
              alt={wp.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {selectedBg === wp.src && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Check size={24} weight="bold" color="#fff" />
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '4px 8px',
              background: 'rgba(0,0,0,0.6)',
              fontSize: '10px',
              color: '#fff',
              textAlign: 'center',
              backdropFilter: 'blur(2px)'
            }}>
              {wp.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallpaperApp;