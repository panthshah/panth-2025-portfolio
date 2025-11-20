import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CustomizeButton from './CustomizeButton';
import ChatSidebar from './ChatSidebar';
import geminiIcon from '../assets/gemini 1.svg';
import image1 from '../assets/Foundermatch1.png';
import image2 from '../assets/Foundermatch2.png';
import image3 from '../assets/Foundermatch3.png';
import image4 from '../assets/Foundermatch4.png';
import image5 from '../assets/Foundermatch5.png';
import image6 from '../assets/Foundermatch6.png';
import image7 from '../assets/Foundermatch7.png';
import image8 from '../assets/Foundermatch8.png';
import image9 from '../assets/Foundermatch9.png';
import image10 from '../assets/Foundermatch10.png';
import image11 from '../assets/Foundermatch11.png';
import video1 from '../assets/Video1.mp4';
import '../styles/ProjectPage.css';

// Custom Gemini Icon Component
const GeminiIcon = ({ size = 20, className }) => (
  <img 
    src={geminiIcon} 
    alt="Gemini" 
    style={{ width: '20px', height: '18px' }} 
    className={className}
  />
);

const ProjectPage = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('playground');

  const handleChatOpen = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

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
          Founder Match is an AI-powered app that connects entrepreneurs with their ideal co-founders to help startups grow
        </p>

        {/* Project Hero Image */}
        <div className="project-hero-image">
          <img src={image1} alt="Founder Match Hero" />
        </div>

        {/* Overview Section */}
        <div className="project-overview">
          <div className="overview-column">
            <h3 className="overview-heading">Timeline</h3>
            <p className="overview-text">Jan 2024- May 2024</p>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Team</h3>
            <p className="overview-text">1 Designer</p>
            <p className="overview-text">1 Developer</p>
            <p className="overview-text">2 AI Engineers</p>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Tools</h3>
            <p className="overview-text">Figma</p>
            <p className="overview-text">Figma Jam</p>
            <p className="overview-text">Mural</p>
          </div>
          <div className="overview-column">
            <h3 className="overview-heading">Disciplines</h3>
            <p className="overview-text">MVP</p>
            <p className="overview-text">Business Plan</p>
            <p className="overview-text">UX Design</p>
          </div>
        </div>

        {/* Problem Section */}
        <section className="case-study-section">
          <h2 className="section-title">PROBLEM</h2>
          <div className="problem-box">
            <p className="problem-text">
              <span className="highlight-text">It's hard for startup founders to find the right cofounder.</span> They struggle because there aren't enough good ways to meet potential cofounders with the skills they need and share their vision for the business.
            </p>
          </div>
        </section>

        {/* Opportunity Section */}
        <section className="case-study-section">
          <h2 className="section-title">OPPORTUNITY</h2>
          <div className="opportunity-box">
          <p className="section-description">
            Build a platform where founders can meet co-founders with the right skillset, personality and work style to help them build their next startup idea
          </p>
          </div>
        </section>

        {/* Discovery Section */}
        <section className="case-study-section">
          <h2 className="section-title">DISCOVERY</h2>
          <h3 className="discovery-subtitle">Researching Founder Perspectives on Co-founder Selection</h3>
          <p className="section-description">
            We wanted to understand how founders look out for potential co-founders, so we reached out to a few founders and conducted a brief survey with 35 participants. We mapped out initial insights from the survey
          </p>
          
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-number">1</div>
              <p className="insight-text">It's hard for founders to find co-founders with complementary skills</p>
            </div>
            <div className="insight-card">
              <div className="insight-number">2</div>
              <p className="insight-text">Founders are unsure what skillsets to look for</p>
            </div>
            <div className="insight-card">
              <div className="insight-number">3</div>
              <p className="insight-text">There is no designated area for searching for a co-founder.</p>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="case-study-section">
          <h2 className="section-title">PAINPOINTS</h2>
          <p className="section-description">
            After talking to more founders and mapping all the survey insights we ended up focusing on three important pain points
          </p>

          {/* Pain Point 1 */}
          <div className="pain-point">
            <div className="pain-point-image-container">
              <img src={image2} alt="Pain Point 1 - Flowchart" />
            </div>
            <div className="pain-point-content">
              <div className="pain-point-label">Pain point-1</div>
              <h3 className="subsection-heading">
                A lot of entrepreneurs have a hard time finding the right co-founder, and it often happens by chance.
              </h3>
              <p className="pain-point-quote">
                "I met mine from the co-founder matching pool. I was lucky that a few technical cofounders reached out, and I contacted some too, filtering down from 15 to 3, then 1. The process took about 3 months "
              </p>
            </div>
          </div>

          {/* Pain Point 2 */}
          <div className="pain-point pain-point-reverse">
            <div className="pain-point-content">
              <div className="pain-point-label">Pain point-2</div>
              <h3 className="subsection-heading">
                Founders often lack access to diverse skillsets within their existing networks
              </h3>
              <p className="section-description">
                We naturally connect with people who share our backgrounds and interests—designers with designers, engineers with engineers. While this builds strong communities, it limits exposure to complementary skill sets, making the search for a co-founder within one's network challenging and repetitive
              </p>
            </div>
            <div className="pain-point-image-container">
              <img src={image3} alt="Pain Point 2 - Two People" />
            </div>
          </div>

          {/* Pain Point 3 */}
          <div className="pain-point">
            <div className="pain-point-image-container">
              <img src={image4} alt="Pain Point 3 - People with Pencils" />
            </div>
            <div className="pain-point-content">
              <div className="pain-point-label">Pain point-3</div>
              <h3 className="subsection-heading">
                Finding a founder who aligns with your vision, personality, and work style is tough
              </h3>
              <p className="section-description">
                When seeking a co-founder, compatibility in personality, work style, and vision is crucial. Misalignment in these areas can lead to conflicts, reduced productivity, and even business failure in most of the startups
              </p>
            </div>
          </div>
        </section>

        {/* Competitive Research Section */}
        <section className="case-study-section">
          <h2 className="section-title">COMPETITIVE RESEARCH</h2>
          <h3 className="subsection-heading">
            I studied co-founder matching platforms like YC Combinator and CoFoundersLab, evaluating their matching process, user experience, and focus on vision alignment
          </h3>
          <p className="section-description">
            CoFounderLabs and YC's Co-Founder Matching platform aimed to connect founders, but both had gaps. CoFounderLabs limited searches, making it hard to find the right match, while YC focused on skills and business ideas but overlooked deeper factors like vision alignment and work style. Both relied on static profiles, leading to mismatched connections and a weaker community
          </p>
        </section>

        {/* Whiteboarding Section */}
        <section className="case-study-section">
          <h2 className="section-title">WHITEBOARDING</h2>
          <h3 className="subsection-heading">Starting With a Team Brainstorm</h3>
          <p className="section-description">
            Building on insights from our user surveys and early research, we began the design process with an intensive brainstorming workshop. Using a collaborative whiteboard setup, we explored potential features across key areas—Signup, Onboarding, Matching, and more—while visually mapping end-to-end user flows. This approach helped us generate a broad set of ideas and ensure that every direction remained anchored in real user needs
          </p>
        </section>

        {/* Cross Journey Feature Mapping Section */}
        <section className="case-study-section">
          <h2 className="section-title">CROSS JOURNEY FEATURE MAPPING</h2>
          <p className="section-description">
            After exploring multiple scenarios, we synthesized key business insights to systematically break down tasks for our MVP. This structured approach ensured we prioritized features that align with user needs and business goals, setting a clear foundation for development
          </p>
          <div className="feature-mapping-image">
            <img src={image5} alt="Feature Mapping Grid" />
          </div>
        </section>

        {/* Sitemap Section */}
        <section className="case-study-section">
          <h2 className="section-title">SITEMAP</h2>
          <p className="section-description">
            Building upon data insights, we began the process of translating high-priority features (signup, onboarding, matching) into a functional site structure and user interface. We then used visual aids, like sitemaps, wireframes, etc.. to bring the idea to life. This allowed to have visual in mind while building the product.
          </p>
          <div className="sitemap-image">
            <img src={image6} alt="Sitemap Wireframes" />
          </div>
        </section>

        {/* User Flow Section */}
        <section className="case-study-section">
          <h2 className="section-title">USER FLOW</h2>
          <h3 className="subsection-heading">
            We divided the key flows in three sections : User flow, Idea flow and Match flow
          </h3>
          <p className="section-description">
            Building on insights from our user surveys and early research, we began the design process with an intensive brainstorming workshop. Using a collaborative whiteboard setup, we explored potential features across key areas—Signup, Onboarding, Matching, and more—while visually mapping end-to-end user flows. This approach helped us generate a broad set of ideas and ensure that every direction remained anchored in real user needs
          </p>
          <div className="userflow-image">
            <img src={image7} alt="User Flow Diagram" />
          </div>
        </section>

        {/* Event Based Matching Section */}
        <section className="case-study-section">
          <h3 className="subsection-heading">Introducing Event Based Matching</h3>
          <div className="video-container">
            <video autoPlay loop muted playsInline>
              <source src={video1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="event-matching-content">
            <p className="event-description">
              <strong>As an Host:</strong> You create your event on FounderMatch and invite attendees through the platform. Our AI handles all the matchmaking based on participant profiles, powering you to create an event where meaningful connections happen.
            </p>
            <p className="event-description">
              <strong>As an Attendee:</strong> Set up your profile by sharing details about yourself and your projects. Choose an event that suits your schedule, and our AI will connect you with potential cofounders and collaborators. Finally, meet them in person at an exciting event designed to foster startup partnerships.
            </p>
          </div>
        </section>

        {/* How Does It Match Section */}
        <section className="case-study-section">
          <h3 className="subsection-heading">How does it match me with collaborators?</h3>
          <div className="matching-algorithm-image">
            <img src={image8} alt="Matching Algorithm" />
          </div>
          <p className="section-description">
            Our AI-powered algorithm analyzes your profile to find complementary skills and aligned goals among attendees. It also suggests events where you're most likely to meet ideal cofounders and collaborators, helping you network productively.
          </p>
        </section>

        {/* Early Testing Section */}
        <section className="case-study-section">
          <h2 className="section-title">EARLY TESTING</h2>
          <h3 className="subsection-heading">
            We did task- based testing with some of the founders and gathered several actionable insights
          </h3>
          <p className="section-description">
            Building on insights from our user surveys and early research, we began the design process with an intensive brainstorming workshop. Using a collaborative whiteboard setup, we explored potential features across key areas—Signup, Onboarding, Matching, and more—while visually mapping end-to-end user flows. This approach helped us generate a broad set of ideas and ensure that every direction remained anchored in real user needs
          </p>
          <div className="testing-image">
            <img src={image9} alt="Early Testing Insights" />
          </div>
        </section>

        {/* Reflection and Impact Section */}
        <section className="case-study-section">
          <h2 className="section-title">REFLECTION AND IMPACT</h2>
          <h3 className="subsection-heading">
            Foundermatch [ MVP ] was shipped in April 2024 and was well received by the users.
          </h3>
          <p className="section-description">
            Led end-to-end flow development, working with cross-functional teams from research to execution. Onboarded 200 new users post-launch. Presented the product at Harvard Innovation Center (Techstars'24).
          </p>
          <div className="reflection-images">
            <div className="reflection-image-item">
              <img src={image10} alt="Foundermatch Impact 1" />
            </div>
            <div className="reflection-image-item">
              <img src={image11} alt="Foundermatch Impact 2" />
            </div>
          </div>
        </section>
      </div>

      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
      <ChatSidebar isOpen={isChatOpen} onClose={handleChatClose} theme={theme} />
    </div>
  );
};

export default ProjectPage;

