import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowsOutSimple, X } from '@phosphor-icons/react';
import { useReducedMotion } from 'framer-motion';
import Navbar from './Navbar';
import ChatSidebar from './ChatSidebar';
import CustomizeButton from './CustomizeButton';
import playgroundProjects from '../data/playgroundProjects';
import geminiIcon from '../assets/gemini 1.svg';
import '../styles/Playground.css';

const GeminiIcon = ({ className }) => (
  <img
    src={geminiIcon}
    alt="Gemini"
    className={className}
    style={{ width: '20px', height: '18px' }}
  />
);

const THEME_COLORS = {
  'Peachy Orange': { navBg: '#FFFAF2', navPills: '#FFEED4', accent: '#FFB13D' },
  'Lavender Dream': { navBg: '#FBF1F9', navPills: '#F8D2FC', accent: '#865D95' },
  'Blush Petal': { navBg: '#F9DAED', navPills: '#FDF0F8', accent: '#FB97D4' },
  'Sky': { navBg: '#BEE3FF', navPills: '#D8F1FF', accent: '#1A7FD6' },
  'Pastel Red': { navBg: '#FFDADF', navPills: '#FFF6F8', accent: '#FF7084' }
};

const AMBIENT_SAMPLE_SIZE = { width: 16, height: 9 };
const AMBIENT_SAMPLE_INTERVAL = 500;

const toHex = (value) => Math.round(value).toString(16).padStart(2, '0');

const rgbToHex = ({ red, green, blue }) => (
  `#${toHex(red)}${toHex(green)}${toHex(blue)}`
);

const hexToRgba = (hex, alpha) => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const colorDistance = (first, second) => Math.sqrt(
  ((first.red - second.red) ** 2)
  + ((first.green - second.green) ** 2)
  + ((first.blue - second.blue) ** 2)
);

function extractDominantColors(imageData, fallbackColors) {
  const buckets = new Map();

  for (let index = 0; index < imageData.length; index += 4) {
    if (imageData[index + 3] < 200) continue;

    const red = Math.min(255, Math.round(imageData[index] / 32) * 32);
    const green = Math.min(255, Math.round(imageData[index + 1] / 32) * 32);
    const blue = Math.min(255, Math.round(imageData[index + 2] / 32) * 32);
    const luminance = (red * 0.2126) + (green * 0.7152) + (blue * 0.0722);

    if (luminance < 40 || luminance > 238) continue;

    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const saturation = maximum === 0 ? 0 : (maximum - minimum) / maximum;
    const key = `${red}-${green}-${blue}`;
    const bucket = buckets.get(key) || { red, green, blue, count: 0, saturation };
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  const rankedColors = [...buckets.values()]
    .sort((first, second) => (
      (second.count * (0.7 + second.saturation))
      - (first.count * (0.7 + first.saturation))
    ));
  const selectedColors = [];

  rankedColors.forEach((color) => {
    if (
      selectedColors.length < 3
      && selectedColors.every((selected) => colorDistance(color, selected) > 52)
    ) {
      selectedColors.push(color);
    }
  });

  const extractedColors = selectedColors.map(rgbToHex);
  return [...extractedColors, ...fallbackColors].slice(0, 3);
}

function createAmbientGradient(colors) {
  const [first, second, third = first] = colors;
  return [
    `radial-gradient(circle at 18% 24%, ${hexToRgba(first, 0.72)} 0%, transparent 54%)`,
    `radial-gradient(circle at 82% 72%, ${hexToRgba(second, 0.66)} 0%, transparent 56%)`,
    `linear-gradient(135deg, ${hexToRgba(third, 0.34)} 0%, transparent 64%)`
  ].join(', ');
}

function PrototypeMedia({ project }) {
  const videoRef = useRef(null);
  const fallbackColors = project.ambientGradient;
  const fallbackGradient = createAmbientGradient(fallbackColors);
  const [ambientLayers, setAmbientLayers] = useState([fallbackGradient, fallbackGradient]);
  const [activeAmbientLayer, setActiveAmbientLayer] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || project.prototypeUrl) return undefined;

    const canvas = document.createElement('canvas');
    canvas.width = AMBIENT_SAMPLE_SIZE.width;
    canvas.height = AMBIENT_SAMPLE_SIZE.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    let currentLayer = 0;
    let previousColors = fallbackColors;
    let lastGradientUpdate = 0;

    const sampleFrame = () => {
      if (!context || video.paused || video.ended || video.readyState < 2) return;
      if (performance.now() - lastGradientUpdate < 900) return;

      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const nextColors = extractDominantColors(pixels, fallbackColors);
        const colorsChanged = nextColors.some((color, index) => color !== previousColors[index]);

        if (!colorsChanged) return;

        const nextLayer = currentLayer === 0 ? 1 : 0;
        const nextGradient = createAmbientGradient(nextColors);
        setAmbientLayers((layers) => layers.map((gradient, index) => (
          index === nextLayer ? nextGradient : gradient
        )));
        setActiveAmbientLayer(nextLayer);
        currentLayer = nextLayer;
        previousColors = nextColors;
        lastGradientUpdate = performance.now();
      } catch {
        // The initialized project gradient remains visible if canvas access fails.
      }
    };

    const intervalId = window.setInterval(sampleFrame, AMBIENT_SAMPLE_INTERVAL);
    video.addEventListener('playing', sampleFrame);

    return () => {
      window.clearInterval(intervalId);
      video.removeEventListener('playing', sampleFrame);
    };
  }, [fallbackColors, project.prototypeUrl]);

  return (
    <div className={`playground-dialog-media playground-dialog-media--${project.format}`}>
      <div className="playground-dialog-ambient" aria-hidden="true">
        {ambientLayers.map((gradient, index) => (
          <span
            className={`playground-dialog-ambient-layer${index === activeAmbientLayer ? ' is-active' : ''}`}
            key={index}
            style={{ backgroundImage: gradient }}
          />
        ))}
      </div>

      {project.prototypeUrl ? (
        <iframe src={project.prototypeUrl} title={`${project.title} prototype`} />
      ) : (
        <video
          ref={videoRef}
          src={project.video}
          controls
          autoPlay
          playsInline
          preload="auto"
        />
      )}
    </div>
  );
}

