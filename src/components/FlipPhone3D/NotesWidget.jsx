import { useState, useEffect } from 'react';

const NotesWidget = ({ onClick }) => {
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('portfolioNotes');
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      setRecentNotes(notes.slice(0, 2)); // Show only 2 most recent
    } else {
      // Demo notes for first visit
      setRecentNotes([
        { id: 1, text: 'Love the flip phone design! 🔥', name: 'Anonymous', timestamp: Date.now() - 3600000 }
      ]);
    }
  }, []);

  const truncateText = (text, maxLength = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #FFF9E6 0%, #FFEFBA 100%)',
        borderRadius: '16px',
        padding: '10px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        minHeight: '90px',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Paper texture overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, rgba(0,0,0,0.03) 19px, rgba(0,0,0,0.03) 20px)',
        pointerEvents: 'none',
        opacity: 0.5
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Recent notes preview */}
        {recentNotes.length > 0 ? (
          <>
            {recentNotes.map((note) => (
              <div key={note.id} style={{
                fontSize: '12px',
                color: '#4a4a4a',
                fontFamily: '"Kalam", "Comic Sans MS", cursive',
                lineHeight: '1.3',
                fontStyle: 'italic',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                "{truncateText(note.text, 28)}"
              </div>
            ))}
          </>
        ) : (
          <div style={{
            fontSize: '9px',
            color: '#999',
            fontFamily: 'Satoshi, -apple-system, sans-serif',
            textAlign: 'center',
            marginTop: '8px'
          }}>
            No notes yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '6px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#8B6914',
          fontFamily: 'Satoshi, -apple-system, sans-serif'
        }}>Notes</div>
        
        <div style={{
          fontSize: '16px'
        }}>✍️</div>
      </div>
    </div>
  );
};

export default NotesWidget;

