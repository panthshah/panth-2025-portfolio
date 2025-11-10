import { useState, useEffect } from 'react';
import { X, PencilSimple, Notepad } from '@phosphor-icons/react';

const NotesApp = ({ onClose, onNoteSaved }) => {
  const [activeTab, setActiveTab] = useState('write');
  const [noteText, setNoteText] = useState('');
  const [noteName, setNoteName] = useState('');
  const [allNotes, setAllNotes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const MAX_CHARS = 100;

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const savedNotes = localStorage.getItem('portfolioNotes');
    if (savedNotes) {
      setAllNotes(JSON.parse(savedNotes));
    } else {
      // Demo notes for first visit
      const demoNotes = [
        { id: 1, text: 'Love the flip phone design! 🔥', name: 'Anonymous', timestamp: Date.now() - 3600000 }
      ];
      setAllNotes(demoNotes);
      localStorage.setItem('portfolioNotes', JSON.stringify(demoNotes));
    }
  };

  const handleSaveNote = () => {
    if (noteText.trim().length === 0) return;

    const newNote = {
      id: Date.now(),
      text: noteText.trim(),
      name: noteName.trim() || 'Anonymous',
      timestamp: Date.now()
    };

    const updatedNotes = [newNote, ...allNotes];
    setAllNotes(updatedNotes);
    localStorage.setItem('portfolioNotes', JSON.stringify(updatedNotes));

    // Clear form
    setNoteText('');
    setNoteName('');

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Notify parent to refresh widget
    if (onNoteSaved) onNoteSaved();

    // Switch to all notes tab
    setTimeout(() => setActiveTab('all'), 2000);
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      <style>{`
        .notes-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .notes-scroll-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
      `}</style>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #FFF9E6 0%, #FFEFBA 100%)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '80px'
      }}
      className="notes-scroll-container"
      >
        {/* Paper texture overlay */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, rgba(0,0,0,0.03) 19px, rgba(0,0,0,0.03) 20px)',
          pointerEvents: 'none',
          opacity: 0.4,
          zIndex: 0
        }} />

        {/* Header */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{
            color: '#8B6914',
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'Satoshi, -apple-system, sans-serif',
            margin: 0
          }}>Notes</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(139, 105, 20, 0.15)',
              border: '1px solid rgba(139, 105, 20, 0.3)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} color="#8B6914" weight="bold" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <button
            onClick={() => setActiveTab('write')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: activeTab === 'write' ? '2px solid #8B6914' : '1px solid rgba(139, 105, 20, 0.3)',
              background: activeTab === 'write' ? 'rgba(139, 105, 20, 0.1)' : 'transparent',
              color: '#8B6914',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'Satoshi, -apple-system, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <PencilSimple size={16} weight="bold" />
            Leave a Note
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: activeTab === 'all' ? '2px solid #8B6914' : '1px solid rgba(139, 105, 20, 0.3)',
              background: activeTab === 'all' ? 'rgba(139, 105, 20, 0.1)' : 'transparent',
              color: '#8B6914',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'Satoshi, -apple-system, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Notepad size={16} weight="bold" />
            All Notes ({allNotes.length})
          </button>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          {activeTab === 'write' ? (
            /* Write Note Tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Name input */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#8B6914',
                  marginBottom: '6px',
                  fontFamily: 'Satoshi, -apple-system, sans-serif'
                }}>Your name (optional):</label>
                <input
                  type="text"
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                  placeholder="Anonymous"
                  maxLength={30}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 105, 20, 0.3)',
                    background: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    fontFamily: 'Satoshi, -apple-system, sans-serif',
                    color: '#4a4a4a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Note textarea */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#8B6914',
                    fontFamily: 'Satoshi, -apple-system, sans-serif'
                  }}>Your note:</label>
                  <span style={{
                    fontSize: '11px',
                    color: noteText.length >= MAX_CHARS ? '#ff5252' : '#8B6914',
                    fontFamily: 'Satoshi, -apple-system, sans-serif'
                  }}>{noteText.length}/{MAX_CHARS}</span>
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) {
                      setNoteText(e.target.value);
                    }
                  }}
                  placeholder="Leave a message... ✨"
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 105, 20, 0.3)',
                    background: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    fontFamily: '"Kalam", "Comic Sans MS", cursive',
                    color: '#4a4a4a',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: '1.6',
                    boxSizing: 'border-box',
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, rgba(139, 105, 20, 0.1) 19px, rgba(139, 105, 20, 0.1) 20px)'
                  }}
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSaveNote}
                disabled={noteText.trim().length === 0}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: noteText.trim().length === 0 ? '#ccc' : '#8B6914',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Satoshi, -apple-system, sans-serif',
                  cursor: noteText.trim().length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: noteText.trim().length === 0 ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (noteText.trim().length > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 105, 20, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📝 Save Note
              </button>

              {/* Success message */}
              {showSuccess && (
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(76, 175, 80, 0.2)',
                  border: '1px solid rgba(76, 175, 80, 0.4)',
                  color: '#2e7d32',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center',
                  fontFamily: 'Satoshi, -apple-system, sans-serif'
                }}>
                  ✨ Note saved! Thank you!
                </div>
              )}
            </div>
          ) : (
            /* All Notes Tab */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {allNotes.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999',
                  fontSize: '14px',
                  fontFamily: 'Satoshi, -apple-system, sans-serif'
                }}>
                  No notes yet. Be the first! ✨
                </div>
              ) : (
                allNotes.map((note) => (
                  <div key={note.id} style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(139, 105, 20, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#4a4a4a',
                      fontFamily: '"Kalam", "Comic Sans MS", cursive',
                      lineHeight: '1.6',
                      marginBottom: '8px',
                      fontStyle: 'italic'
                    }}>
                      "{note.text}"
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#8B6914',
                      fontFamily: 'Satoshi, -apple-system, sans-serif',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>- {note.name}</span>
                      <span style={{ color: '#ccc' }}>•</span>
                      <span>{getTimeAgo(note.timestamp)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotesApp;

