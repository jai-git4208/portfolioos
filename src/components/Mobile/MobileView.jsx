import React, { useState, useRef, useEffect } from 'react'
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
import { useSwipeGesture } from '../../hooks/useSwipeGesture'
import AppSwitcher from './AppSwitcher'
import AppContextMenu from './AppContextMenu'
import MobileAppIcon from './MobileAppIcon'
import MobileDock from './MobileDock'
import MobileAppSidebar from './MobileAppSidebar'
import Wallpaper from '../Desktop/Wallpaper'
import { Ripple } from '../Ripple'
import { useTheme } from '../../contexts/ThemeContext'
import {
  User,
  Cpu,
  Code,
  Mail,
  Terminal,
  Globe,
  Settings,
  Github,
  ExternalLink,
  Zap,
  Layout
} from 'lucide-react'

const APP_ICONS = {
  [APPS.ABOUT]: <User className="w-6 h-6" />,
  [APPS.SKILLS]: <Cpu className="w-6 h-6" />,
  [APPS.PROJECTS]: <Code className="w-6 h-6" />,
  [APPS.CONTACT]: <Mail className="w-6 h-6" />,
  [APPS.TERMINAL]: <Terminal className="w-6 h-6" />,
  [APPS.BROWSER]: <Globe className="w-6 h-6" />,
  [APPS.SETTINGS]: <Settings className="w-6 h-6" />,
}

const ACTION_ICONS = {
  'GITHUB': <Github className="w-5 h-5" />,
  'EMAIL': <Mail className="w-5 h-5" />,
  'WEBSITE': <Globe className="w-5 h-5" />,
}

