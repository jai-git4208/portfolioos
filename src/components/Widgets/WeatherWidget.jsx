import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wind } from 'lucide-react'

import { useDraggable } from '../../hooks/useDraggable'
import { fetchWithTimeout } from '../../utils/api'

const WeatherWidget = ({ position: propPosition, onPositionChange }) => {
  const { position, handleMouseDown } = useDraggable(propPosition, onPositionChange)
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

  const API_KEY = '25b5d77c66848b45c3994cbc52df78c4'
  const CITY = 'Ahmedabad'
  const COUNTRY = 'IN'

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeather = async () => {
    try {
      const response = await fetchWithTimeout(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&appid=${API_KEY}&units=metric`,
        { timeout: 5000 }
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
        wind: Math.round(data.wind.speed * 3.6),
        description: data.weather[0].description,
      })
      setLoading(false)
      setError(null)
    } catch (err) {
      console.warn('Weather fetch failed (likely network/blocked):', err.message)
      setError(err.message === 'The user aborted a request.' ? 'TIMEOUT' : 'API_ERROR')
      setLoading(false)
    }
  }

  const getConditionName = (condition) => {
    const conditions = {
      'Clear': 'CLEAR',
      'Clouds': 'CLOUDY',
      'Rain': 'RAIN',
      'Drizzle': 'DRIZZLE',
      'Thunderstorm': 'STORM',
      'Snow': 'SNOW',
      'Mist': 'MIST',
      'Fog': 'FOG',
      'Haze': 'HAZE',
    }
    return conditions[condition] || condition.toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        left: position.x - propPosition.x,
        top: position.y - propPosition.y,
        position: 'relative'
      }}
      className="w-72 p-4 border border-[var(--border-secondary)] bg-[var(--bg-secondary)]/90 font-mono select-none cursor-move active:cursor-grabbing"
    >
      {/* Header */}
      <div className="text-xs text-[var(--text-dim)] mb-3 uppercase tracking-widest border-b border-[var(--border-dim)] pb-2">
        [WEATHER]
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="text-[var(--accent)] text-xs animate-pulse">
            FETCHING_DATA...
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {/* Location */}
            <div className="text-[var(--text-secondary)] text-xs">
              LOC: {weather.location.toUpperCase()}
            </div>

            {/* Temperature */}
            <div className="text-[var(--text-primary)] text-4xl font-bold tracking-tight">
              {weather.temp}°C
            </div>

            {/* Condition */}
            <div className="text-[var(--text-secondary)] text-sm uppercase">
              {weather.condition}
            </div>

            {/* Description */}
            <div className="text-[var(--text-dim)] text-xs capitalize">
              {weather.description}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-dim)] text-xs">
            <div className="flex items-center space-x-2 text-[var(--accent)]">
              <Wind className="w-3 h-3" />
              <span>{weather.wind} KM/H</span>
            </div>
            <div className="text-[var(--text-secondary)]">
              HUM: {weather.humidity}%
            </div>
          </div>

          {error && (
            <div className="mt-2 text-xs text-red-500 text-center border border-red-900/30 p-2">
              [{error}]
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

export default WeatherWidget
