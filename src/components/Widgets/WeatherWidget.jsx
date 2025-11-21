import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Wind, CloudSnow, CloudDrizzle, Zap, Eye } from 'lucide-react'

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'Sunny',
    location: 'Ahmedabad',
    humidity: 65,
    wind: 12,
    description: 'Clear sky',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Replace with your OpenWeatherMap API key
  const API_KEY = 'YOUR_API_KEY_HERE' // Get free key from https://openweathermap.org/api
  const CITY = 'Ahmedabad'
  const COUNTRY = 'IN'

  useEffect(() => {
    fetchWeather()
    // Update weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&appid=${API_KEY}&units=metric`
      )
      
      if (!response.ok) {
        throw new Error('Weather data unavailable')
      }

      const data = await response.json()
      
      setWeather({
        temp: Math.round(data.main.temp),
        condition: getConditionName(data.weather[0].main),
        location: data.name,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        description: data.weather[0].description,
      })
      setLoading(false)
      setError(null)
    } catch (err) {
      console.error('Weather fetch error:', err)
      setError('Unable to fetch weather')
      setLoading(false)
      // Keep showing default data on error
    }
  }

  const getConditionName = (condition) => {
    const conditions = {
      'Clear': 'Sunny',
      'Clouds': 'Cloudy',
      'Rain': 'Rainy',
      'Drizzle': 'Drizzle',
      'Thunderstorm': 'Stormy',
      'Snow': 'Snowy',
      'Mist': 'Misty',
      'Fog': 'Foggy',
      'Haze': 'Hazy',
    }
    return conditions[condition] || condition
  }

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Sunny':
        return <Sun className="w-12 h-12 text-yellow-400" />
      case 'Cloudy':
        return <Cloud className="w-12 h-12 text-gray-300" />
      case 'Rainy':
        return <CloudRain className="w-12 h-12 text-blue-400" />
      case 'Drizzle':
        return <CloudDrizzle className="w-12 h-12 text-blue-300" />
      case 'Stormy':
        return <Zap className="w-12 h-12 text-yellow-500" />
      case 'Snowy':
        return <CloudSnow className="w-12 h-12 text-blue-200" />
      case 'Misty':
      case 'Foggy':
      case 'Hazy':
        return <Eye className="w-12 h-12 text-gray-400" />
      default:
        return <Sun className="w-12 h-12 text-yellow-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="w-72 p-6 rounded-3xl glass-strong deep-shadow cursor-pointer bg-gradient-to-br from-blue-500/20 to-purple-500/20"
    >
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full"
          />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm">{weather.location}</p>
              <h2 className="text-5xl font-bold text-white">{weather.temp}°</h2>
              <p className="text-white/80 mt-1 capitalize">{weather.description}</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {getWeatherIcon()}
            </motion.div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">{weather.wind} km/h</span>
            </div>
            <div className="text-white/80 text-sm">💧 {weather.humidity}%</div>
          </div>

          {error && (
            <div className="mt-2 text-xs text-red-400/80 text-center">
              {error}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

export default WeatherWidget
