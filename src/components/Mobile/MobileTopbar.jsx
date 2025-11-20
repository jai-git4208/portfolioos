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
    <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between text-white">
      <div className="font-semibold">{format(time, 'h:mm')}</div>
      
      <div className="flex items-center space-x-3">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  )
}

export default MobileTopbar

