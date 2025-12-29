import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

import { useDraggable } from '../../hooks/useDraggable'

const ClockWidget = ({ position: propPosition, onPositionChange }) => {
  const [time, setTime] = useState(new Date())
  const { position, handleMouseDown } = useDraggable(propPosition, onPositionChange)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        left: position.x - propPosition.x, // Offset relative to wrapper
        top: position.y - propPosition.y,
        position: 'relative'
      }}
      className="w-72 p-4 border border-[var(--border-secondary)] bg-[var(--bg-secondary)]/90 font-mono select-none cursor-move active:cursor-grabbing"
    >
      <div className="text-xs text-[var(--text-dim)] mb-3 uppercase tracking-widest border-b border-[var(--border-dim)] pb-2">
        [SYS_TIME]
      </div>

      <div className="text-center space-y-2">
        <div className="text-5xl font-bold text-[var(--accent)] tracking-tighter">
          {format(time, 'HH:mm')}
        </div>
        <div className="text-xl text-[var(--text-secondary)]">
          {format(time, 'ss')}
        </div>
        <div className="pt-2 border-t border-[var(--border-dim)]">
          <p className="text-[var(--text-primary)] text-sm uppercase">{format(time, 'EEEE')}</p>
          <p className="text-[var(--text-dim)] text-xs">{format(time, 'MMMM d, yyyy')}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default ClockWidget

