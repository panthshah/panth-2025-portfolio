import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import ThemeSelection from './components/ThemeSelection';
import FlipPhone3D from './components/FlipPhone3D';
import LandingPage from './components/LandingPage';
import AboutMe from './components/AboutMe';
import ProjectPage from './components/ProjectPage';
import { precompileShaders } from './utils/shaderPreloader';

function AppContent() {
  const [selectedTheme, setSelectedTheme] = useState(null);
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

  // Clear saved theme on mount to ensure fresh start every reload
  useEffect(() => {
    localStorage.removeItem('selectedTheme');
    setSelectedTheme(null);
  }, []);

  // Load theme from localStorage when user navigates away from theme selection
  useEffect(() => {
    if (location.pathname !== '/theme' && location.pathname !== '/') {
      const savedTheme = localStorage.getItem('selectedTheme');
      if (savedTheme) {
        try {
          const parsedTheme = JSON.parse(savedTheme);
          setSelectedTheme(parsedTheme);
        } catch (error) {
          console.error('Failed to parse saved theme:', error);
        }
      }
    }
  }, [location.pathname]);

  // Update theme without navigating (for modal)
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    // Also save to localStorage so it persists during navigation
    localStorage.setItem('selectedTheme', JSON.stringify(theme));
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    navigate('/theme', { replace: true });
  };

  // Show splash screen as overlay
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/theme" replace />} />
        <Route path="/theme" element={<ThemeSelection selectedTheme={selectedTheme} />} />
        <Route path="/home" element={<LandingPage theme={selectedTheme} onThemeChange={handleThemeChange} />} />
        <Route path="/about" element={<AboutMe theme={selectedTheme} onThemeChange={handleThemeChange} />} />
        <Route path="/foundermatch" element={<ProjectPage theme={selectedTheme} onThemeChange={handleThemeChange} />} />
        <Route path="/phone" element={<FlipPhone3D />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App