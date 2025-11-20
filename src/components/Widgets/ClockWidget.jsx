import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

const ClockWidget = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="w-72 p-6 rounded-3xl glass-strong deep-shadow cursor-pointer bg-gradient-to-br from-pink-500/20 to-orange-500/20"
    >
      <div className="text-center">
        <motion.div
          key={format(time, 'HH:mm:ss')}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-bold text-white mb-2"
        >
          {format(time, 'HH:mm')}
        </motion.div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-mono text-white/60"
        >
          {format(time, 'ss')}
        </motion.div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-white/80 text-lg">{format(time, 'EEEE')}</p>
          <p className="text-white/60">{format(time, 'MMMM d, yyyy')}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default ClockWidget

