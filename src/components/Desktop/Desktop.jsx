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
import DesktopIcon from './DesktopIcon'
import { useContextMenu } from '../../contexts/ContextMenuContext'
import { Monitor, RefreshCcw, Terminal as TerminalIcon, LayoutGrid, Settings as SettingsIcon } from 'lucide-react'

const Desktop = () => {
  const windowManager = useWindowManager()
  const { showMenu } = useContextMenu()
  const [showSpotlight, setShowSpotlight] = useState(false)

  // Load settings from localStorage
  const [wallpaper, setWallpaper] = useState(() => {
    const saved = localStorage.getItem('desktop_wallpaper')
    return saved ? saved : 'custom'
  })

  const [customWallpaper, setCustomWallpaper] = useState(() => {
    const saved = localStorage.getItem('desktop_custom_wallpaper')
    return saved ? saved : '/frieren.jpg'
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

  // Persistent widget positions
  const [widgetPositions, setWidgetPositions] = useState(() => {
    const saved = localStorage.getItem('desktop_widget_positions')
    return saved ? JSON.parse(saved) : {
      clock: { x: window.innerWidth - 320, y: 100 },
      weather: { x: window.innerWidth - 320, y: 350 },
      notes: { x: 50, y: 100 },
      systemStats: { x: 50, y: 400 },
    }
  })

  const updateWidgetPosition = (id, pos) => {
    const newPositions = { ...widgetPositions, [id]: pos }
    setWidgetPositions(newPositions)
    localStorage.setItem('desktop_widget_positions', JSON.stringify(newPositions))
  }

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

  const handleDesktopContextMenu = (e) => {
    showMenu(e, [
      { label: 'Refresh', icon: RefreshCcw, action: () => window.location.reload() },
      { separator: true },
      { label: 'New Terminal', icon: TerminalIcon, action: () => handleAppOpen(APPS.TERMINAL) },
      { label: 'Settings', icon: SettingsIcon, action: () => handleAppOpen(APPS.SETTINGS) },
      { separator: true },
      { label: 'Change Wallpaper', icon: Monitor, action: () => handleAppOpen(APPS.SETTINGS) },
      { label: 'Show Widgets', icon: LayoutGrid, action: () => updateWidgetSettings({ ...widgetSettings, clock: true, weather: true }) },
    ])
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ filter: `brightness(${brightness}%)` }}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Animated Wallpaper */}
      <Wallpaper wallpaperId={wallpaper} customWallpaper={customWallpaper} />

      {/* Desktop Widgets */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {widgetSettings.clock && (
          <div className="pointer-events-auto" style={{ position: 'absolute', left: widgetPositions.clock.x, top: widgetPositions.clock.y }}>
            <ClockWidget onPositionChange={(pos) => updateWidgetPosition('clock', pos)} position={widgetPositions.clock} />
          </div>
        )}
        {widgetSettings.weather && (
          <div className="pointer-events-auto" style={{ position: 'absolute', left: widgetPositions.weather.x, top: widgetPositions.weather.y }}>
            <WeatherWidget onPositionChange={(pos) => updateWidgetPosition('weather', pos)} position={widgetPositions.weather} />
          </div>
        )}
        {widgetSettings.notes && (
          <div className="pointer-events-auto" style={{ position: 'absolute', left: widgetPositions.notes.x, top: widgetPositions.notes.y }}>
            <NotesWidget onPositionChange={(pos) => updateWidgetPosition('notes', pos)} position={widgetPositions.notes} />
          </div>
        )}
        {widgetSettings.systemStats && (
          <div className="pointer-events-auto" style={{ position: 'absolute', left: widgetPositions.systemStats.x, top: widgetPositions.systemStats.y }}>
            <SystemStatsWidget onPositionChange={(pos) => updateWidgetPosition('systemStats', pos)} position={widgetPositions.systemStats} />
          </div>
        )}
      </div>

      {/* Top Bar */}
      <Topbar
        onSpotlightToggle={() => setShowSpotlight(prev => !prev)}
        minimizedWindows={windowManager.windows.filter(w => w.minimized)}
        onWindowRestore={windowManager.restoreWindow}
      />

      {/* Desktop Icons Grid */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <DesktopIcon
          name="Documents"
          type="folder"
          initialPosition={{ x: 40, y: 80 }}
          onClick={() => handleAppOpen(APPS.EXPLORER)}
        />
        <DesktopIcon
          name="Projects"
          type="github"
          initialPosition={{ x: 40, y: 190 }}
          onClick={() => handleAppOpen(APPS.PROJECTS)}
        />
        <DesktopIcon
          name="Resume"
          type="file"
          initialPosition={{ x: 40, y: 300 }}
          onClick={() => window.open('/JaiminPansal.pdf', '_blank')}
        />
        <DesktopIcon
          name="Terminal"
          type="terminal"
          initialPosition={{ x: 40, y: 410 }}
          onClick={() => handleAppOpen(APPS.TERMINAL)}
        />
      </div>

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
