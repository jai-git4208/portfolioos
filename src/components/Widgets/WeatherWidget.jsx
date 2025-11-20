import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react'

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'Sunny',
    location: 'Ahmedabad',
    humidity: 65,
    wind: 12,
  })

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Sunny':
        return <Sun className="w-12 h-12 text-yellow-400" />
      case 'Cloudy':
        return <Cloud className="w-12 h-12 text-gray-300" />
      case 'Rainy':
        return <CloudRain className="w-12 h-12 text-blue-400" />
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
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/60 text-sm">{weather.location}</p>
          <h2 className="text-5xl font-bold text-white">{weather.temp}°</h2>
          <p className="text-white/80 mt-1">{weather.condition}</p>
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
    </motion.div>
  )
}

export default WeatherWidget

