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
import NotesWidget from '../Widgets/NotesWidget'
import SystemStatsWidget from '../Widgets/SystemStatsWidget'

const Desktop = () => {
  const windowManager = useWindowManager()
  const [showSpotlight, setShowSpotlight] = useState(false)
  
  // Load settings from localStorage
  const [wallpaper, setWallpaper] = useState(() => {
    const saved = localStorage.getItem('desktop_wallpaper')
    return saved ? saved : 1
  })
  
  const [customWallpaper, setCustomWallpaper] = useState(() => {
    return localStorage.getItem('desktop_custom_wallpaper')
  })
  
  const [brightness, setBrightness] = useState(() => {
    const saved = localStorage.getItem('desktop_brightness')
    return saved ? parseInt(saved) : 100
  })
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('desktop_volume')
    return saved ? parseInt(saved) : 100
  })
  
  const [hiddenApps, setHiddenApps] = useState(() => {
    const saved = localStorage.getItem('desktop_hidden_apps')
    return saved ? JSON.parse(saved) : []
  })

  const [widgetSettings, setWidgetSettings] = useState(() => {
    const saved = localStorage.getItem('desktop_widget_settings')
    return saved ? JSON.parse(saved) : {
      clock: true,
      weather: true,
      notes: false,
      systemStats: false,
    }
  })

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

  // Settings update handlers
  const updateWallpaper = (id) => {
    setWallpaper(id)
    localStorage.setItem('desktop_wallpaper', id.toString())
  }

  const updateCustomWallpaper = (imageUrl) => {
    setCustomWallpaper(imageUrl)
    if (imageUrl) {
      localStorage.setItem('desktop_custom_wallpaper', imageUrl)
    } else {
      localStorage.removeItem('desktop_custom_wallpaper')
    }
  }

  const updateBrightness = (value) => {
    setBrightness(value)
    localStorage.setItem('desktop_brightness', value.toString())
  }

  const updateVolume = (value) => {
    setVolume(value)
    localStorage.setItem('desktop_volume', value.toString())
    
    // Update all audio elements
    document.querySelectorAll('audio').forEach(audio => {
      audio.volume = value / 100
    })
  }

  const updateHiddenApps = (apps) => {
    setHiddenApps(apps)
    localStorage.setItem('desktop_hidden_apps', JSON.stringify(apps))
  }

  const updateWidgetSettings = (settings) => {
    setWidgetSettings(settings)
    localStorage.setItem('desktop_widget_settings', JSON.stringify(settings))
  }

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      style={{ filter: `brightness(${brightness}%)` }}
    >
      {/* Animated Wallpaper */}
      <Wallpaper wallpaperId={wallpaper} customWallpaper={customWallpaper} />

      {/* Desktop Widgets - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 right-8 space-y-4 z-10"
      >
        {widgetSettings.clock && <ClockWidget />}
        {widgetSettings.weather && <WeatherWidget />}
        {widgetSettings.notes && <NotesWidget />}
        {widgetSettings.systemStats && <SystemStatsWidget />}
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
          hiddenApps={hiddenApps}
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
            // Pass settings to Settings app
            desktopSettings={{
              wallpaper,
              customWallpaper,
              brightness,
              volume,
              hiddenApps,
              widgetSettings,
              updateWallpaper,
              updateCustomWallpaper,
              updateBrightness,
              updateVolume,
              updateHiddenApps,
              updateWidgetSettings,
            }}
          />
        )
      ))}

      {/* Dock */}
      <Dock 
        onAppOpen={handleAppOpen}
        openWindows={windowManager.windows}
        onWindowRestore={windowManager.restoreWindow}
        hiddenApps={hiddenApps}
      />
    </div>
  )
}

export default Desktop
