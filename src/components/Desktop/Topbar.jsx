import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Wifi, Battery, Volume2, Sun, Moon } from 'lucide-react'
import { format } from 'date-fns'
import { useTheme } from '../../contexts/ThemeContext'

const Topbar = ({ onSpotlightToggle, minimizedWindows, onWindowRestore }) => {
  const [time, setTime] = useState(new Date())
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-0 left-0 right-0 h-6 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)] z-50 flex items-center justify-between font-mono text-xs px-2 select-none text-[var(--text-primary)]">
      {/* Left - Workspaces / Tags */}
      <div className="flex items-center space-x-4">
        <div className="flex bg-[var(--bg-secondary)] px-2 font-bold">
          <span>1:term</span>
          <span className="text-[var(--text-dim)] mx-2">2:web</span>
          <span className="text-[var(--text-dim)]">3:code</span>
        </div>

        <span className="text-[var(--text-dim)]">|</span>

        <button
          onClick={onSpotlightToggle}
          className="hover:text-[var(--accent)] hover:underline decoration-[var(--accent)]"
        >
          SEARCH_EXEC [CMD+K]
        </button>
      </div>

      {/* Center - Window Title (Optional) */}
      <div className="text-[var(--text-dim)] uppercase tracking-widest hidden md:block">
        PORTFOLIO_OS KERNEL 5.15.0-generic
      </div>

      {/* Right - System Modules */}
      <div className="flex items-center space-x-0">
        <button
          onClick={toggleTheme}
          className="flex items-center px-2 border-l border-[var(--border-secondary)] h-6 hover:bg-[var(--bg-secondary)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="text-[var(--text-dim)] mr-2">THEME:</span>
          {theme === 'dark' ? (
            <Moon className="w-3 h-3 text-[var(--accent)]" />
          ) : (
            <Sun className="w-3 h-3 text-[var(--accent)]" />
          )}
          <span className="ml-1 uppercase font-bold text-[var(--accent)]">[{theme}]</span>
        </button>

        <Module label="CPU" value="12%" color="text-yellow-500" />
        <Module label="MEM" value="2.4G" color="text-blue-400" />
        <Module label="VOL" value="45%" />

        <div className="flex bg-[var(--bg-secondary)] px-2 ml-2">
          {format(time, 'yyyy-MM-dd HH:mm')}
        </div>
      </div>
    </div>
  )
}

const Module = ({ label, value, color = "text-[var(--text-secondary)]" }) => (
  <div className="flex items-center px-2 border-l border-[var(--border-secondary)] h-6">
    <span className="text-[var(--text-dim)] mr-1">{label}:</span>
    <span className={color}>{value}</span>
  </div>
)

export default Topbar
