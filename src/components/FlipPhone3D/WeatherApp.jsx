import { useState, useEffect } from 'react';
import { CaretLeft, Moon, Sun, Cloud, CloudRain, CloudLightning, Wind, Drop } from '@phosphor-icons/react';

const WeatherApp = ({ onClose, currentWeather, currentLocation, background }) => {
  const [hourlyForecast, setHourlyForecast] = useState([]);

  useEffect(() => {
    if (currentWeather?.hourly) {
      const now = new Date();
      const currentHourISO = now.toISOString().slice(0, 13); // Match YYYY-MM-DDTHH format roughly
      
      // Find index of current hour. API returns local time if timezone=auto, but format is ISO-like "2023-11-27T14:00"
      // Use simple comparison or find closest time
      const currentHour = now.getHours();
      const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
      
      // Open-Meteo returns time in local timezone but ISO format string.
      // We'll just find the index that matches the current hour approx or just start from current time index
      
      // Simpler approach: The API returns data starting from 00:00 today (usually) or past days.
      // We can just find the entry where the time string matches our current hour.
      
      const hourlyData = currentWeather.hourly;
      const startIndex = hourlyData.time.findIndex(t => {
        const tDate = new Date(t);
        return tDate.getHours() === currentHour && tDate.getDate() === now.getDate();
      });

      if (startIndex !== -1) {
        const next24Hours = [];
        for (let i = startIndex; i < startIndex + 24 && i < hourlyData.time.length; i++) {
          const timeStr = hourlyData.time[i];
          const temp = Math.round(hourlyData.temperature_2m[i]);
          const code = hourlyData.weathercode[i];
          const isDay = hourlyData.is_day[i] === 1;
          
          // Format time
          const date = new Date(timeStr);
          const hour = date.getHours();
          const formattedTime = i === startIndex ? 'Now' : date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          
          next24Hours.push({
            time: formattedTime,
            temp,
            icon: getWeatherIcon(code, isDay)
          });
        }
        setHourlyForecast(next24Hours);
      }
    } else {
      // Fallback mock data if no hourly data
      setHourlyForecast([
        { time: 'Now', temp: currentWeather.temp, icon: currentWeather.icon },
        { time: '1 PM', temp: currentWeather.temp + 1, icon: '☀️' },
        { time: '2 PM', temp: currentWeather.temp + 2, icon: '☀️' },
        { time: '3 PM', temp: currentWeather.temp + 1, icon: '⛅' },
        { time: '4 PM', temp: currentWeather.temp - 1, icon: '⛅' },
      ]);
    }
  }, [currentWeather]);

  const getWeatherIcon = (code, isDay) => {
    const weatherMap = {
      0: isDay ? '☀️' : '🌙',
      1: isDay ? '🌤️' : '🌙',
      2: isDay ? '⛅' : '☁️',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌦️',
      61: '🌧️',
      80: '🌧️',
      95: '⛈️',
    };
    return weatherMap[code] || (isDay ? '⛅' : '☁️');
  };

  // Get formatted date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '6px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      overflow: 'hidden',
      color: '#fff',
      fontFamily: '"Samsung One", -apple-system, sans-serif'
    }}>
      {/* Header / Back Button */}
      <div style={{ 
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <CaretLeft size={24} weight="bold" />
        </button>
      </div>

      {/* Main Content - Scrollable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '20px'
      }}
      className="weather-scroll-container"
      >
        <style>{`
          .weather-scroll-container::-webkit-scrollbar {
            display: none;
          }
          .weather-scroll-container {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .horizontal-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Main Weather Info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '24px',
          width: '100%'
        }}>
          {/* Icon */}
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '4px',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))'
          }}>
            {currentWeather.icon}
          </div>

          {/* Temperature */}
          <div style={{
            fontSize: '72px',
            fontWeight: '400',
            lineHeight: '1',
            marginBottom: '8px',
            letterSpacing: '-2px'
          }}>
            {currentWeather.temp}°
          </div>

          {/* Location */}
          <div style={{
            fontSize: '18px',
            fontWeight: '500',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>📍</span> {currentLocation.split(',')[0]}
          </div>

          {/* High/Low */}
          <div style={{
            fontSize: '14px',
            opacity: 0.9,
            fontWeight: '400'
          }}>
            {currentWeather.temp + 10}° / {currentWeather.temp - 8}° Feels like {currentWeather.temp}°
          </div>
        </div>

        {/* Summary Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          width: 'calc(100% - 32px)', // Full width minus margins
          padding: '16px',
          marginBottom: '16px',
          backdropFilter: 'blur(10px)',
          boxSizing: 'border-box' // Ensure padding doesn't expand width
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            {currentWeather.condition} right now. High of {currentWeather.temp + 10}° today.
          </div>
        </div>

        {/* Hourly Forecast */}
        <div style={{
          width: '100%',
          paddingLeft: '16px',
          boxSizing: 'border-box'
        }}>
          <div 
            className="horizontal-scroll"
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              paddingRight: '16px',
              paddingBottom: '10px'
            }}
          >
            {hourlyForecast.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '40px'
              }}>
                <div style={{ 
                  fontSize: '13px', 
                  marginBottom: '8px', 
                  opacity: 0.9,
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}>
                  {item.time}
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  marginBottom: '8px', 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' 
                }}>
                  {item.icon}
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  {item.temp}°
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div style={{
          width: 'calc(100% - 32px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '10px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wind size={16} /> Wind
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>8 mph</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Drop size={16} /> Humidity
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>45%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;