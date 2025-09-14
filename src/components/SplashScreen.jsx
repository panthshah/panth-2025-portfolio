import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import plantImage from '../assets/image1.png';

const SplashScreen = ({ onComplete }) => {
  const greetings = [
    'Hello',
    'नमस्ते', 
    'Hola',
    'Bonjour',
    'こんにちは'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    }, 800);

    // Navigate to theme selection after 4 seconds
    const timeout = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [greetings.length, onComplete]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Text */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: '24px',
                fontFamily: 'Inclusive Sans, system-ui, sans-serif',
                color: '#348402',
                fontWeight: '500',
                lineHeight: '24px'
              }}
            >
              {greetings[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;