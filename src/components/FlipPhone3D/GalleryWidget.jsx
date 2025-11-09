import { useState } from 'react';
import panth1 from '../../assets/panth.png';
import panth3 from '../../assets/panth3.png';
import panth4 from '../../assets/panth4.png';
import panth5 from '../../assets/panth5.png';

// Gallery Widget Component with Swipe - Stacked Cards
const GalleryWidget = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Actual images from assets
  const galleryImages = [
    { id: 1, src: panth1, alt: 'Photo 1' },
    { id: 3, src: panth3, alt: 'Photo 3' },
    { id: 4, src: panth4, alt: 'Photo 4' },
    { id: 5, src: panth5, alt: 'Photo 5' }
  ];

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSwipeDirection('left');
    setTimeout(() => {
      setCurrentImageIndex((prev) => 
        prev === galleryImages.length - 1 ? 0 : prev + 1
      );
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSwipeDirection('right');
    setTimeout(() => {
      setCurrentImageIndex((prev) => 
        prev === 0 ? galleryImages.length - 1 : prev - 1
      );
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const getNextIndex = () => {
    return currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1;
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '16px',
      padding: '10px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      minHeight: '90px',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(10px)',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}
    >
      {/* Stacked Images Display */}
      <div style={{
        width: '100%',
        height: '60px',
        borderRadius: '10px',
        marginBottom: '6px',
        position: 'relative',
        overflow: 'visible',
        paddingBottom: '8px'
      }}>
        {/* Render all cards in stack */}
        {galleryImages.map((image, index) => {
          const offset = (galleryImages.length - 1 - ((currentImageIndex - index + galleryImages.length) % galleryImages.length));
          const isTopCard = index === currentImageIndex;
          
          return (
            <div
              key={image.id}
              style={{
                position: 'absolute',
                top: `${offset * 3}px`,
                left: 0,
                right: 0,
                height: '60px',
                borderRadius: '10px',
                overflow: 'hidden',
                zIndex: isTopCard ? 10 : offset,
                boxShadow: isTopCard ? '0 6px 16px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.1)',
                transform: isTopCard && swipeDirection === 'left' 
                  ? 'translateX(-120%) rotate(-15deg)' 
                  : isTopCard && swipeDirection === 'right' 
                  ? 'translateX(120%) rotate(15deg)' 
                  : `translateY(0) rotate(${offset * -1}deg) scale(${1 - offset * 0.02})`,
                opacity: isTopCard && swipeDirection ? 0 : 1,
                transition: isTopCard 
                  ? 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s ease'
                  : 'transform 0.4s ease, z-index 0s',
                transformOrigin: 'center bottom'
              }}
            >
              <img 
                src={image.src}
                alt={image.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none'
                }}
              />
            </div>
          );
        })}
        
        {/* Swipe indicators */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '8px',
          transform: 'translateY(-50%)',
          fontSize: '16px',
          color: 'white',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: 0.9,
          transition: 'opacity 0.2s',
          zIndex: 10
        }} 
        onClick={handlePrev}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
        >‹</div>
        
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '8px',
          transform: 'translateY(-50%)',
          fontSize: '16px',
          color: 'white',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: 0.9,
          transition: 'opacity 0.2s',
          zIndex: 10
        }} 
        onClick={handleNext}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
        >›</div>
      </div>

      {/* Gallery Label & Dots */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#2a2a2e',
          fontFamily: 'Satoshi, -apple-system, sans-serif'
        }}>Gallery</div>

        {/* Dots Indicator */}
        <div style={{
          display: 'flex',
          gap: '4px'
        }}>
          {galleryImages.map((_, index) => (
            <div key={index} style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: index === currentImageIndex ? '#2a2a2e' : '#ccc',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryWidget;

