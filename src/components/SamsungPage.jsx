import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CustomizeButton from './CustomizeButton';
import ChatSidebar from './ChatSidebar';
import { CaseStudyHeader, CaseStudyLayout } from './CaseStudyTemplate';
import geminiIcon from '../assets/gemini 1.svg';
import samsungHeroVideo from '../assets/samsung-case-study/product-comparison-hero.mp4';
import auditCompare from '../assets/audit-compare-models.png';
import auditSpecs from '../assets/audit-spec-table.png';
import auditVideo from '../assets/audit-video.mp4';
import productCategoryIa from '../assets/samsung-case-study/product-category-ia.png';
import '../styles/ProjectPage.css';

const GeminiIcon = ({ size = 20, className }) => (
  <img 
    src={geminiIcon} 
    alt="Gemini" 
    style={{ width: `${size}px`, height: `${size - 2}px` }}
    className={className}
  />
);

const SIDEBAR_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The Problem' },
  { id: 'research', label: 'How We Found It' },
  { id: 'competitive', label: 'Competitive Research' },
  { id: 'direction', label: 'Direction' },
  { id: 'architecture', label: 'Information Architecture' },
  { id: 'iterations', label: 'Iterations' },
  { id: 'final-direction', label: 'Final Direction' },
];

const OVERVIEW = [
  { label: 'Timeline', items: ['May 2025 – Present'] },
  { label: 'My Role', items: ['UX Design', 'Research & Strategy', 'Cross-functional Collaboration'] },
  { label: 'Team', items: ['Design, Product, Data, Engineering & Business'] },
  { label: 'Tools', items: ['Figma & Sketch', 'UserTesting.com', 'Confluence & Jira'] },
];

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

      <CaseStudyLayout sections={SIDEBAR_SECTIONS}>
        <CaseStudyHeader
          title="Making Product Comparison Actually Work on Samsung.com"
          overview={OVERVIEW}
          media={(
            <video
                src={samsungHeroVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Samsung Product Finder comparison experience"
            />
          )}
        >
            <h2 className="section-title">OVERVIEW</h2>
            <p className="section-description">
              Samsung.com's Product Finder helps U.S. shoppers filter and compare products. I led a research-driven redesign of the comparison experience in partnership with product, data, and engineering.
            </p>
        </CaseStudyHeader>

          {/* Problem */}
          <section id="problem" className="case-study-section">
            <h2 className="section-title">THE PROBLEM</h2>
            <p className="section-description">
              Shoppers struggled to compare products confidently. The experience was visually dense, specification data was often incomplete, and users rarely reached the information needed to distinguish one product from another.
            </p>
          </section>

          {/* How We Found the Problem */}
          <section id="research" className="case-study-section">
            <h2 className="section-title">HOW WE FOUND THE PROBLEM</h2>
          <h3 className="subsection-heading">Two evidence sources revealed the same pattern</h3>
          <p className="section-description">
            Customer feedback and a structured UX audit both pointed to an experience that was difficult to scan, navigate, and trust.
          </p>

          {/* Part 1: NPS Feedback */}
          <div className="research-part">
            <p className="research-part-label">01 &mdash; Net Promoter Score (NPS) Feedback</p>
            <p className="research-part-description">
              NPS comments repeatedly described the comparison experience as confusing, difficult to scan, and incomplete.
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
                <p className="nps-stat-description">Average scroll depth in the comparison modal, suggesting that few users reached deeper specifications.</p>
              </div>
              <div className="nps-stat-card">
                <p className="nps-stat-number">~100</p>
                <p className="nps-stat-description">Users included in the analysis of comparison behavior on Samsung.com.</p>
              </div>
            </div>
          </div>

          {/* Part 2: UX Audit */}
          <div className="research-part">
            <p className="research-part-label">02 &mdash; UX Audit</p>
            <p className="research-part-description">
              A structured audit revealed usability issues consistent with the frustrations described in NPS feedback.
            </p>

            <div className="audit-cards">
              <div className="audit-card">
                <div className="audit-card-image">
                  <img src={auditCompare} alt="Compare models popup showing product headers and images" />
                </div>
                <p className="audit-card-insight">The comparison modal <strong>extended beyond the viewport</strong>, hiding key content.</p>
              </div>
              <div className="audit-card">
                <div className="audit-card-image">
                  <img src={auditSpecs} alt="Spec comparison table with N/A values and long lists" />
                </div>
                <p className="audit-card-insight">Frequent <strong>N/A values</strong> reduced confidence in the comparison data.</p>
              </div>
            </div>

            <div className="audit-card audit-card-full">
              <div className="audit-card-image">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Recorded audit of Samsung's product comparison experience"
                  >
                  <source src={auditVideo} type="video/mp4" />
                </video>
              </div>
              <p className="audit-card-insight">Specifications lacked <strong>clear grouping, prioritization, and difference highlighting</strong>, forcing users to scan the full table.</p>
            </div>
          </div>
          </section>

          {/* Competitive Research */}
          <section id="competitive" className="case-study-section">
            <h2 className="section-title">COMPETITIVE RESEARCH</h2>
            <h3 className="subsection-heading">Competitor patterns revealed a clear opportunity for Samsung</h3>
            <p className="section-description">
              I evaluated Samsung, Home Depot, Best Buy, and Lowe's against six criteria tied to comparison clarity, scannability, and purchase confidence.
            </p>

            <div className="comp-table-wrapper">
                <table className="comp-table">
                  <caption className="sr-only">
                    Comparison of product comparison experiences across six criteria
                  </caption>
                <thead>
                  <tr>
                    <th scope="col" className="comp-criteria-header">CRITERIA</th>
                    <th scope="col">HOME DEPOT</th>
                    <th scope="col">BEST BUY</th>
                    <th scope="col">LOWES</th>
                    <th scope="col" className="comp-highlight-header">SAMSUNG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="comp-criteria">Categorization of specifications</td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Five key specifications at a glance</td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Key differences highlighted</td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Visual layout and alignment</td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Scannability</td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td className="comp-criteria">Responsive layout</td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                    <td><span className="comp-pass" role="img" aria-label="Meets criterion">&#10003;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
                    <td><span className="comp-fail" role="img" aria-label="Does not meet criterion">&#10005;</span></td>
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

            <div className="mobile-competitor-summary" aria-label="Competitive research scores">
              <article>
                <div><h4>Home Depot</h4><strong>5 / 6</strong></div>
                <p>Strong overall; responsive layout was the only criterion not met.</p>
              </article>
              <article>
                <div><h4>Best Buy</h4><strong>5 / 6</strong></div>
                <p>Strong overall; scannability was the only criterion not met.</p>
              </article>
              <article>
                <div><h4>Lowe&apos;s</h4><strong>2 / 6</strong></div>
                <p>Met categorization and key-specification criteria, but missed the remaining four.</p>
              </article>
              <article className="mobile-competitor-summary-samsung">
                <div><h4>Samsung</h4><strong>0 / 6</strong></div>
                <p>The audited experience did not meet any of the six comparison criteria.</p>
              </article>
            </div>

            <div className="comp-takeaway">
              <p className="comp-takeaway-label">KEY TAKEAWAY</p>
              <p className="comp-takeaway-text">
                Home Depot and Best Buy met five of the six criteria, while Samsung met none in the audited experience. The gap was structural, not cosmetic, showing a need to rethink how specifications were organized, prioritized, and compared.
              </p>
            </div>
          </section>

          {/* Defining the Direction */}
          <section id="direction" className="case-study-section">
            <h2 className="section-title">DEFINING THE DIRECTION</h2>
            <h3 className="subsection-heading">One question focused the redesign</h3>
            <p className="section-description">
              The research pointed to an information problem, not simply a visual one. I used a single how-might-we question to align the team around the decision shoppers needed to make.
            </p>

            <blockquote className="hmw-statement">
              <p className="hmw-label">How might we</p>
              <p className="hmw-copy">How might we help shoppers compare the specifications that matter most without forcing them to scan an overwhelming table?</p>
            </blockquote>

            <p className="case-study-supporting-copy">
              That question translated the research into four design goals: improve scannability, surface key specifications, highlight meaningful differences, and organize specifications into clear categories.
            </p>

          </section>

          {/* Information Architecture */}
          <section id="architecture" className="case-study-section">
            <h2 className="section-title">INFORMATION ARCHITECTURE</h2>
            <h3 className="subsection-heading">Organizing specifications around how people choose</h3>
            <p className="section-description">
              I reviewed RTINGS.com, Best Buy, Reddit, Consumer Reports, and buyer guides to understand which details shoppers prioritize across appliances and electronics. Those signals helped identify the decision-critical specifications for each product category.
            </p>
            <p className="case-study-supporting-copy">
              For refrigerators, that included dimensions, storage, water and ice, design, and cooling. I then mapped category-specific groups across product lines so shoppers could move directly to what mattered without every product being forced into the same hierarchy.
            </p>

            <figure className="ia-image">
              <img src={productCategoryIa} alt="Product categories connected to the key specification groups used for comparison" />
              <figcaption>A scalable structure connects each category to the specifications shoppers use to decide.</figcaption>
            </figure>

            <div className="ia-diagram ia-diagram-mobile" role="group" aria-label="Product categories and their key comparison specifications">
              <div className="ia-branches">
                {[
                  ['Refrigerator', ['Dimensions', 'Storage', 'Water & Ice', 'Design', 'Cooling']],
                  ['Microwave', ['Performance', 'Smart controls', 'Physical & install', 'Ventilation']],
                  ['TV', ['Display', 'Smart features', 'Sound', 'Design', 'Connectivity']],
                  ['Soundbar', ['Audio', 'Connectivity', 'Design', 'Subwoofer', 'Smart features']],
                  ['Projector', ['Picture quality', 'Smart & audio', 'Connectivity', 'Physical & lamp']],
                  ['Monitor', ['Display performance', 'Color & picture', 'Connectivity', 'Ergonomics', 'Gaming']],
                ].map(([category, specs], index) => (
                  <article className={`ia-branch ${index === 0 ? 'ia-branch-focus' : ''}`} key={category}>
                    <div className="ia-branch-heading">
                      <h4>{category}</h4>
                    </div>
                    <ul>
                      {specs.map(spec => <li key={spec}>{spec}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Selected Iterations */}
          <section id="iterations" className="case-study-section">
            <h2 className="section-title">DESIGN ITERATIONS</h2>
            <h3 className="subsection-heading">Each round removed a different source of friction</h3>
            <p className="section-description">
              I worked with design and product partners to test feasibility and refine the model across several iterations. Rather than showing every screen, these two stages capture the decisions that materially changed the direction.
            </p>

            <div className="iteration-notes">
              <article className="iteration-note">
                <p className="iteration-note-label">EARLY DIRECTION</p>
                <h4>Structure improved, but scrolling remained</h4>
                <p>The first concept introduced key specifications and main and subcategories. It created hierarchy, but shoppers still had to move through a long comparison page.</p>
              </article>
              <article className="iteration-note">
                <p className="iteration-note-label">SECOND DIRECTION</p>
                <h4>Faster scanning added more interaction</h4>
                <p>A category-jump menu shortened the path to deeper specifications, but it introduced extra clicks and relied on shoppers knowing where to go.</p>
              </article>
            </div>

          </section>

          {/* Final Direction */}
          <section id="final-direction" className="case-study-section">
            <h2 className="section-title">FINAL DIRECTION</h2>
            <h3 className="subsection-heading">A comparison experience built around decisions, not data volume</h3>
            <p className="section-description">
              The final direction combined the strongest ideas from earlier rounds and addressed the four needs identified at the start of the project.
            </p>

            <div className="solution-principles">
              <article className="solution-principle">
                <p className="solution-principle-number">01</p>
                <h4>Explain product fit</h4>
                <p>Help shoppers understand why a product may suit their needs before they enter the specification table.</p>
              </article>
              <article className="solution-principle">
                <p className="solution-principle-number">02</p>
                <h4>Create a clear hierarchy</h4>
                <p>Use main and subcategories so shoppers can move directly to the information they care about.</p>
              </article>
              <article className="solution-principle">
                <p className="solution-principle-number">03</p>
                <h4>Prioritize key specifications</h4>
                <p>Surface decision-critical details early instead of treating every specification with equal importance.</p>
              </article>
              <article className="solution-principle">
                <p className="solution-principle-number">04</p>
                <h4>Make differences scannable</h4>
                <p>Help shoppers identify meaningful distinctions without reading the full table row by row.</p>
              </article>
            </div>

            <p className="case-study-supporting-copy">
              After four to five rounds of feedback with design and product partners, the final concept was aligned and shared with the mobile team for implementation review.
            </p>
          </section>

      </CaseStudyLayout>

      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
      <ChatSidebar isOpen={isChatOpen} onClose={handleChatClose} theme={theme} />
    </div>
  );
};

export default SamsungPage;
