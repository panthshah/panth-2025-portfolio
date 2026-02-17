import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import Navbar from './Navbar';
import CustomizeButton from './CustomizeButton';
import ChatSidebar from './ChatSidebar';
import geminiIcon from '../assets/gemini 1.svg';
import heroImage from '../assets/Northeastern.png';
import '../styles/ProjectPage.css';

const GeminiIcon = ({ size = 20, className }) => (
  <img 
    src={geminiIcon} 
    alt="Gemini" 
    style={{ width: '20px', height: '18px' }} 
    className={className}
  />
);

const NortheasternPage = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('playground');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'playground') {
      navigate('/home');
    }
  };

  return (
    <div className="project-page">
      <Navbar
        theme={theme}
        currentPage="project"
        activeTab={activeTab}
        onTabClick={handleTabClick}
        onChatOpen={handleChatOpen}
        onLogoClick={() => navigate('/home')}
        GeminiIcon={GeminiIcon}
      />

      <div className="project-page-content">
        {/* Project Introduction */}
        <p className="project-intro">
          Accessibility audits across the Northeastern websites
        </p>

        {/* Project Hero Image */}
        <div className="project-hero-image" style={{ maxHeight: '400px' }}>
          <img src={heroImage} alt="Accessibility at Northeastern" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
        </div>

        {/* Overview Grid */}
        <div className="project-overview">
          <div className="overview-column">
            <h3 className="overview-heading">Timeline</h3>
            <div className="overview-items">
              <p className="overview-text">Sep 2024 - Dec 2024</p>
            </div>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Team</h3>
            <div className="overview-items">
              <p className="overview-text">4 Designers</p>
              <p className="overview-text">Digital Accessibility Team</p>
            </div>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Tools</h3>
            <div className="overview-items">
              <p className="overview-text">WAVE</p>
              <p className="overview-text">ARIA Patterns</p>
              <p className="overview-text">Bookmarklets</p>
            </div>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Disciplines</h3>
            <div className="overview-items">
              <p className="overview-text">Accessibility</p>
              <p className="overview-text">WCAG 2.1</p>
              <p className="overview-text">UX Auditing</p>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <section className="case-study-section">
          <h2 className="section-title">OVERVIEW</h2>
          <p className="section-description">
            We conducted accessibility tests based on the WCAG 2.1 guidelines and a checklist provided by the digital accessibility team at Northeastern University. This case study highlights the key findings and lessons learned from testing seven Northeastern University websites using various accessibility tools.
          </p>
          <div style={{ marginTop: '24px' }}>
            <a
              href="https://docs.google.com/document/d/your-report-link"
              target="_blank"
              rel="noopener noreferrer"
              className="confidential-cta"
            >
              View Full Report
              <ArrowUpRight size={16} weight="bold" style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
            </a>
          </div>
        </section>

        {/* Accessibility Stack */}
        <section className="case-study-section">
          <h2 className="section-title">ACCESSIBILITY STACK</h2>
          <p className="section-description">
            We audited key accessibility areas across seven university websites, focusing on critical, serious, and cumulative issues.
          </p>
          <div className="insights-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '32px' }}>
            <div className="insight-card">
              <p className="insight-text"><strong>Keyboard Navigation</strong></p>
              <p className="insight-text">Ensured all focusable elements were accessible with visible focus indicators.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>Responsive Design</strong></p>
              <p className="insight-text">Checked that content is usable across different screen sizes and zoom levels.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>Headings & Page Titles</strong></p>
              <p className="insight-text">Ensured headings follow a logical order, and each page has a unique, descriptive title.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>Landmarks & Link Text</strong></p>
              <p className="insight-text">Reviewed the use of semantic landmarks and ensured link text clearly describes its purpose.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>Assistive Technology</strong></p>
              <p className="insight-text">Verified that interactive components have accessible names for screen readers.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>Image & SVG Alternatives</strong></p>
              <p className="insight-text">Ensured meaningful images have alt text and decorative ones are properly marked.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>Redundant Links</strong></p>
              <p className="insight-text">Removed redundant links and ensured assistive tech ignores decorative icons.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>Patterns & Components</strong></p>
              <p className="insight-text">Reviewed accessibility of menus, modals, accordions, carousels, and widgets.</p>
            </div>
          </div>
        </section>

        {/* Tools & Methods */}
        <section className="case-study-section">
          <h2 className="section-title">TOOLS & METHODS</h2>
          <div className="insights-grid" style={{ marginTop: '24px' }}>
            <div className="insight-card">
              <p className="insight-text"><strong>WAVE Evaluation Tool</strong></p>
              <p className="insight-text">Checked for accessibility errors like missing labels and improper color contrast.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>Landmark Role Guide</strong></p>
              <p className="insight-text">Verified the correct use of ARIA landmarks for easier navigation.</p>
            </div>
            <div className="insight-card">
              <p className="insight-text"><strong>ARIA Tab Patterns</strong></p>
              <p className="insight-text">Reviewed tab components for proper accessibility behaviors.</p>
            </div>
          </div>
        </section>

        {/* Key Learnings */}
        <section className="case-study-section">
          <h2 className="section-title">KEY LEARNINGS</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-number">1</div>
              <p className="insight-text"><strong>Keyboard Navigation is Critical</strong></p>
              <p className="insight-text">We learned how important it is to ensure all interactive elements can be accessed and operated using just a keyboard. Many components missed this, impacting accessibility.</p>
            </div>
            <div className="insight-card">
              <div className="insight-number">2</div>
              <p className="insight-text"><strong>Clear and Descriptive Alt Text</strong></p>
              <p className="insight-text">Adding meaningful alt text for images is essential for users relying on screen readers. Missing or vague descriptions limit access to important content.</p>
            </div>
            <div className="insight-card">
              <div className="insight-number">3</div>
              <p className="insight-text"><strong>Testing with Tools Helped Identify Hidden Issues</strong></p>
              <p className="insight-text">Accessibility tools revealed issues we might have missed manually, such as improper labelings or missing focus indicators.</p>
            </div>
          </div>
        </section>
      </div>

      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
      <ChatSidebar isOpen={isChatOpen} onClose={handleChatClose} theme={theme} />
    </div>
  );
};

export default NortheasternPage;
