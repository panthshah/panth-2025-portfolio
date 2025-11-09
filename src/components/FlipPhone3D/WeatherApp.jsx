import { useState, useEffect, useRef } from 'react';
import { X, MagnifyingGlass, Sun, CloudRain, Cloud, Moon, CloudMoon } from '@phosphor-icons/react';

// Weather App Component (Full Screen)
const WeatherApp = ({ onClose, currentWeather, currentLocation }) => {
  const [searchCity, setSearchCity] = useState('');
  const [cities, setCities] = useState([
    { name: currentLocation, temp: currentWeather.temp, condition: currentWeather.condition, iconType: 'sun', isDay: true }
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(true);
  const hasLoadedDefaults = useRef(false);

  // Fetch city suggestions as user types
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setSuggestions(data.results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchCity(value);
  };

  // Debounced effect to fetch suggestions
  useEffect(() => {
    if (searchCity.length >= 3) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions(searchCity);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchCity]);

  // Fetch real weather for default cities on mount
  useEffect(() => {
    const fetchDefaultCities = async () => {
      // Only run once using ref
      if (hasLoadedDefaults.current) {
        return;
      }
      
      hasLoadedDefaults.current = true;

      const defaultLocations = [
        { name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'USA' },
        { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'UK' }
      ];

      const weatherPromises = defaultLocations.map(async (location) => {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&temperature_unit=fahrenheit&timezone=auto`
          );
          const data = await response.json();
          return {
            location,
            weather: data.current_weather
          };
        } catch (error) {
          console.error(`Error fetching weather for ${location.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(weatherPromises);
      const newCities = results
        .filter(result => result !== null)
        .map(result => {
          const { location, weather } = result;
          const temp = Math.round(weather.temperature);
          const weatherCode = weather.weathercode;
          const isDay = weather.is_day === 1;
          
          const weatherInfo = getWeatherInfo(weatherCode, isDay);
          
          return {
            name: `${location.name}, ${location.country}`,
            temp,
            condition: weatherInfo.condition,
            iconType: weatherInfo.iconType,
            isDay
          };
        });

      setCities(prevCities => [...prevCities, ...newCities]);
      setIsLoadingDefaults(false);
    };

    fetchDefaultCities();
  }, []);

  // Helper function to map weather codes to conditions and icons
  const getWeatherInfo = (weatherCode, isDay) => {
    const weatherMap = {
      0: { condition: isDay ? 'Clear' : 'Clear Night', iconType: isDay ? 'sun' : 'moon' },
      1: { condition: isDay ? 'Mainly Clear' : 'Mainly Clear', iconType: isDay ? 'sun' : 'moon' },
      2: { condition: 'Partly Cloudy', iconType: isDay ? 'cloud' : 'cloudmoon' },
      3: { condition: 'Overcast', iconType: 'cloud' },
      45: { condition: 'Foggy', iconType: 'cloud' },
      48: { condition: 'Depositing Rime Fog', iconType: 'cloud' },
      51: { condition: 'Light Drizzle', iconType: 'rain' },
      53: { condition: 'Moderate Drizzle', iconType: 'rain' },
      55: { condition: 'Dense Drizzle', iconType: 'rain' },
      56: { condition: 'Light Freezing Drizzle', iconType: 'rain' },
      57: { condition: 'Dense Freezing Drizzle', iconType: 'rain' },
      61: { condition: 'Slight Rain', iconType: 'rain' },
      63: { condition: 'Moderate Rain', iconType: 'rain' },
      65: { condition: 'Heavy Rain', iconType: 'rain' },
      66: { condition: 'Light Freezing Rain', iconType: 'rain' },
      67: { condition: 'Heavy Freezing Rain', iconType: 'rain' },
      71: { condition: 'Slight Snow', iconType: 'cloud' },
      73: { condition: 'Moderate Snow', iconType: 'cloud' },
      75: { condition: 'Heavy Snow', iconType: 'cloud' },
      77: { condition: 'Snow Grains', iconType: 'cloud' },
      80: { condition: 'Slight Rain Showers', iconType: 'rain' },
      81: { condition: 'Moderate Rain Showers', iconType: 'rain' },
      82: { condition: 'Violent Rain Showers', iconType: 'rain' },
      85: { condition: 'Slight Snow Showers', iconType: 'cloud' },
      86: { condition: 'Heavy Snow Showers', iconType: 'cloud' },
      95: { condition: 'Thunderstorm', iconType: 'rain' },
      96: { condition: 'Thunderstorm with Slight Hail', iconType: 'rain' },
      99: { condition: 'Thunderstorm with Heavy Hail', iconType: 'rain' }
    };

    return weatherMap[weatherCode] || { condition: isDay ? 'Clear' : 'Clear Night', iconType: isDay ? 'sun' : 'moon' };
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = async (location) => {
    const { latitude, longitude, name, country } = location;
    setSearchCity('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(true);

    try {
      // Fetch weather data for the selected location
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&timezone=auto`
      );
      const weatherData = await weatherResponse.json();
      
      const temp = Math.round(weatherData.current_weather.temperature);
      const weatherCode = weatherData.current_weather.weathercode;
      const isDay = weatherData.current_weather.is_day === 1;
      
      const weatherInfo = getWeatherInfo(weatherCode, isDay);
      
      const newCity = {
        name: country ? `${name}, ${country}` : name,
        temp: temp,
        condition: weatherInfo.condition,
        iconType: weatherInfo.iconType,
        isDay
      };
      
      setCities([...cities, newCity]);
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert(`Unable to fetch weather data: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const getWeatherIcon = (iconType) => {
    switch (iconType) {
      case 'sun':
        return <Sun size={24} weight="fill" color="#000" />;
      case 'moon':
        return <Moon size={24} weight="fill" color="#000" />;
      case 'cloud':
        return <Cloud size={24} weight="fill" color="#000" />;
      case 'cloudmoon':
        return <CloudMoon size={24} weight="fill" color="#000" />;
      case 'rain':
        return <CloudRain size={24} weight="fill" color="#000" />;
      default:
        return <Sun size={24} weight="fill" color="#000" />;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'transparent',
      borderRadius: '24px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 20,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h2 style={{
          color: '#000',
          fontSize: '18px',
          fontWeight: '700',
          fontFamily: 'Satoshi, -apple-system, sans-serif',
          margin: 0
        }}>Weather</h2>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={24} color="#000" weight="bold" />
        </button>
      </div>

      {/* Search Bar Container */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'transparent',
          borderRadius: '48px',
          padding: '2px 16px',
          alignItems: 'center',
          border: '1px solid #000'
        }}>
          <MagnifyingGlass size={20} color="#000" weight="regular" />
          <input
            type="text"
            value={searchCity}
            onChange={handleInputChange}
            placeholder={isSearching ? 'searching...' : 'search city'}
            disabled={isSearching}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontFamily: 'Satoshi, -apple-system, sans-serif',
              fontWeight: '600',
              outline: 'none',
              color: '#000',
              opacity: isSearching ? 0.5 : 1
            }}
          />
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            background: '#fff',
            border: '1px solid #000',
            borderRadius: '16px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 100,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="suggestions-dropdown"
          >
            <style>{`
              .suggestions-dropdown::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#000',
                  fontFamily: 'Satoshi, -apple-system, sans-serif',
                  marginBottom: '2px'
                }}>
                  {suggestion.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  fontFamily: 'Satoshi, -apple-system, sans-serif'
                }}>
                  {suggestion.admin1 && `${suggestion.admin1}, `}{suggestion.country}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cities List - Scrollable */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingBottom: '80px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="weather-scroll-container"
      >
        <style>{`
          .weather-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {cities.map((city, index) => (
          <div
            key={index}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '2px solid #000'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {getWeatherIcon(city.iconType)}
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#000',
                  fontFamily: 'Satoshi, -apple-system, sans-serif',
                  marginBottom: '2px'
                }}>
                  {city.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  fontFamily: 'Satoshi, -apple-system, sans-serif'
                }}>
                  {city.condition}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#000',
              fontFamily: 'Satoshi, -apple-system, sans-serif'
            }}>
              {city.temp}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;