const MobileView = () => {
  const [activeApp, setActiveApp] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [showAppSwitcher, setShowAppSwitcher] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [openApps, setOpenApps] = useState([])
  const { theme } = useTheme()

  // Settings state
  const [wallpaper, setWallpaper] = useState('custom')
  const [brightness, setBrightness] = useState(100)
  const [volume, setVolume] = useState(100)
  const [hiddenApps, setHiddenApps] = useState([])
  const [customWallpaper, setCustomWallpaper] = useState('/frieren.jpg')
  const [widgetSettings, setWidgetSettings] = useState({
    clock: true,
    weather: true,
    notes: false,
    systemStats: false,
  })

  const [contextMenu, setContextMenu] = useState({ isOpen: false, app: null, position: { x: 0, y: 0 } })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { })
      }
    }
  }

  // Aggressive auto-fullscreen and state sync
  useEffect(() => {
    const handleInteraction = (e) => {
      // scroll is not a valid user gesture for fullscreen, and can be triggered on load by Framer Motion
      if (!document.fullscreenElement) {
        toggleFullscreen()
      }
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    window.addEventListener('click', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const scrollRef = useRef(null)
  const { scrollY } = useScroll()

  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])

  // Filter out hidden apps
  const apps = Object.entries(APP_CONFIG).filter(([id]) => !hiddenApps.includes(id))

  const handleAppOpen = (appId) => {
    setActiveApp(appId)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)

    if (!openApps.find(app => app.id === appId)) {
      setOpenApps(prev => [...prev, { id: appId, minimized: false }])
    }
  }

  const handleAppClose = () => {
    if (activeApp) {
      setOpenApps(prev => prev.filter(app => app.id !== activeApp))
    }
    setActiveApp(null)
  }

  const handleWindowRestore = (appId) => {
    setOpenApps(prev => prev.map(app =>
      app.id === appId ? { ...app, minimized: false } : app
    ))
    setActiveApp(appId)
  }

  // Swipe gesture handler
  const handleSwipe = ({ direction, fromEdge }) => {
    if (fromEdge === 'bottom' && direction === 'up') {
      setShowAppSwitcher(true)
    } else if (fromEdge === 'left' && direction === 'right') {
      setShowSidebar(true)
    }
  }

  useSwipeGesture(handleSwipe)

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

  const handleContextAction = (actionId, appId) => {
    if (actionId === 'hide') {
      setHiddenApps(prev => [...prev, appId])
    }
    console.log(`Action ${actionId} triggered for app ${appId}`)
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
    <div className="flex items-center justify-center min-h-screen w-full bg-[var(--bg-primary)]">
      <div
        className="relative w-full max-w-md h-screen overflow-hidden bg-[var(--bg-primary)]"
        style={{
          filter: `brightness(${brightness}%)`,
        }}
      >
        {/* Animated Wallpaper */}
        <Wallpaper wallpaperId={wallpaper} customWallpaper={customWallpaper} />

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 1px, transparent 1px, transparent 2px)',
        }} />

        {/* Notification Bar */}
        <DynamicIsland showNotification={showNotification} />


        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!activeApp ? (
            <motion.div
              key="home"
              ref={scrollRef}
              className="relative h-full overflow-y-auto snap-y snap-proximity scroll-smooth pb-32"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Top Bar */}
              <MobileTopbar onMenuClick={() => setShowSidebar(true)} />

              {/* Sidebar */}
              <MobileAppSidebar
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
                settings={{
                  brightness,
                  volume,
                  updateBrightness,
                  updateVolume
                }}
              />

              {/* Hero Section - Streamlined */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-12 text-left border-b border-[var(--border-dim)] pt-20 snap-start"
              >
                <div className="font-mono text-[var(--accent)] space-y-1">
                  <div className="text-xs text-[var(--text-dim)] uppercase tracking-tight">[ Welcome_Root ]</div>
                  <div className="text-2xl font-bold tracking-tighter text-[var(--text-primary)]">System Ready.</div>
                  <div className="text-[10px] text-[var(--text-dim)] mt-2 uppercase">Core_Status: Operational</div>
                </div>
              </motion.div>

              {/* Stats Section */}
              <div className="snap-start scroll-mt-6">
                <MobileWidgets widgetSettings={widgetSettings} />
              </div>

              {/* Section Divider */}
              <div className="px-6 py-4">
                <div className="border-t-2 border-[var(--border-secondary)]" />
              </div>

              {/* App Grid */}
              <div className="px-6 py-6 border-b-2 border-[var(--border-secondary)] snap-start scroll-mt-6">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-mono font-bold text-[var(--accent)] mb-4 uppercase tracking-widest"
                >
                  [APPS]
                </motion.h2>

                <div className="grid grid-cols-3 gap-6">
                  {apps.map(([id, app], index) => (
                    <MobileAppIcon
                      key={id}
                      id={id}
                      app={app}
                      index={index}
                      icon={APP_ICONS[id]}
                      onOpen={handleAppOpen}
                      onContextMenu={(app, pos) => setContextMenu({ isOpen: true, app, position: pos })}
                    />
                  ))}
                </div>
              </div>

              {/* Context Menu Component */}
              <AppContextMenu
                isOpen={contextMenu.isOpen}
                onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
                app={contextMenu.app}
                position={contextMenu.position}
                onAction={handleContextAction}
              />

              {/* Quick Actions */}
              <div className="px-6 py-6 border-b border-[var(--border-dim)] snap-start scroll-mt-6">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-mono font-bold text-[var(--accent)] mb-4 uppercase tracking-widest"
                >
                  [QUICK_ACTIONS]
                </motion.h2>

                <div className="space-y-2">
                  {[
                    { label: 'GITHUB', cmd: '[GIT]', href: `https://github.com/${USER_INFO.github.split('/').pop()}` },
                    { label: 'EMAIL', cmd: '[MSG]', href: `mailto:${USER_INFO.email}` },
                    { label: 'WEBSITE', cmd: '[WWW]', href: `https://${USER_INFO.website}` },
                  ].map((action, index) => (
                    <Ripple
                      key={index}
                      className="block"
                    >
                      <motion.a
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                        className="w-full p-4 border border-[var(--border-dim)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors flex items-center justify-between font-mono"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-[var(--accent)]">{ACTION_ICONS[action.label]}</span>
                          <span className="text-[var(--text-secondary)] text-sm">{action.label}</span>
                        </div>
                        <span className="text-[var(--text-dim)]">
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </motion.a>
                    </Ripple>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="px-6 py-8 text-center font-mono text-[var(--text-dim)] snap-end"
              >
                <p className="text-[8px] uppercase tracking-widest">[ PortfolioOS_Mobile v2.0 ]</p>
              </motion.div>

              {/* Persistent Dock */}
              <MobileDock onAppOpen={handleAppOpen} activeApp={activeApp} />
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

        {/* App Switcher Overlay */}
        <AppSwitcher
          isOpen={showAppSwitcher}
          onClose={() => setShowAppSwitcher(false)}
          openWindows={openApps}
          onAppOpen={handleAppOpen}
          onWindowRestore={handleWindowRestore}
        />

        {/* Bottom Swipe Indicator */}
        {!activeApp && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-2 pointer-events-none z-40">
            <div className="w-16 h-1 bg-[var(--border-secondary)] rounded-full" />
          </div>
        )}
      </div>
    </div >
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
      className={`absolute inset-0 bg-[var(--bg-primary)] overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        {/* Mobile App Header - Terminal Style */}
        <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] border-b border-[var(--border-dim)]">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-[var(--accent)] font-mono text-xs px-2 border border-[var(--border-dim)] py-1 hover:bg-[var(--bg-secondary)] transition-colors"
          >
            [ESC]
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
