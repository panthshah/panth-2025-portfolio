import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  
  // Greetings cycle
  const greetings = [
    { text: "Namaste", lang: "Hindi" },
    { text: "Hola", lang: "Spanish" },
    { text: "Annyeong", lang: "Korean" },
    { text: "Bonjour", lang: "French" },
    { text: "Salaam", lang: "Urdu" }
  ];

  // Theme Colors for cycle (matched to the greetings order)
  const bgColors = [
    '#FFF8F3', // Peachy Orange (Namaste)
    '#F8F4FF', // Lavender Dream (Hola)
    '#FFF0F5', // Blush Petal (Annyeong)
    '#F0F8FF', // Sky (Bonjour)
    '#FFF5F5'  // Pastel Red (Salaam)
  ];

  useEffect(() => {
    // Cycle through greetings
    const intervalDuration = 800; // 0.8s per greeting
    
    const timer = setInterval(() => {
      setIndex(prev => {
        if (prev < greetings.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, intervalDuration);

    // Complete after all greetings + small buffer
    const totalDuration = (greetings.length * intervalDuration) + 400;
    const completeTimer = setTimeout(() => {
      onComplete();
    }, totalDuration);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, greetings.length]);

  const commonFontStyle = {
    fontFamily: "'Samsung Sharp Sans', system-ui, sans-serif",
    color: 'black',
    margin: 0,
    lineHeight: '1.1'
  };

  return (
    <motion.div
      initial={{ backgroundColor: bgColors[0] }}
      animate={{ backgroundColor: bgColors[index] }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Centered Content Container */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', // Aligns text to the left relative to each other
        justifyContent: 'center', // Centers vertically
      }}>
        <h1 style={{ 
          ...commonFontStyle,
          fontSize: 'clamp(80px, 18vw, 160px)', // Responsive: min 80px on mobile, max 160px on desktop
          fontWeight: '800',
        }}>
          hii.
        </h1>
        
        <div style={{ height: '40px', overflow: 'visible', width: '100%' }}> 
          <AnimatePresence mode="wait">
            <motion.h2 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ 
                ...commonFontStyle,
                fontSize: 'clamp(18px, 4vw, 28px)', // Responsive subtitle
                fontWeight: '700', 
                marginTop: '0px',
                paddingLeft: 'clamp(6px, 1.5vw, 12px)' // Responsive alignment
              }}
            >
              {greetings[index].text}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;