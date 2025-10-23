import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import ThemeSelection from './components/ThemeSelection';
import FlipPhone3D from './components/FlipPhone3D';
import LandingPage from './components/LandingPage';
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

  return (
    <div className="App">
      {currentPage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {currentPage === 'theme' && <ThemeSelection onThemeSelect={handleThemeSelect} selectedTheme={selectedTheme} />}
      {currentPage === 'landing' && <LandingPage theme={selectedTheme} onNavigateToTheme={handleNavigateToTheme} />}
      {currentPage === 'phone' && <FlipPhone3D />}
    </div>
  )
}

export default App