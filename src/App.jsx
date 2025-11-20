import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import ThemeSelection from './components/ThemeSelection';
import FlipPhone3D from './components/FlipPhone3D';
import LandingPage from './components/LandingPage';
import AboutMe from './components/AboutMe';
import ProjectPage from './components/ProjectPage';
import { precompileShaders } from './utils/shaderPreloader';

function App() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  // Pre-compile shaders on app start
  useEffect(() => {
    try {
      precompileShaders();
    } catch (error) {
      console.error('Shader precompilation failed:', error);
    }
  }, []);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setSelectedTheme(parsedTheme);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  // Update theme without navigating (for modal)
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App