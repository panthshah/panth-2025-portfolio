import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import ThemeSelection from './components/ThemeSelection';
import FlipPhone3D from './components/FlipPhone3D';
import LandingPage from './components/LandingPage';
import AboutMe from './components/AboutMe';
import { precompileShaders } from './utils/shaderPreloader';

function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [selectedTheme, setSelectedTheme] = useState(null);

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

  const handleSplashComplete = () => {
    setCurrentPage('theme');
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setCurrentPage('landing');
  };

  const handleNavigateToTheme = () => {
    setCurrentPage('theme');
  };

  // Update theme without navigating (for modal)
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleNavigateToAbout = () => {
    setCurrentPage('about');
  };

  const handleBackFromAbout = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="App">
      {currentPage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {currentPage === 'theme' && <ThemeSelection onThemeSelect={handleThemeSelect} selectedTheme={selectedTheme} />}
      {currentPage === 'landing' && <LandingPage theme={selectedTheme} onNavigateToTheme={handleNavigateToTheme} onThemeChange={handleThemeChange} onNavigateToAbout={handleNavigateToAbout} />}
      {currentPage === 'about' && <AboutMe theme={selectedTheme} onBack={handleBackFromAbout} onThemeChange={handleThemeChange} />}
      {currentPage === 'phone' && <FlipPhone3D />}
    </div>
  )
}

export default App