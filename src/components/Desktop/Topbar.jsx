import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Wifi, Battery, Volume2 } from 'lucide-react'
import { format } from 'date-fns'

const Topbar = ({ onSpotlightToggle, minimizedWindows, onWindowRestore }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-0 left-0 right-0 h-12 glass-strong z-50 px-6 flex items-center justify-between"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSpotlightToggle}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-full glass hover:bg-white/10 smooth-transition"
        >
          <Search className="w-4 h-4 text-white/80" />
          <span className="text-sm text-white/80 font-medium">Search</span>
          <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded">⌘K</kbd>
        </motion.button>

        {/* Minimized Windows */}
        {minimizedWindows.length > 0 && (
          <div className="flex items-center space-x-2">
            {minimizedWindows.map(window => (
              <motion.button
                key={window.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onWindowRestore(window.id)}
                className="text-2xl"
                title={window.title}
              >
                {window.icon}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Center - Time & Date */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm font-semibold text-white">
          {format(time, 'h:mm a')}
        </div>
        <div className="text-xs text-white/60">
          {format(time, 'EEE, MMM d')}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <motion.div whileHover={{ scale: 1.1 }} className="text-white/80">
          <Wifi className="w-5 h-5" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="text-white/80">
          <Volume2 className="w-5 h-5" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="text-white/80">
          <Battery className="w-5 h-5" />
        </motion.div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full glass">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-pink to-neon-orange flex items-center justify-center text-white font-bold text-sm">
            JP
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Topbar

