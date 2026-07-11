import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Copy, Heart, Smiley, Clock, Check, GridFour, Rows } from '@phosphor-icons/react';
import Navbar from './Navbar';
import FlipPhone3D from './FlipPhone3D';
import ChatSidebar from './ChatSidebar';
import CustomizeButton from './CustomizeButton';
import project1Image from '../assets/foundermatch-thumbnail.png';
import samsungVideo from '../assets/thumbnail1.mp4';
import project3Image from '../assets/northeastern-thumbnail.png';
import geminiIcon from '../assets/gemini 1.svg';
import zeenatAvatar from '../assets/Testimonial/Zeenat.jpeg';
import joshAvatar from '../assets/Testimonial/Josh.jpeg';
import saloniAvatar from '../assets/Testimonial/saloni.jpeg';
import shefaliAvatar from '../assets/Testimonial/shefali.jpeg';
import kyleAvatar from '../assets/Testimonial/kyle.jpeg';
import pradeepAvatar from '../assets/Testimonial/pradeep.jpeg';
import cursorCat from '../assets/custom cursor/cursor-cat.png';
import cursorFox from '../assets/custom cursor/cursor cat-1.png';
import cursorCreature from '../assets/custom cursor/cursor-demogorgon.png';
import cursorDog from '../assets/custom cursor/cursor-doggo.png';
import linkedInIcon from '../assets/LinkedIn1.png';
import githubIcon from '../assets/github.png';
import xIcon from '../assets/X.png';
import '../styles/LandingPage.css';

// Custom Gemini Icon Component
const GeminiIcon = ({ size = 20, className }) => (
  <img 
    src={geminiIcon} 
    alt="Gemini" 
    style={{ width: '20px', height: '18px' }} 
    className={className}
  />
);

const THEME_COLORS = {
  'Peachy Orange': {
    navBg: '#FFFAF2',
    navPills: '#FFEED4',
    companyName: '#FFB13D',
    aboutMeStroke: '#FFB13D'
  },
  'Lavender Dream': {
    navBg: '#FBF1F9',
    navPills: '#F8D2FC',
    companyName: '#865D95',
    aboutMeStroke: '#865D95'
  },
  'Blush Petal': {
    navBg: '#F9DAED',
    navPills: '#FDF0F8',
    companyName: '#FB97D4',
    aboutMeStroke: '#FB97D4'
  },
  'Sky': {
    navBg: '#BEE3FF',
    navPills: '#D8F1FF',
    companyName: '#1A7FD6',
    aboutMeStroke: '#1A7FD6'
  },
  'Pastel Red': {
    navBg: '#FFDADF',
    navPills: '#FFF6F8',
    companyName: '#FF7084',
    aboutMeStroke: '#FF7084'
  }
};

const projects = [
  {
    route: '/samsung',
    media: samsungVideo,
    mediaType: 'video',
    alt: 'Samsung Product Finder compare experience',
    title: 'Smarter Product Comparisons',
    tag: '2025 · Samsung Electronics',
    description: "Redesigning the compare experience for Samsung.com's Product Finder"
  },
  {
    route: '/foundermatch',
    media: project1Image,
    mediaType: 'image',
    alt: 'FounderMatch',
    title: 'Better Co-founder Matching',
    tag: '2024-25 · Founderway',
    description: 'A co-founder matching platform that drove 200+ sign-ups on launch day'
  },
  {
    route: '/northeastern',
    media: project3Image,
    mediaType: 'image',
    alt: 'Accessibility at Northeastern',
    title: 'Designing for Access',
    tag: '2023-24 · Northeastern University',
    description: 'Auditing accessibility across 10+ university websites for 30,000+ students'
  }
];

const ProjectMedia = ({ project }) => project.mediaType === 'video' ? (
  <video src={project.media} autoPlay loop muted playsInline />
) : (
  <img src={project.media} alt={project.alt} />
);

const MotionArticle = motion.article;
const MotionDiv = motion.div;

const FocusProjectCard = ({ project, index, isLast, isBehind, onSelect }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`focus-project-item${isLast ? ' is-last' : ''}`}>
      <MotionArticle
        className="focus-project-card"
        animate={reduceMotion ? undefined : {
          scale: isBehind ? Math.max(0.94, 0.975 - (index * 0.01)) : 1,
          y: isBehind ? index * -6 : 0
        }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect();
          }
        }}
        role="link"
        tabIndex={0}
      >
        <div className="focus-project-content">
          <h3 className="focus-project-title">{project.title}</h3>
          <p className="focus-project-summary">{project.description}</p>
          <span className="focus-project-meta">{project.tag}</span>
          <span className="focus-project-link">Read case study</span>
        </div>
        <div className="focus-project-image">
          <ProjectMedia project={project} />
        </div>
      </MotionArticle>
    </div>
  );
};