function PrototypeCard({ project, pausePreview, onSelect }) {
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (reduceMotion || pausePreview) {
      video.pause();
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.35 });

    observer.observe(video);
    return () => observer.disconnect();
  }, [pausePreview, reduceMotion]);

  return (
    <article className={`playground-card playground-card--${project.format}`}>
      <button
        className="playground-card-button"
        type="button"
        onClick={() => onSelect(project)}
        aria-label={`Open ${project.title}`}
      >
        <span
          className="playground-card-media"
          style={{ '--playground-media-bg': project.mediaBackground }}
        >
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <span className="playground-card-open" aria-hidden="true">
            <ArrowsOutSimple size={18} weight="bold" />
          </span>
        </span>

        <span className="playground-card-copy">
          <span className="playground-card-title">{project.title}</span>
          <span className="playground-card-description">{project.description}</span>
        </span>
      </button>
    </article>
  );
}

function PrototypeDialog({ project, dialogRef, onClose }) {
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  };

  return (
    <dialog
      className="playground-dialog"
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      aria-labelledby="playground-dialog-title"
    >
      {project && (
        <div className="playground-dialog-panel">
          <PrototypeMedia key={project.id} project={project} />

          <div className="playground-dialog-footer">
            <div>
              <h2 id="playground-dialog-title">{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <button
              className="playground-dialog-close"
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close preview"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function Playground({ theme, onThemeChange }) {
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const themeColors = useMemo(() => {
    const themeName = theme?.name || 'Peachy Orange';
    return THEME_COLORS[themeName] || THEME_COLORS['Peachy Orange'];
  }, [theme]);

  useEffect(() => {
    if (!activeProject) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProject]);

  const openProject = (project) => {
    setActiveProject(project);
    window.requestAnimationFrame(() => dialogRef.current?.showModal());
  };

  return (
    <div className="playground-page">
      <Navbar
        theme={theme}
        currentPage="playground"
        activeTab="playground"
        onTabClick={() => {}}
        onChatOpen={() => setIsChatOpen(true)}
        onLogoClick={() => navigate('/home')}
        GeminiIcon={GeminiIcon}
      />

      <main className="playground-main site-container" aria-label="Playground projects">
        <div className="playground-grid">
          {playgroundProjects.map((project) => (
            <PrototypeCard
              key={project.id}
              project={project}
              pausePreview={Boolean(activeProject)}
              onSelect={openProject}
            />
          ))}
        </div>
      </main>

      <PrototypeDialog
        project={activeProject}
        dialogRef={dialogRef}
        onClose={() => setActiveProject(null)}
      />

      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        themeColors={themeColors}
      />

      <CustomizeButton theme={theme} onThemeChange={onThemeChange} />
    </div>
  );
}
