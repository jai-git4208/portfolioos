import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import MobileTopbar from './MobileTopbar'
import MobileWidgets from './MobileWidgets'
import DynamicIsland from './DynamicIsland'
import AboutApp from '../Apps/AboutApp'
import SkillsApp from '../Apps/SkillsApp'
import ProjectsApp from '../Apps/ProjectsApp'
import ContactApp from '../Apps/ContactApp'
import TerminalApp from '../Apps/TerminalApp'
import BrowserApp from '../Apps/BrowserApp'
import SettingsApp from '../Apps/SettingsApp'
import { APPS, APP_CONFIG, USER_INFO, WALLPAPERS } from '../../utils/constants'

const MobileView = () => {
  const [activeApp, setActiveApp] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [spotifyData, setSpotifyData] = useState(null)
  
  // Settings state
  const [wallpaper, setWallpaper] = useState(1)
  const [brightness, setBrightness] = useState(100)
  const [volume, setVolume] = useState(100)
  const [hiddenApps, setHiddenApps] = useState([])
  const [customWallpaper, setCustomWallpaper] = useState(null)
  const [widgetSettings, setWidgetSettings] = useState({
    clock: true,
    weather: true,
    notes: false,
    systemStats: false,
  })
  
  const scrollRef = useRef(null)
  const { scrollY } = useScroll()
  
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])

  // Filter out hidden apps
  const apps = Object.entries(APP_CONFIG).filter(([id]) => !hiddenApps.includes(id))

  const handleAppOpen = (appId) => {
    setActiveApp(appId)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleAppClose = () => {
    setActiveApp(null)
  }

  // Settings handlers
  const updateWallpaper = (id) => {
    setWallpaper(id)
  }

  const updateBrightness = (value) => {
    setBrightness(value)
  }

  const updateVolume = (value) => {
    setVolume(value)
  }

  const updateHiddenApps = (apps) => {
    setHiddenApps(apps)
  }

  const updateCustomWallpaper = (url) => {
    setCustomWallpaper(url)
  }

  const updateWidgetSettings = (settings) => {
    setWidgetSettings(settings)
  }

  // Get current wallpaper
  const getCurrentWallpaper = () => {
    if (wallpaper === 'custom' && customWallpaper) {
      return `url(${customWallpaper})`
    }
    const wallpaperObj = WALLPAPERS.find(w => w.id === wallpaper)
    return wallpaperObj?.value || WALLPAPERS[0].value
  }

  const renderAppContent = () => {
    const commonProps = {
      onClose: handleAppClose,
    }

    const settingsProps = {
      ...commonProps,
      settings: {
        wallpaper,
        brightness,
        volume,
        hiddenApps,
        customWallpaper,
        widgetSettings,
        updateWallpaper,
        updateBrightness,
        updateVolume,
        updateHiddenApps,
        updateCustomWallpaper,
        updateWidgetSettings,
      }
    }

    switch (activeApp) {
      case APPS.ABOUT:
        return <MobileAppWrapper {...commonProps}><AboutApp /></MobileAppWrapper>
      case APPS.SKILLS:
        return <MobileAppWrapper {...commonProps}><SkillsApp /></MobileAppWrapper>
      case APPS.PROJECTS:
        return <MobileAppWrapper {...commonProps}><ProjectsApp /></MobileAppWrapper>
      case APPS.CONTACT:
        return <MobileAppWrapper {...commonProps}><ContactApp /></MobileAppWrapper>
      case APPS.TERMINAL:
        return <MobileAppWrapper {...commonProps} fullScreen><TerminalApp /></MobileAppWrapper>
      case APPS.BROWSER:
        return <MobileAppWrapper {...commonProps}><BrowserApp /></MobileAppWrapper>
      case APPS.SETTINGS:
        return <MobileAppWrapper {...settingsProps}><SettingsApp {...settingsProps} /></MobileAppWrapper>
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900">
      <div 
        className="relative w-full max-w-md h-screen overflow-hidden"
        style={{
          background: getCurrentWallpaper(),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `brightness(${brightness}%)`,
        }}
      >
        {/* Animated Background Overlay */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20"
        >
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Dynamic Island with Spotify */}
        <DynamicIsland 
          showNotification={showNotification} 
          spotifyData={spotifyData}
          onSpotifyUpdate={setSpotifyData}
        />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!activeApp ? (
            <motion.div 
              key="home"
              ref={scrollRef} 
              className="relative h-full overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Top Bar */}
              <MobileTopbar />

              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-12 text-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-orange flex items-center justify-center text-white text-5xl font-bold deep-shadow"
                >
                  JP
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-white mb-3"
                >
                  {USER_INFO.name}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/80 text-lg mb-2"
                >
                  {USER_INFO.title}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60"
                >
                  📍 {USER_INFO.location}
                </motion.p>
              </motion.div>

              {/* Widgets Section */}
              <MobileWidgets widgetSettings={widgetSettings} />

              {/* App Grid */}
              <div className="px-6 py-8">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-white mb-6"
                >
                  Apps
                </motion.h2>

                <div className="grid grid-cols-4 gap-4">
                  {apps.map(([id, app], index) => (
                    <motion.button
                      key={id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAppOpen(id)}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-3xl deep-shadow`}>
                        {app.icon}
                      </div>
                      <span className="text-white/90 text-xs font-medium text-center">
                        {app.title}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-8">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-white mb-6"
                >
                  Quick Actions
                </motion.h2>

                <div className="space-y-3">
                  {[
                    { label: 'View GitHub', icon: '🐙', color: 'from-purple-500 to-pink-500', href: `https://github.com/${USER_INFO.github.split('/').pop()}` },
                    { label: 'Send Email', icon: '✉️', color: 'from-orange-500 to-red-500', href: `mailto:${USER_INFO.email}` },
                    { label: 'Visit Website', icon: '🌐', color: 'from-blue-500 to-cyan-500', href: `https://${USER_INFO.website}` },
                  ].map((action, index) => (
                    <motion.a
                      key={index}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-5 rounded-2xl bg-gradient-to-r ${action.color} glass-strong flex items-center justify-between`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl">{action.icon}</span>
                        <span className="text-white font-semibold text-lg">{action.label}</span>
                      </div>
                      <span className="text-white/80">→</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="px-6 py-12 text-center text-white/60"
              >
                <p>Made with ❤️ by {USER_INFO.name}</p>
                <p className="text-sm mt-2">Portfolio OS v2.0</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderAppContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Mobile App Wrapper Component
const MobileAppWrapper = ({ children, onClose, fullScreen = false }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`absolute inset-0 ${fullScreen ? 'bg-black' : 'bg-black/40 backdrop-blur-xl'} overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        {/* Mobile App Header */}
        <div className="flex items-center justify-between p-4 bg-black/20 border-b border-white/10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white text-2xl px-2"
          >
            ← Back
          </motion.button>
        </div>

        {/* App Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export default MobileView
