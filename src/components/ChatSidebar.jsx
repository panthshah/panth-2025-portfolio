import { useState, useRef, useEffect } from 'react';
import { X, ArrowClockwise, PaperPlaneTilt, CircleNotch } from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import chatbotImage from '../assets/Chatbot.png';
import './ChatSidebar.css';

export default function ChatSidebar({ isOpen, onClose, themeColors }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [topic, setTopic] = useState('home');
  
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sidebarRef = useRef(null);
  const chipRailRef = useRef(null);
  
  // Sidebar drag state
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState({ x: 0, y: 50 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Chip rail drag state
  const [isDraggingChips, setIsDraggingChips] = useState(false);
  const chipDrag = useRef({ startX: 0, scrollLeft: 0, moved: false });
  
  // Chip drag-to-input state
  const [draggingChipText, setDraggingChipText] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragOverInput, setIsDragOverInput] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  // Initialize sidebar position and suggestions
  useEffect(() => {
    if (isOpen) {
      // Position sidebar on the right side with 20px margin
      const sidebarWidth = 420;
      setSidebarPosition({ 
        x: window.innerWidth - sidebarWidth - 20, 
        y: 50 
      });
      setTimeout(() => inputRef.current?.focus(), 100);
      // Set initial suggestions
      setSuggestions(getSuggestionsForTopic('home'));
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Topic detection function
  function detectTopic(text) {
    const t = text.toLowerCase();
    if (/(founder\s?match|foundermatch|co[-\s]?founder)/i.test(t)) return 'foundermatch';
    if (t.includes('design system')) return 'design-system';
    if (t.includes('accessibility') || t.includes('wcag')) return 'accessibility';
    if (t.includes('student hub')) return 'student-hub';
    return 'home';
  }

  // Get suggestions based on topic
  function getSuggestionsForTopic(topicKey) {
    switch (topicKey) {
      case 'foundermatch':
        return [
          'Matching system design',
          'Research insights that informed it',
          'Launch metrics and outcomes',
          'What I would improve next'
        ];
      case 'design-system':
        return [
          'Component scope & tokens',
          'Accessibility work in the system',
          'Impact on dev speed & quality',
          'Show docs or examples'
        ];
      case 'accessibility':
        return [
          'Audit scope and tools used',
          'Key issues found and fixes',
          'WCAG areas improved',
          'Examples from the audits'
        ];
      case 'student-hub':
        return [
          'News & Events redesign',
          '"My Interests" feature details',
          'Research insights',
          'Results and learnings'
        ];
      default:
        return [
          'About Me',
          'Skills',
          'Experience',
          'Contact',
          'Resume'
        ];
    }
  }

  // Emphasize metrics in response
  const emphasizeMetrics = (inputText) => {
    let text = inputText || '';
    const wrapIfNotBold = (match, offset) => {
      const before = text.slice(Math.max(0, offset - 2), offset);
      const after = text.slice(offset + match.length, offset + match.length + 2);
      if (before === '**' || after === '**') return match;
      return `**${match}**`;
    };
    const withOffset = (regex) => (s) => s.replace(regex, (m, ...args) => {
      const idx = args[args.length - 2];
      return wrapIfNotBold(m, idx);
    });
    text = withOffset(/\b\d{1,3}(?:[\.,]\d+)?%\b/g)(text); // percentages
    text = withOffset(/\b(?:19|20)\d{2}\b/g)(text); // years
    text = withOffset(/\b\d[\d,]*\+\b/g)(text); // counts with plus
    text = withOffset(/\b\d+(?:[–-]\d+)?\s?(?:mins?|minutes?|hours?)\b/gi)(text); // durations
    text = withOffset(/\b\d{4,}\b/g)(text); // large numbers
    return text;
  };

  async function sendMessage() {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: history.slice(-4) // Send last 4 messages for context
        }),
      });

      const data = await res.json();
      const botReply = data.reply || 'Sorry, I couldn\'t generate a response.';
      const replyWithEmphasis = emphasizeMetrics(botReply);
      
      const newHistory = [...history, { user: userMessage, bot: replyWithEmphasis }];
      setHistory(newHistory);

      // Detect topic and update suggestions
      const detected = detectTopic(`${userMessage} ${replyWithEmphasis}`);
      setTopic(detected);
      setSuggestions(getSuggestionsForTopic(detected));
    } catch (error) {
      console.error('Error:', error);
      setHistory([...history, { 
        user: userMessage, 
        bot: 'Sorry, something went wrong. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestionClick(text) {
    setMessage(text);
    setTimeout(() => sendMessage(), 0);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setHistory([]);
    setMessage('');
    setSuggestions(getSuggestionsForTopic('home'));
    setTopic('home');
  };

  // Sidebar drag handlers
  const handleSidebarMouseDown = (e) => {
    if (!sidebarRef.current) return;
    
    const rect = sidebarRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDraggingSidebar(true);
  };

  const handleMouseMove = (e) => {
    if (isDraggingSidebar && sidebarRef.current) {
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;
      
      // Get current sidebar dimensions dynamically
      const rect = sidebarRef.current.getBoundingClientRect();
      const sidebarWidth = rect.width;
      const sidebarHeight = rect.height;
      
      // Keep within viewport
      newX = Math.max(20, Math.min(window.innerWidth - sidebarWidth - 20, newX));
      newY = Math.max(20, Math.min(window.innerHeight - sidebarHeight - 20, newY));
      
      setSidebarPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSidebar(false);
  };

  useEffect(() => {
    if (isDraggingSidebar) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingSidebar, dragOffset]);

  // Chip rail drag-to-scroll handlers
  const handleChipRailMouseDown = (e) => {
    if (!chipRailRef.current) return;
    const target = e.target;
    if (target.closest('button')) return;
    chipDrag.current = { 
      startX: e.clientX, 
      scrollLeft: chipRailRef.current.scrollLeft, 
      moved: false 
    };
    setIsDraggingChips(true);
  };

  useEffect(() => {
    if (!isDraggingChips) return;
    const onMove = (e) => {
      if (!chipRailRef.current) return;
      const dx = e.clientX - chipDrag.current.startX;
      if (Math.abs(dx) > 3) chipDrag.current.moved = true;
      chipRailRef.current.scrollLeft = chipDrag.current.scrollLeft - dx;
    };
    const onUp = () => setIsDraggingChips(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isDraggingChips]);

  // Chip drag-to-input helpers
  const isPointInInput = (clientX, clientY) => {
    const el = inputRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
  };

  const startChipDrag = (text, clientX, clientY) => {
    setDraggingChipText(text);
    setDragPosition({ x: clientX, y: clientY });
    setIsDragOverInput(isPointInInput(clientX, clientY));
    
    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      setDragPosition({ x, y });
      setIsDragOverInput(isPointInInput(x, y));
    };
    
    const onUp = (e) => {
      const dropInInput = isPointInInput(e.clientX, e.clientY);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      
      if (dropInInput && inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setIsSnapping(true);
        setDragPosition({ x: r.left + 28, y: r.top + r.height / 2 });
        setIsDragOverInput(true);
        setTimeout(() => {
          setIsSnapping(false);
          setDraggingChipText(null);
          setIsDragOverInput(false);
          setMessage(text);
          requestAnimationFrame(() => inputRef.current?.focus());
        }, 200);
      } else {
        setDraggingChipText(null);
        setIsDragOverInput(false);
      }
    };
    
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Draggable Sidebar */}
      <div 
        ref={sidebarRef}
        className="chat-sidebar chat-sidebar-draggable"
        style={{
          left: `${sidebarPosition.x}px`,
          top: `${sidebarPosition.y}px`,
        }}
      >
        {/* Draggable Header */}
        <div
          className={`chat-header ${isDraggingSidebar ? 'dragging' : ''}`}
          onMouseDown={handleSidebarMouseDown}
        >
          <div className="chat-header-left">
            <button
              onClick={handleReset}
              className="chat-icon-btn"
              aria-label="Reset chat"
              title="New conversation"
            >
              <ArrowClockwise size={20} weight="bold" />
            </button>
            <h2 className="chat-header-title">Panth's AI Agent</h2>
          </div>
          <button
            onClick={onClose}
            className="chat-icon-btn"
            aria-label="Close chat"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {history.length === 0 ? (
            <div className="chat-empty-state">
              <img src={chatbotImage} alt="Jarvis AI Agent" className="chat-bot-image" />
              <h3 className="chat-empty-title">Hi, I am Panth's AI agent,<br />how can i help you today?</h3>
            </div>
          ) : (
            <div className="chat-messages-list">
              {history.map((chat, i) => (
                <div key={i} className="chat-message-group">
                  {/* User message */}
                  <div className="chat-message-wrapper user">
                    <div 
                      className="chat-message user-message"
                      style={{ backgroundColor: themeColors?.navPills || '#FFEED4' }}
                    >
                      {chat.user}
                    </div>
                  </div>
                  
                  {/* Bot message */}
                  <div className="chat-message-wrapper bot">
                    <div className="chat-message bot-message">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="chat-markdown-p" {...props} />,
                          strong: ({ node, ...props }) => <strong className="chat-markdown-strong" {...props} />,
                          ul: ({ node, ...props }) => <ul className="chat-markdown-ul" {...props} />,
                          li: ({ node, ...props }) => <li className="chat-markdown-li" {...props} />,
                        }}
                      >
                        {chat.bot}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="chat-message-wrapper bot">
                  <div className="chat-message bot-message">
                    <div className="chat-loading">
                      <div className="chat-loading-dot"></div>
                      <div className="chat-loading-dot"></div>
                      <div className="chat-loading-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Pinned bottom input with chip rail */}
        <div className="chat-input-section">
          {/* Chip rail */}
          {suggestions.length > 0 && (
            <div
              ref={chipRailRef}
              onMouseDown={handleChipRailMouseDown}
              className={`chat-chip-rail ${isDraggingChips ? 'dragging' : ''}`}
            >
              <div className="chat-chip-rail-inner">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    onMouseDown={(e) => {
                      if (e.button !== 0) return;
                      let moved = false;
                      const onMove = (me) => {
                        if (!moved) {
                          moved = true;
                          startChipDrag(s, me.clientX, me.clientY);
                        }
                      };
                      const onUp = () => {
                        document.removeEventListener('mousemove', onMove);
                        document.removeEventListener('mouseup', onUp);
                      };
                      document.addEventListener('mousemove', onMove);
                      document.addEventListener('mouseup', onUp);
                    }}
                    className="chat-chip"
                    style={{ backgroundColor: themeColors?.navPills || '#FFEED4' }}
                    aria-label={`Ask: ${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="chat-input-container">
            <div className={`chat-input-wrapper ${isDragOverInput ? 'drag-over' : ''}`}>
              <input
                ref={inputRef}
                className="chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isLoading ? 'Thinking...' : 'Ask me anything about Panth'}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                className="chat-send-btn"
                style={{ backgroundColor: themeColors?.companyName || '#FFB13D' }}
                aria-label="Send message"
              >
                {isLoading ? (
                  <CircleNotch size={16} weight="bold" className="spin" />
                ) : (
                  <PaperPlaneTilt size={16} weight="fill" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating ghost chip for drag-to-input */}
      {draggingChipText && (
        <div
          className="chat-floating-chip"
          style={{
            left: dragPosition.x + 10,
            top: dragPosition.y + 10,
            transform: isSnapping ? 'scale(1.0)' : 'scale(0.96)',
            opacity: isSnapping ? 0 : 1
          }}
        >
          <div 
            className={`chat-chip ${isDragOverInput ? 'drag-over' : ''}`}
            style={{ backgroundColor: themeColors?.navPills || '#FFEED4' }}
          >
            {draggingChipText}
          </div>
        </div>
      )}
    </>
  );
}