const LandingPage = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('chat');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [projectsView, setProjectsView] = useState('focus');
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);

  const themeColors = useMemo(() => {
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

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

  useEffect(() => {
    if (projectsView !== 'focus') return undefined;

    let frame;
    const updateActiveCard = () => {
      frame = undefined;
      const cards = Array.from(document.querySelectorAll('.focus-project-item'));
      const stackTop = window.innerWidth <= 1024 ? 72 : 88;
      const activationLine = stackTop + 170;
      let nextIndex = 0;

      cards.forEach((card, index) => {
        if (card.getBoundingClientRect().top <= activationLine) nextIndex = index;
      });

      setActiveFocusIndex((current) => current === nextIndex ? current : nextIndex);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveCard);
    };

    updateActiveCard();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [projectsView]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('panthshahdesigns@gmail.com');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <Navbar 
        theme={theme}
        currentPage="landing"
        activeTab={activeTab}
        onTabClick={handleTabClick}
        onChatOpen={() => setIsChatOpen(true)}
        onLogoClick={() => {}}
        GeminiIcon={GeminiIcon}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left Side - Content */}
          <div className="hero-content">
            <h1 className="hero-headline"> 
              Meet Panth, a data driven designer shaping experiences for B2B and B2C Enterprises
            </h1>
            
            <p className="hero-description">
            I design thoughtful, scalable product experiences at{' '}
            <span className="link-preview-wrapper">
              <a 
                href="https://www.samsung.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="link-preview-link"
                onMouseEnter={(e) => {
                  const preview = e.currentTarget.nextElementSibling;
                  if (preview) preview.style.display = 'block';
                }}
                onMouseLeave={(e) => {
                  const preview = e.currentTarget.nextElementSibling;
                  if (preview) preview.style.display = 'none';
                }}
              >
                Samsung Electronics America
              </a>
              <div className="link-preview-box">
                <iframe 
                  src="https://www.samsung.com" 
                  title="Samsung Preview"
                  className="link-preview-iframe"
                />
              </div>
            </span>
            {' '}across Digital Appliances and Visual Displays 
            </p>
            
            <p className="hero-current">
              Previously at Founderway and Northeastern University
            </p>
            
            <div className="hero-buttons">
              <a 
                href="https://www.linkedin.com/in/panthshah19/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                  border: `1.5px solid ${themeColors.aboutMeStroke}`,
                  color: '#000000',
                  borderRadius: '24px',
                  padding: '0 20px',
                  height: '40px'
                }}
              >
                LinkedIn
                <ArrowUpRight size={14} weight="bold" />
              </a>
              <a 
                href="https://x.com/panthshah_"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                  border: `1.5px solid ${themeColors.aboutMeStroke}`,
                  color: '#000000',
                  borderRadius: '24px',
                  padding: '0 20px',
                  height: '40px'
                }}
              >
                Twitter
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </div>

          {/* Right Side - 3D Phone */}
          <div className="hero-visual">
            <FlipPhone3D />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="projects-view-controls" role="group" aria-label="Case study view">
          <button
            className={`projects-view-button${projectsView === 'focus' ? ' is-active' : ''}`}
            type="button"
            aria-label="Focus view"
            aria-pressed={projectsView === 'focus'}
            onClick={() => setProjectsView('focus')}
          >
            <Rows size={17} weight={projectsView === 'focus' ? 'fill' : 'regular'} />
          </button>
          <button
            className={`projects-view-button${projectsView === 'grid' ? ' is-active' : ''}`}
            type="button"
            aria-label="Grid view"
            aria-pressed={projectsView === 'grid'}
            onClick={() => setProjectsView('grid')}
          >
            <GridFour size={17} weight={projectsView === 'grid' ? 'fill' : 'regular'} />
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {projectsView === 'grid' ? (
            <MotionDiv
              className="projects-grid"
              key="grid"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {projects.map((project) => (
                <div className="project-card" key={project.route} onClick={() => navigate(project.route)}>
                  <div className="project-image"><ProjectMedia project={project} /></div>
                  <div className="project-content">
                    <span className="project-tag">{project.tag}</span>
                    <p className="project-description">{project.description}</p>
                  </div>
                </div>
              ))}
            </MotionDiv>
          ) : (
            <MotionDiv
              className="projects-focus"
              key="focus"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {projects.map((project, index) => (
                <FocusProjectCard
                  key={project.route}
                  project={project}
                  index={index}
                  isLast={index === projects.length - 1}
                  isBehind={index < activeFocusIndex}
                  onSelect={() => navigate(project.route)}
                />
              ))}
              <div className="focus-project-spacer" aria-hidden="true" />
            </MotionDiv>
          )}
        </AnimatePresence>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">Testimonials</h2>
          
          <div className="testimonials-grid">
            {/* Testimonial Card 1 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={zeenatAvatar} alt="Zeenat Vastrad" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Zeenat Vastrad</h3>
                  <p className="testimonial-position">Head of Product Design at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
              Panth blended seamlessly with the team from day one, exactly as expected. He works really well with others, listens carefully, and genuinely applies feedback to improve his work. He consistently goes above and beyond with whatever he does
              </p>
            </div>

            {/* Testimonial Card 2 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={joshAvatar} alt="Josh Turner" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Josh Turner</h3>
                  <p className="testimonial-position">Senior Product Designer at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
              I’ve really enjoyed working with Panth. His technical background makes collaboration smoother, and he’s great at thinking through problems with both design and engineering in mind
              </p>
            </div>

            {/* Testimonial Card 3 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={saloniAvatar} alt="Saloni Gosalia" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Saloni Gosalia</h3>
                  <p className="testimonial-position">Senior Designer at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
              Panth runs our weekly AI meetings and workshops and does a great job guiding the team through new tools and ideas. He makes it easy for everyone to stay current and actually use what we learn.
              </p>
            </div>

            {/* Testimonial Card 4 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={shefaliAvatar} alt="Shefali Kotnala" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Shefali Kotnala</h3>
                  <p className="testimonial-position">Senior Product Manager at SEA</p>
                </div>
              </div>
              <p className="testimonial-content">
              Working with Panth on Digital Appliances has been great. He’s thoughtful about keeping design aligned with product goals, business needs, and data insights, which makes collaboration smoother and more effective.
              </p>
            </div>

            {/* Testimonial Card 5 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={kyleAvatar} alt="Kyle Reguero" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Kyle Reguero</h3>
                  <p className="testimonial-position">Lead Product Designer at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
              Panth brings great energy and enthusiasm to everything he works on. His positive attitude is contagious and makes collaboration genuinely enjoyable
              </p>
            </div>

            {/* Testimonial Card 6 */}
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src={pradeepAvatar} alt="Pradeep Panwar" />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">Pradeep Panwar</h3>
                  <p className="testimonial-position">Director of Engineering at Samsung</p>
                </div>
              </div>
              <p className="testimonial-content">
              Panth’s engineering background really helps during design handoff, making it easier for the team to turn designs into working builds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-container">
          {/* Floating Animation Elements */}
          <div className="floating-elements">
            {/* LEFT SIDE EMOJIS - 5 emojis on left of "all done!" */}
            {[...Array(5)].map((_, i) => {
              const isSmiley = Math.random() > 0.5;
              const delay = i * 0.3;
              const leftPosition = 5 + Math.random() * 30; // 5-35%
              
              return (
                <div
                  key={`left-${i}`}
                  className="floating-emoji"
                  style={{
                    left: `${leftPosition}%`,
                    animationDelay: `${delay}s`,
                    color: themeColors.companyName
                  }}
                >
                  {isSmiley ? (
                    <Smiley size={55 + Math.random() * 20} weight="regular" />
                  ) : (
                    <Heart size={22 + Math.random() * 12} weight="fill" />
                  )}
                </div>
              );
            })}
            
            {/* CENTER HEARTS - 3 small hearts in middle */}
            {[...Array(3)].map((_, i) => {
              const delay = (i + 2) * 0.3;
              const leftPosition = 45 + Math.random() * 10; // 45-55%
              
              return (
                <div
                  key={`center-${i}`}
                  className="floating-emoji"
                  style={{
                    left: `${leftPosition}%`,
                    animationDelay: `${delay}s`,
                    color: themeColors.companyName
                  }}
                >
                  <Heart size={18 + Math.random() * 8} weight="fill" />
                </div>
              );
            })}
            
            {/* RIGHT SIDE EMOJIS - 5 emojis on right of "all done!" */}
            {[...Array(5)].map((_, i) => {
              const isSmiley = Math.random() > 0.5;
              const delay = (i + 3) * 0.3;
              const leftPosition = 65 + Math.random() * 30; // 65-95%
              
              return (
                <div
                  key={`right-${i}`}
                  className="floating-emoji"
                  style={{
                    left: `${leftPosition}%`,
                    animationDelay: `${delay}s`,
                    color: themeColors.companyName
                  }}
                >
                  {isSmiley ? (
                    <Smiley size={55 + Math.random() * 20} weight="regular" />
                  ) : (
                    <Heart size={22 + Math.random() * 12} weight="fill" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Content */}
          <div className="footer-content">
            <h2 className="footer-title">Thank you for visiting!</h2>
            <p className="footer-subtitle">
              Created with MagicPath + Figma + Paper + Cursor.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
              <a href="https://www.linkedin.com/in/panthshah19/" target="_blank" rel="noopener noreferrer">
                <img src={linkedInIcon} alt="LinkedIn" style={{ width: '42px', height: '42px', cursor: 'pointer' }} />
              </a>
              <a href="https://github.com/panthshah" target="_blank" rel="noopener noreferrer">
                <img src={githubIcon} alt="GitHub" style={{ width: '54px', height: '42px', cursor: 'pointer' }} />
              </a>
              <a href="https://x.com/panthshah_" target="_blank" rel="noopener noreferrer">
                <img src={xIcon} alt="X" style={{ width: '42px', height: '42px', cursor: 'pointer' }} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Sidebar */}
      <ChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        themeColors={themeColors}
      />

      {/* Reusable Customize Button Component */}
      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
    </div>
  );
};

export default LandingPage;
