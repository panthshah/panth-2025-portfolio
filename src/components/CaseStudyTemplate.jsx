import { useEffect, useRef, useState } from 'react';

export const CaseStudyLayout = ({ sections, children }) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? 'overview');
  const navigationTarget = useRef(null);
  const navigationTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navigationTarget.current) {
        setActiveSection(navigationTarget.current);
        return;
      }

      const visibleSections = sections
        .map(({ id }) => {
          const element = document.getElementById(id);
          return element ? { id, top: element.getBoundingClientRect().top } : null;
        })
        .filter(Boolean);

      const isAtPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;

      if (isAtPageEnd && visibleSections.length) {
        setActiveSection(visibleSections[visibleSections.length - 1].id);
        return;
      }

      const active = visibleSections.reduce(
        (closest, current) => current.top <= 200 && current.top > closest.top ? current : closest,
        { id: visibleSections[0]?.id ?? sections[0]?.id, top: -Infinity },
      );

      if (active.id) setActiveSection(active.id);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(navigationTimer.current);
    };
  }, [sections]);

  const scrollToSection = (id) => {
    navigationTarget.current = id;
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.clearTimeout(navigationTimer.current);
    navigationTimer.current = window.setTimeout(() => {
      navigationTarget.current = null;
    }, 1200);
  };

  return (
    <div className="project-page-content case-study-layout">
      <aside className="case-study-sidebar" aria-label="Case study sections">
        <nav className="case-study-sidebar-nav">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`case-study-sidebar-link ${activeSection === id ? 'active' : ''}`}
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="case-study-body">{children}</main>
    </div>
  );
};

export const CaseStudyHeader = ({ title, media, overview, children }) => (
  <section id="overview" className="case-study-section case-study-section-first">
    <h1 className="case-study-title">{title}</h1>
    <div className="project-hero-image">{media}</div>
    <div className="project-overview">
      {overview.map(({ label, items }) => (
        <div className="overview-column" key={label}>
          <p className="overview-heading">{label}</p>
          <div className="overview-items">
            {items.map(item => <p className="overview-text" key={item}>{item}</p>)}
          </div>
        </div>
      ))}
    </div>
    {children}
  </section>
);
