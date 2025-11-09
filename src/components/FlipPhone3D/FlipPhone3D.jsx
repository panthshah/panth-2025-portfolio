import { useState, useEffect } from 'react';
import bgImage from '../../assets/bg.png';
import dayViewBg from '../../assets/Day View.png';
import nightViewBg from '../../assets/Night View.png';
import rainyBg from '../../assets/Raining.png';
import GalleryWidget from './GalleryWidget';
import WeatherApp from './WeatherApp';
import CalculatorApp from './CalculatorApp';
import NotesWidget from './NotesWidget';
import NotesApp from './NotesApp';

const FlipPhone3D = () => {
  // Helper function to check if it's currently day based on local time
  const isCurrentlyDay = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18; // Day is between 6 AM and 6 PM
  };

  const [weather, setWeather] = useState({
    temp: 72,
    condition: 'Partly Cloudy',
    icon: isCurrentlyDay() ? '⛅' : '☁️',
  });
  const [weatherBackground, setWeatherBackground] = useState(isCurrentlyDay() ? dayViewBg : nightViewBg);
  const [location, setLocation] = useState('Loading...');
  const [activeApp, setActiveApp] = useState('home');
  const [time, setTime] = useState(new Date());
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = first screen, 1 = second screen
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [notesRefresh, setNotesRefresh] = useState(0);

  // Function to determine weather background
  const getWeatherBackground = (condition, isDay) => {
    const rainyConditions = ['Rain', 'Drizzle', 'Thunderstorm', 'rain', 'drizzle', 'thunderstorm'];
    const isRainy = rainyConditions.some(word => condition.includes(word));
    
    if (isRainy) return rainyBg;
    if (!isDay) return nightViewBg;
    return dayViewBg;
  };

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
            const isDay = weatherData.current_weather.is_day === 1;
            
            // Weather mapping with day/night variants
            const getWeatherInfo = (code, isDay) => {
              const weatherMap = {
                0: { 
                  condition: isDay ? 'Clear' : 'Clear Night', 
                  icon: isDay ? '☀️' : '🌙' 
                },
                1: { 
                  condition: isDay ? 'Mainly Clear' : 'Mostly Clear', 
                  icon: isDay ? '🌤️' : '🌙' 
                },
                2: { 
                  condition: 'Partly Cloudy', 
                  icon: isDay ? '⛅' : '☁️' 
                },
                3: { 
                  condition: 'Overcast', 
                  icon: '☁️' 
                },
                45: { 
                  condition: 'Foggy', 
                  icon: '🌫️' 
                },
                48: { 
                  condition: 'Foggy', 
                  icon: '🌫️' 
                },
                51: { 
                  condition: 'Light Drizzle', 
                  icon: '🌦️' 
                },
                61: { 
                  condition: 'Light Rain', 
                  icon: '🌧️' 
                },
                80: { 
                  condition: 'Rain Showers', 
                  icon: '🌧️' 
                },
                95: { 
                  condition: 'Thunderstorm', 
                  icon: '⛈️' 
                },
              };
              return weatherMap[code] || { condition: 'Partly Cloudy', icon: isDay ? '⛅' : '☁️' };
            };

            const weatherInfo = getWeatherInfo(weatherCode, isDay);
            
            setWeather({
              temp,
              ...weatherInfo,
            });
            
            // Set weather background based on condition
            setWeatherBackground(getWeatherBackground(weatherInfo.condition, isDay));
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

  // Swipe handlers for screen navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    if (activeApp !== 'home') return; // Only allow swipe on home screen
    setTouchEnd(null);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
  };

  const onTouchMove = (e) => {
    if (activeApp !== 'home') return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setTouchEnd(clientX);
  };

  const onTouchEnd = () => {
    if (activeApp !== 'home' || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentScreen < 1) {
      // Swipe left to go to next screen
      handleScreenChange(currentScreen + 1);
    } else if (isRightSwipe && currentScreen > 0) {
      // Swipe right to go to previous screen
      handleScreenChange(currentScreen - 1);
    }
  };

  const handleScreenChange = (newScreen) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentScreen(newScreen);
    setTimeout(() => setIsTransitioning(false), 300);
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
        <div 
          style={{
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
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
          onMouseLeave={onTouchEnd}
        >
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

          {/* Swipeable Widgets Container (only widgets swipe, bottom stays fixed) */}
          {activeApp === 'home' && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: 0,
              right: 0,
              display: 'flex',
              transform: `translateX(-${currentScreen * 100}%)`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
              zIndex: 10
            }}>
              {/* Screen 1 - Main */}
              <div style={{
                minWidth: '100%',
                width: '100%',
                maxWidth: '100%',
                position: 'relative',
                padding: '0 16px',
                boxSizing: 'border-box'
              }}>
                {/* Widgets Container - 1 Row, 2 Columns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                width: '100%'
              }}>
                {/* Weather Widget */}
                <div 
                onClick={() => setActiveApp('weather')}
                style={{
                  backgroundImage: `url(${weatherBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '16px',
                  padding: '10px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  minHeight: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  width: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
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
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}>
                    {weather.icon}
                  </div>

                  {/* Temperature */}
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#fff',
                    fontFamily: 'Satoshi, -apple-system, sans-serif',
                    marginBottom: '16px',
                    letterSpacing: '-1px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    {weather.temp}°
                  </div>

                  {/* Condition */}
                  <div style={{
                    fontSize: '12px',
                    color: '#fff',
                    fontFamily: 'Satoshi, -apple-system, sans-serif',
                    fontWeight: '600',
                    marginBottom: '6px',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                  }}>
                    {weather.condition}
                  </div>

                  {/* Location */}
                  <div style={{
                    fontSize: '11px',
                    color: '#fff',
                    fontFamily: 'Satoshi, -apple-system, sans-serif',
                    fontWeight: '600',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                  }}>
                    {location}
                  </div>
                </div>

                {/* Gallery Widget */}
                <GalleryWidget />
              </div>
            </div>

            {/* Screen 2 - Calculator & More */}
            <div style={{
              minWidth: '100%',
              width: '100%',
              maxWidth: '100%',
              position: 'relative',
              padding: '0 16px',
              boxSizing: 'border-box'
            }}>
              {/* Widgets Container - Screen 2 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                width: '100%'
              }}>
                {/* Calculator Widget */}
                <div 
                onClick={() => setActiveApp('calculator')}
                style={{
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
                  backdropFilter: 'blur(10px)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {/* Buttons Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    {/* Left side - Plus and Minus buttons */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      {/* Plus Button */}
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#2a2a2e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '600',
                        fontFamily: 'Satoshi, -apple-system, sans-serif'
                      }}>+</div>
                      
                      {/* Minus Button */}
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#2a2a2e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '600',
                        fontFamily: 'Satoshi, -apple-system, sans-serif'
                      }}>−</div>
                    </div>

                    {/* Right side - Equals button */}
                    <div style={{
                      width: '32px',
                      height: '58px',
                      borderRadius: '32px',
                      background: '#4CAF50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '18px',
                      fontWeight: '600',
                      fontFamily: 'Satoshi, -apple-system, sans-serif'
                    }}>=</div>
                  </div>

                  {/* Calculator Label */}
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#2a2a2e',
                    fontFamily: 'Satoshi, -apple-system, sans-serif'
                  }}>Calculator</div>
                </div>

                {/* Notes Widget */}
                <NotesWidget 
                  key={notesRefresh}
                  onClick={() => setActiveApp('notes')} 
                />
              </div>
            </div>
          </div>
          )}

          {/* Screen Indicator Dots - Above Time & Camera */}
          {activeApp === 'home' && (
            <div style={{
              position: 'absolute',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 15
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: currentScreen === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: currentScreen === 1 ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }} />
            </div>
          )}

          {/* Time & Date Widget - Fixed at Bottom (doesn't swipe) */}
          {activeApp === 'home' && (
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 20
            }}>
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
          )}

        {/* Weather App - Full Screen */}
        {activeApp === 'weather' && (
          <WeatherApp 
            onClose={() => setActiveApp('home')}
            currentWeather={weather}
            currentLocation={location}
          />
        )}

        {/* Calculator App - Full Screen */}
        {activeApp === 'calculator' && (
          <CalculatorApp 
            onClose={() => setActiveApp('home')}
          />
        )}

        {/* Notes App - Full Screen */}
        {activeApp === 'notes' && (
          <NotesApp 
            onClose={() => setActiveApp('home')}
            onNoteSaved={() => setNotesRefresh(prev => prev + 1)}
          />
        )}

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
    </div>
  );
};

export default FlipPhone3D;

