import { useState, useEffect } from 'react';
import bgImage from '../assets/bg.png';
import panth1 from '../assets/panth.png';
import panth3 from '../assets/panth3.png';
import panth4 from '../assets/panth4.png';
import panth5 from '../assets/panth5.png';

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
      overflow: 'hidden'
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

const FlipPhone3D = () => {
  const [weather, setWeather] = useState({
    temp: 72,
    condition: 'Partly Cloudy',
    icon: '⛅',
  });
  const [location, setLocation] = useState('Loading...');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    // Get user's location and weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get city name
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const geoData = await geoResponse.json();
            setLocation(`${geoData.city || geoData.locality}, ${geoData.countryCode}`);

            // Get weather data
            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`
            );
            const weatherData = await weatherResponse.json();
            
            const temp = Math.round(weatherData.current_weather.temperature);
            const weatherCode = weatherData.current_weather.weathercode;
            
            const weatherMap = {
              0: { condition: 'Clear', icon: '☀️' },
              1: { condition: 'Mainly Clear', icon: '🌤️' },
              2: { condition: 'Partly Cloudy', icon: '⛅' },
              3: { condition: 'Overcast', icon: '☁️' },
              45: { condition: 'Foggy', icon: '🌫️' },
              48: { condition: 'Foggy', icon: '🌫️' },
              51: { condition: 'Light Drizzle', icon: '🌦️' },
              61: { condition: 'Light Rain', icon: '🌧️' },
              80: { condition: 'Rain Showers', icon: '🌧️' },
              95: { condition: 'Thunderstorm', icon: '⛈️' },
            };

            const weatherInfo = weatherMap[weatherCode] || weatherMap[2];
            
            setWeather({
              temp,
              ...weatherInfo,
            });
          } catch (error) {
            console.error('Weather fetch error:', error);
            setLocation('San Francisco, US');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocation('San Francisco, US');
        }
      );
    }
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = () => {
    return time.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      width: '380px', 
      height: '400px', 
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      transformOrigin: 'center center'
    }}>
      {/* Phone Mockup Container */}
      <div style={{
        width: '370px',
        height: '400px',
        background: 'linear-gradient(135deg, #4158D0 0%, #5B6DD8 30%, #7B8DE8 60%, #5B6DD8 100%)',
        borderRadius: '12px',
        position: 'relative',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
        padding: '8px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {/* Hinge Line - Top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.3) 80%, transparent 100%)',
          borderRadius: '2px',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
        }} />
        
        {/* Glassy Shine - Left */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '10px',
          bottom: '10px',
          width: '10px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
          borderRadius: '8px 0 0 8px'
        }} />
        
        {/* Glassy Shine - Right */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: '10px',
          bottom: '10px',
          width: '10px',
          background: 'linear-gradient(270deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
          borderRadius: '0 8px 8px 0'
        }} />
        {/* Screen Content */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '6px',
          position: 'relative',
          overflow: 'hidden',
          border: '3px solid #0a0a0a',
          boxShadow: `
            0 0 40px rgba(255,255,255,0.2),
            0 0 80px rgba(255,255,255,0.1),
            inset 0 0 60px rgba(255,255,255,0.05),
            inset 0 2px 4px rgba(255,255,255,0.1),
            0 8px 16px rgba(0,0,0,0.3)
          `
        }}>
          {/* Glossy Screen Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.15) 0%,
                rgba(255,255,255,0.05) 30%,
                rgba(255,255,255,0) 50%,
                rgba(0,0,0,0.02) 70%,
                rgba(0,0,0,0.05) 100%
              )
            `,
            pointerEvents: 'none',
            zIndex: 5
          }} />
          
          {/* Light Emission Glow */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            right: '-10%',
            bottom: '-10%',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 4
          }} />

          {/* Subtle Screen Reflection */}
          <div style={{
            position: 'absolute',
            top: '5%',
            left: '10%',
            width: '40%',
            height: '30%',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 6
          }} />

          {/* Subtle Center Fold Line (shows this is the outer screen of a folded phone) */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.08) 80%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 3,
            transform: 'translateX(-0.5px)'
          }} />

          {/* Widgets Container - 1 Row, 2 Columns */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '16px',
            right: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            zIndex: 10
          }}>
            {/* Weather Widget */}
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
              position: 'relative',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Weather Icon */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '10px',
                fontSize: '24px',
                opacity: 0.9
              }}>
                {weather.icon}
              </div>

              {/* Temperature */}
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#2a2a2e',
                fontFamily: 'Satoshi, -apple-system, sans-serif',
                marginBottom: '4px',
                letterSpacing: '-1px'
              }}>
                {weather.temp}°
              </div>

              {/* Condition */}
              <div style={{
                fontSize: '9px',
                color: '#666',
                fontFamily: 'Satoshi, -apple-system, sans-serif',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {weather.condition}
              </div>

              {/* Location */}
              <div style={{
                fontSize: '8px',
                color: '#999',
                fontFamily: 'Satoshi, -apple-system, sans-serif',
                fontWeight: '600'
              }}>
                {location}
              </div>
            </div>

            {/* Gallery Widget */}
            <GalleryWidget />
          </div>
        </div>

        {/* Time & Date Widget - Bottom Left of Camera */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 20
        }}>
          {/* Time and Weather Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '2px'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#fff',
              fontFamily: 'Satoshi, -apple-system, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              letterSpacing: '-0.5px'
            }}>
              {formatTime()}
            </span>
            <span style={{
              fontSize: '22px',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))'
            }}>
              {weather.icon}
            </span>
          </div>
          {/* Date */}
          <div style={{
            fontSize: '12px',
            color: '#fff',
            fontFamily: 'Satoshi, -apple-system, sans-serif',
            fontWeight: '600',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)'
          }}>
            {formatDate()}
          </div>
        </div>

        {/* Camera Section - Overlaid on Screen */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '15px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          zIndex: 20
        }}>
          {/* Flash LED */}
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, #fffef0 0%, #f5f3e0 40%, #d4d2c0 100%)',
            border: '2px solid #2a2a2e',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '3px',
              left: '3px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)'
            }} />
          </div>
          
          {/* Camera 1 - Main */}
          <div style={{
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4a4a50 0%, #2a2a2e 100%)',
            border: '3px solid #3a3a3e',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6), inset 0 2px 4px rgba(0,0,0,0.8)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Outer ring */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 45% 45%, #1a1a1e 0%, #0a0a0a 70%)',
              border: '1px solid #555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.9)'
            }}>
              {/* Lens center */}
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #1a4d8f 0%, #0a1a2e 50%, #000 100%)',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)'
              }}>
                {/* Lens reflection */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'rgba(135,206,235,0.5)',
                  filter: 'blur(0.5px)'
                }} />
              </div>
            </div>
          </div>

          {/* Camera 2 - Secondary */}
          <div style={{
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4a4a50 0%, #2a2a2e 100%)',
            border: '3px solid #3a3a3e',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6), inset 0 2px 4px rgba(0,0,0,0.8)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Outer ring */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 45% 45%, #1a1a1e 0%, #0a0a0a 70%)',
              border: '1px solid #555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.9)'
            }}>
              {/* Lens center */}
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #1a4d8f 0%, #0a1a2e 50%, #000 100%)',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)'
              }}>
                {/* Lens reflection */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'rgba(135,206,235,0.5)',
                  filter: 'blur(0.5px)'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipPhone3D;
