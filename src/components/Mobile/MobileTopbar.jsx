import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, Battery, Signal } from 'lucide-react'
import { format } from 'date-fns'

const MobileTopbar = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-6 py-3 flex items-center justify-between text-[var(--accent)] font-mono text-xs border-b border-[var(--border-dim)] bg-[var(--bg-primary)]/80 backdrop-blur-sm">
      <div className="font-bold tracking-wider">{format(time, 'HH:mm:ss')}</div>

      <div className="flex items-center space-x-2">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <Battery className="w-3 h-3" />
      </div>
    </div>
  )
}

export default MobileTopbar

