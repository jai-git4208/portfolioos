import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Topbar from './Topbar'
import Dock from './Dock'
import Window from './Window'
import Spotlight from './Spotlight'
import Wallpaper from './Wallpaper'
import { useWindowManager } from '../../hooks/useWindowManager'
import { APP_CONFIG, APPS } from '../../utils/constants'
import WeatherWidget from '../Widgets/WeatherWidget'
import ClockWidget from '../Widgets/ClockWidget'

const Desktop = () => {
  const windowManager = useWindowManager()
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [wallpaper, setWallpaper] = useState(1)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSpotlight(prev => !prev)
      }
      if (e.key === 'Escape') {
        setShowSpotlight(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAppOpen = (appId) => {
    windowManager.openWindow(appId, APP_CONFIG[appId])
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated Wallpaper */}
      <Wallpaper wallpaperId={wallpaper} />

      {/* Desktop Widgets - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 right-8 space-y-4 z-10"
      >
        <ClockWidget />
        <WeatherWidget />
      </motion.div>

      {/* Top Bar */}
      <Topbar 
        onSpotlightToggle={() => setShowSpotlight(prev => !prev)}
        minimizedWindows={windowManager.windows.filter(w => w.minimized)}
        onWindowRestore={windowManager.restoreWindow}
      />

      {/* Spotlight Search */}
      {showSpotlight && (
        <Spotlight
          onClose={() => setShowSpotlight(false)}
          onAppOpen={handleAppOpen}
        />
      )}

      {/* Windows */}
      {windowManager.windows.map(window => (
        !window.minimized && (
          <Window
            key={window.id}
            window={window}
            isActive={windowManager.activeWindow === window.id}
            onClose={() => windowManager.closeWindow(window.id)}
            onMinimize={() => windowManager.minimizeWindow(window.id)}
            onMaximize={() => windowManager.maximizeWindow(window.id)}
            onFocus={() => windowManager.focusWindow(window.id)}
            onPositionChange={(pos) => windowManager.updateWindowPosition(window.id, pos)}
            onSizeChange={(size) => windowManager.updateWindowSize(window.id, size)}
          />
        )
      ))}

      {/* Dock */}
      <Dock 
        onAppOpen={handleAppOpen}
        openWindows={windowManager.windows}
        onWindowRestore={windowManager.restoreWindow}
      />
    </div>
  )
}

export default Desktop
