import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import FlipPhone3D from './components/FlipPhone3D';
import LandingPage from './components/LandingPage';
import ProjectPage from './components/ProjectPage';
import SamsungPage from './components/SamsungPage';
import NortheasternPage from './components/NortheasternPage';
import Playground from './components/Playground';
import AboutMeNew from './components/AboutMeNew';
import { precompileShaders } from './utils/shaderPreloader';
import { Analytics } from '@vercel/analytics/react';

const DEFAULT_THEME = {
  name: 'Peachy Orange',
  gradient: 'linear-gradient(180deg, #FFF8F3 0%, #FFDEAD 100%)',
  colors: ['#FFF8F3', '#FFDEAD'],
  useShader: true
};

function AppContent() {
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEME);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-compile shaders on app start
  useEffect(() => {
    try {
      precompileShaders();
    } catch (error) {
      console.error('Shader precompilation failed:', error);
    }
  }, []);

  // On mount, set default theme in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      try {
        setSelectedTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
        localStorage.setItem('selectedTheme', JSON.stringify(DEFAULT_THEME));
      }
    } else {
      localStorage.setItem('selectedTheme', JSON.stringify(DEFAULT_THEME));
    }
  }, []);

  // Sync theme from localStorage on navigation
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      try {
        setSelectedTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, [location.pathname]);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', JSON.stringify(theme));
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    navigate('/home', { replace: true });
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<LandingPage theme={selectedTheme} onThemeChange={handleThemeChange} />} />
        <Route path="/about" element={<AboutMeNew theme={selectedTheme} onThemeChange={handleThemeChange} />} />
        <Route path="/foundermatch" element={<ProjectPage theme={selectedTheme} onThemeChange={handleThemeChange} />} />
        <Route path="/samsung" element={<SamsungPage theme={selectedTheme} onThemeChange={handleThemeChange} />} />
        <Route path="/northeastern" element={<NortheasternPage theme={selectedTheme} onThemeChange={handleThemeChange} />} />
        <Route path="/phone" element={<FlipPhone3D />} />
        <Route path="/playground" element={<Playground theme={selectedTheme} onThemeChange={handleThemeChange} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Analytics />
    </BrowserRouter>
  );
}

export default App