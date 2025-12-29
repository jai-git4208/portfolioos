import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, HardDrive, Activity } from 'lucide-react'

import { useDraggable } from '../../hooks/useDraggable'

const SystemStatsWidget = ({ position: propPosition, onPositionChange }) => {
  const { position, handleMouseDown } = useDraggable(propPosition, onPositionChange)
  const [stats, setStats] = useState({
    cpu: 45,
    ram: 62,
    storage: 78,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 30,
        ram: Math.floor(Math.random() * 20) + 50,
        storage: 78,
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const StatBar = ({ label, value, icon, color }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-[var(--text-secondary)] text-xs font-mono uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[var(--text-primary)] font-mono text-xs">{value}%</span>
      </div>
      <div className="h-1 bg-[var(--border-dim)] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-[var(--accent)]"
        />
      </div>
    </div>
  )

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
      <div className="text-xs text-[var(--text-dim)] mb-3 uppercase tracking-widest border-b border-[var(--border-dim)] pb-2">
        [SYS_MONITOR]
      </div>

      <div className="space-y-4">
        <StatBar
          label="CPU_LOAD"
          value={stats.cpu}
          icon={<Cpu className="w-4 h-4 text-[var(--accent)]" />}
        />
        <StatBar
          label="MEM_USAGE"
          value={stats.ram}
          icon={<Activity className="w-4 h-4 text-[var(--accent)]" />}
        />
        <StatBar
          label="DSK_SPACE"
          value={stats.storage}
          icon={<HardDrive className="w-4 h-4 text-[var(--accent)]" />}
        />
      </div>
    </motion.div>
  )
}

export default SystemStatsWidget

