import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from '@phosphor-icons/react';
import Navbar from './Navbar';
import CustomizeButton from './CustomizeButton';
import ChatSidebar from './ChatSidebar';
import geminiIcon from '../assets/gemini 1.svg';
import heroImage from '../assets/Projectcase1.png';
import '../styles/ProjectPage.css';

const GeminiIcon = ({ size = 20, className }) => (
  <img 
    src={geminiIcon} 
    alt="Gemini" 
    style={{ width: '20px', height: '18px' }} 
    className={className}
  />
);

const SamsungPage = ({ theme, onThemeChange }) => {
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
          Shaping Scalable E-Commerce Experiences for Samsung.com's U.S. Audience
        </p>

        {/* Project Hero Image */}
        <div className="project-hero-image">
          <img src={heroImage} alt="Samsung Electronics America" />
        </div>

        {/* Overview Section */}
        <div className="project-overview">
          <div className="overview-column">
            <h3 className="overview-heading">Timeline</h3>
            <div className="overview-items">
              <p className="overview-text">May 2025 - Present</p>
            </div>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Team</h3>
            <div className="overview-items">
              <p className="overview-text">X-LOBs (Data + Design +</p>
              <p className="overview-text">Product + Business &amp;</p>
              <p className="overview-text">Engineering)</p>
            </div>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Tools</h3>
            <div className="overview-items">
              <p className="overview-text">Sketch</p>
              <p className="overview-text">Figma</p>
              <p className="overview-text">UserTesting.com</p>
              <p className="overview-text">Confluence</p>
              <p className="overview-text">Jira</p>
            </div>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Disciplines</h3>
            <div className="overview-items">
              <p className="overview-text">Product Design</p>
              <p className="overview-text">Research</p>
              <p className="overview-text">Strategy</p>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <section className="case-study-section">
          <h2 className="section-title">OVERVIEW</h2>
          <p className="section-description">
            On Samsung's U.S. digital storefront, I contribute to revenue-driving initiatives across B2B and B2C journeys. My work includes designing end-to-end purchase flows, promotional systems, and post-purchase experiences that influence millions of customers annually.
          </p>
        </section>

        {/* Confidential Wall */}
        <div className="confidential-wall">
          <div className="confidential-faded-content">
            <section className="case-study-section">
              <h2 className="section-title">PROBLEM</h2>
              <p className="section-description">
                Samsung's existing promotional frameworks lacked the flexibility to support dynamic, multi-tiered discount structures across product categories, resulting in inconsistent purchase experiences and missed revenue opportunities.
              </p>
            </section>
            <section className="case-study-section">
              <h2 className="section-title">RESEARCH</h2>
              <p className="section-description">
                Through competitive analysis and user research across Samsung's key product verticals, we identified critical gaps in the current promotional experience that were impacting conversion rates and customer satisfaction scores.
              </p>
            </section>
          </div>
          <div className="confidential-overlay">
            <div className="confidential-message">
              <h3 className="confidential-heading">
                <Lock size={24} weight="bold" />
                This project is confidential
              </h3>
              <p className="confidential-description">
                Please reach out to me directly to know more about my work.
              </p>
              <a
                href="https://www.linkedin.com/in/panthshah19/"
                target="_blank"
                rel="noopener noreferrer"
                className="confidential-cta"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
      <ChatSidebar isOpen={isChatOpen} onClose={handleChatClose} theme={theme} />
    </div>
  );
};

export default SamsungPage;
