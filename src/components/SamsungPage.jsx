import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from '@phosphor-icons/react';
import Navbar from './Navbar';
import CustomizeButton from './CustomizeButton';
import ChatSidebar from './ChatSidebar';
import geminiIcon from '../assets/gemini 1.svg';
import heroImage from '../assets/Projectcase1.png';
import auditCompare from '../assets/audit-compare-models.png';
import auditSpecs from '../assets/audit-spec-table.png';
import auditVideo from '../assets/audit-video.mp4';
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

  const [activeSection, setActiveSection] = useState('overview');

  const handleChatOpen = () => setIsChatOpen(true);
  const handleChatClose = () => setIsChatOpen(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'playground') {
      navigate('/home');
    }
  };

  const sidebarSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'The Problem' },
    { id: 'research', label: 'How We Found It' },
    { id: 'competitive', label: 'Competitive Research' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sidebarSections.map(s => {
        const el = document.getElementById(s.id);
        if (!el) return { id: s.id, top: Infinity };
        return { id: s.id, top: el.getBoundingClientRect().top };
      });
      const active = offsets.reduce((closest, curr) =>
        curr.top <= 200 && curr.top > closest.top ? curr : closest,
        { id: offsets[0].id, top: -Infinity }
      );
      setActiveSection(active.id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      <div className="project-page-content case-study-layout">
        {/* Sticky Sidebar Navigation */}
        <aside className="case-study-sidebar">
          <nav className="case-study-sidebar-nav">
            {sidebarSections.map(s => (
              <button
                key={s.id}
                className={`case-study-sidebar-link ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="case-study-body">
          {/* Overview — title, hero, metadata, description */}
          <section id="overview" className="case-study-section case-study-section-first">
            <h1 className="case-study-title">
              Making Product Comparison Actually Work on Samsung.com
            </h1>

            <div className="project-hero-image">
              <img src={heroImage} alt="Samsung Product Finder — Compare Experience" />
            </div>

            <div className="project-overview">
              <div className="overview-column">
                <h3 className="overview-heading">Timeline</h3>
                <div className="overview-items">
                  <p className="overview-text">May 2025 – Present</p>
                </div>
              </div>
              <div className="overview-column">
                <h3 className="overview-heading">My Role</h3>
                <div className="overview-items">
                  <p className="overview-text">UX Designer</p>
                  <p className="overview-text">Product Design</p>
                  <p className="overview-text">Research &amp; Strategy</p>
                </div>
              </div>
              <div className="overview-column">
                <h3 className="overview-heading">Team</h3>
                <div className="overview-items">
                  <p className="overview-text">Cross-LOB: Design, Product, Data, Engineering &amp; Business</p>
                </div>
              </div>
              <div className="overview-column">
                <h3 className="overview-heading">Tools</h3>
                <div className="overview-items">
                  <p className="overview-text">Figma &amp; Sketch</p>
                  <p className="overview-text">UserTesting.com</p>
                  <p className="overview-text">Confluence &amp; Jira</p>
                </div>
              </div>
            </div>

            <h2 className="section-title">OVERVIEW</h2>
            <p className="section-description">
              Samsung.com's Product Finder lets millions of U.S. shoppers filter and compare products side by side. I led a research-driven redesign of the compare experience, working across product, data, and engineering.
            </p>
          </section>

          {/* Problem */}
          <section id="problem" className="case-study-section">
            <h2 className="section-title">THE PROBLEM</h2>
            <p className="section-description">
              Users on Samsung's Product Finder couldn't meaningfully compare products. The compare experience was visually overwhelming, spec data was incomplete, and most users gave up before finding the information they needed.
            </p>
          </section>

          {/* How We Found the Problem */}
          <section id="research" className="case-study-section">
            <h2 className="section-title">HOW WE FOUND THE PROBLEM</h2>
          <h3 className="subsection-heading">Two sources pointed to the same broken experience</h3>
          <p className="section-description">
            We didn't start with assumptions. The problem surfaced through real user feedback and a hands-on audit of the existing experience, and both told the same story.
          </p>

          {/* Part 1: NPS Feedback */}
          <div className="research-part">
            <p className="research-part-label">01 &mdash; NPS Feedback</p>
            <p className="research-part-description">
              NPS responses surfaced a consistent pattern of frustration. Across different users and different phrasings, the message was the same.
            </p>

            <div className="nps-quotes">
              <div className="nps-quote-card">
                <p className="nps-quote-text">"Challenging to try and look between several products to compare."</p>
                <p className="nps-quote-source">Samsung.com customer · NPS response</p>
              </div>
              <div className="nps-quote-card">
                <p className="nps-quote-text">"Confusing site, hard to compare items."</p>
                <p className="nps-quote-source">Samsung.com customer · NPS response</p>
              </div>
              <div className="nps-quote-card">
                <p className="nps-quote-text">"Specs are hard to access and compatibility information is not clear."</p>
                <p className="nps-quote-source">Samsung.com customer · NPS response</p>
              </div>
            </div>

            <div className="nps-stats">
              <div className="nps-stat-card">
                <p className="nps-stat-number">10%</p>
                <p className="nps-stat-description">Average scroll depth inside the compare popup. Users were opening it and immediately giving up.</p>
              </div>
              <div className="nps-stat-card">
                <p className="nps-stat-number">~100</p>
                <p className="nps-stat-description">Users observed actively comparing products on Samsung.com during analysis.</p>
              </div>
            </div>
          </div>

          {/* Part 2: UX Audit */}
          <div className="research-part">
            <p className="research-part-label">02 &mdash; UX Audit</p>
            <p className="research-part-description">
              A hands-on walkthrough of the compare flow revealed structural issues that explained the NPS frustration.
            </p>

            <div className="audit-cards">
              <div className="audit-card">
                <div className="audit-card-image">
                  <img src={auditCompare} alt="Compare models popup showing product headers and images" />
                </div>
                <p className="audit-card-insight">The popup <strong>overflows the viewport</strong>. The entire layout spills beyond the visible screen area.</p>
              </div>
              <div className="audit-card">
                <div className="audit-card-image">
                  <img src={auditSpecs} alt="Spec comparison table with N/A values and long lists" />
                </div>
                <p className="audit-card-insight">Too many <strong>N/A values</strong> make the comparison table feel <strong>broken</strong>, not useful.</p>
              </div>
            </div>

            <div className="audit-card audit-card-full">
              <div className="audit-card-image">
                <video autoPlay loop muted playsInline>
                  <source src={auditVideo} type="video/mp4" />
                </video>
              </div>
              <p className="audit-card-insight">Specs have <strong>no logical order</strong>, no categories, and <strong>no way to spot differences at a glance</strong>. Users are forced to scroll through everything just to find what matters.</p>
            </div>
          </div>
          </section>

          {/* Competitive Research */}
          <section id="competitive" className="case-study-section">
            <h2 className="section-title">COMPETITIVE RESEARCH</h2>
            <h3 className="subsection-heading">No competitor was perfect, but Samsung had the most ground to cover</h3>
            <p className="section-description">
              I benchmarked Samsung's compare experience against Home Depot, Best Buy, and Lowes across six criteria that directly affect a user's ability to make a confident purchase decision.
            </p>

            <div className="comp-table-wrapper">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th className="comp-criteria-header">CRITERIA</th>
                    <th>HOME DEPOT</th>
                    <th>BEST BUY</th>
                    <th>LOWES</th>
                    <th className="comp-highlight-header">SAMSUNG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="comp-criteria">Categorisation of specs</td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Top 5 key specs at a glance</td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Key differences highlighted</td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Visual layout and alignment</td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Scannability</td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Responsive layout</td>
                    <td><span className="comp-fail">&#10005;</span></td>
                    <td><span className="comp-pass">&#10003;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                    <td><span className="comp-fail">&#10005;</span></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="comp-score-row">
                    <td className="comp-criteria comp-score-label">SCORE</td>
                    <td className="comp-score">5 / 6</td>
                    <td className="comp-score">5 / 6</td>
                    <td className="comp-score">2 / 6</td>
                    <td className="comp-score comp-score-samsung">0 / 6</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="comp-takeaway">
              <p className="comp-takeaway-label">KEY TAKEAWAY</p>
              <p className="comp-takeaway-text">
                Home Depot and Best Buy both scored 5 out of 6, strong experiences with one gap each. Samsung scored 0 out of 6. This wasn't a marginal difference. It confirmed that the compare experience needed a fundamental rethink, not just a visual polish.
              </p>
            </div>
          </section>

          {/* Confidential Wall */}
          <div className="confidential-wall">
            <div className="confidential-faded-content">
              <section className="case-study-section">
                <h2 className="section-title">KEY INSIGHTS</h2>
                <p className="section-description">
                  Three core patterns emerged from the research that shaped every design decision going forward.
                </p>
              </section>
              <section className="case-study-section">
                <h2 className="section-title">THE SOLUTION</h2>
                <p className="section-description">
                  We redesigned the compare experience to reduce cognitive load, improve scannability, and give users a clearer path from comparison to purchase.
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
      </div>

      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
      <ChatSidebar isOpen={isChatOpen} onClose={handleChatClose} theme={theme} />
    </div>
  );
};

export default SamsungPage;
