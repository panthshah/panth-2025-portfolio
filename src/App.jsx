import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import ThemeSelection from './components/ThemeSelection';
import { precompileShaders } from './utils/shaderPreloader';

function App() {
  const [currentPage, setCurrentPage] = useState('splash');

  // Pre-compile shaders on app start
  useEffect(() => {
    // Small delay to ensure Three.js is ready
    const timer = setTimeout(() => {
      try {
        precompileShaders();
      } catch (error) {
        console.error('Shader precompilation failed:', error);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSplashComplete = () => {
    setCurrentPage('theme');
  };

  const handleThemeSelect = (theme) => {
    console.log('Selected theme:', theme);
    // You can add navigation to the next page here
  };

  return (
    <div className="App">
      {currentPage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {currentPage === 'theme' && <ThemeSelection onThemeSelect={handleThemeSelect} />}
    </div>
  )
}

export default App