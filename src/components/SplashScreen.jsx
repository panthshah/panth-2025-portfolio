import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlushFace from '../assets/BlushFace.svg';
import BrandStyleFace from '../assets/BrandStyleFace.svg';
import DifferentFace from '../assets/DifferentFace.svg';
import SmilingSpectaclesFace from '../assets/SmilingSpectaclesFace.svg';

const faces = [
  { src: BrandStyleFace, bg: '#FCEFD7' },
  { src: DifferentFace, bg: '#7BEFF7' },
  { src: SmilingSpectaclesFace, bg: '#C4F77B' },
  { src: BlushFace, bg: '#FECE73' },
];

const FACE_DURATION = 600;

const entranceVariants = [
  {
    enter: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
    },
    exit: { opacity: 0, scale: 1.08, transition: { duration: 0.2, ease: 'easeIn' } },
  },
  {
    enter: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: { opacity: 0, x: -40, transition: { duration: 0.2, ease: 'easeIn' } },
  },
  {
    enter: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
    },
    exit: { opacity: 0, y: 30, transition: { duration: 0.2, ease: 'easeIn' } },
  },
  {
    enter: { opacity: 0, scale: 0.9, rotate: -8 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
    },
    exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
  },
];

const SplashScreen = ({ onComplete }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev < faces.length - 1 ? prev + 1 : prev));
    }, FACE_DURATION);

    const completeTimer = setTimeout(onComplete, faces.length * FACE_DURATION + 300);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ backgroundColor: faces[0].bg }}
      animate={{ backgroundColor: faces[index].bg }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={faces[index].src}
          alt=""
          variants={entranceVariants[index]}
          initial="enter"
          animate="visible"
          exit="exit"
          draggable={false}
          style={{
            width: 'clamp(160px, 28vw, 260px)',
            height: 'auto',
            willChange: 'transform, opacity',
          }}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default SplashScreen;
