import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Image, Monitor, Volume2, Sun, Grid3x3, Eye, EyeOff, Layers, Upload, ChevronRight, Moon } from 'lucide-react'
import { WALLPAPERS, APPS, APP_CONFIG } from '../../utils/constants'
import { useTheme } from '../../contexts/ThemeContext'

const SettingsApp = ({ settings }) => {
  const [activeTab, setActiveTab] = useState('appearance')
  const [showSidebar, setShowSidebar] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Local state synced with settings
  const [wallpaper, setWallpaper] = useState(settings?.wallpaper || 1)
  const [brightness, setBrightness] = useState(settings?.brightness || 100)
  const [volume, setVolume] = useState(settings?.volume || 100)
  const [hiddenApps, setHiddenApps] = useState(settings?.hiddenApps || [])
  const [customWallpaper, setCustomWallpaper] = useState(settings?.customWallpaper || null)
  const [widgetSettings, setWidgetSettings] = useState(settings?.widgetSettings || {
    clock: true,
    weather: true,
    notes: false,
    systemStats: false,
  })

  const fileInputRef = useRef(null)

  // Detect mobile
  const isMobile = window.innerWidth < 768

  // Sync local state with settings when they change
  useEffect(() => {
    if (settings) {
      setWallpaper(settings.wallpaper)
      setBrightness(settings.brightness)
      setVolume(settings.volume)
      setHiddenApps(settings.hiddenApps)
      setCustomWallpaper(settings.customWallpaper)
      setWidgetSettings(settings.widgetSettings || {
        clock: true,
        weather: true,
        notes: false,
        systemStats: false,
      })
    }
  }, [settings])

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <Sun className="w-5 h-5" /> },
    { id: 'wallpaper', label: 'Wallpaper', icon: <Image className="w-5 h-5" /> },
    { id: 'display', label: 'Display', icon: <Monitor className="w-5 h-5" /> },
    { id: 'sound', label: 'Sound', icon: <Volume2 className="w-5 h-5" /> },
    { id: 'widgets', label: 'Widgets', icon: <Layers className="w-5 h-5" /> },
    { id: 'apps', label: 'Apps', icon: <Grid3x3 className="w-5 h-5" /> },
  ]

  const handleWallpaperChange = (id) => {
    setWallpaper(id)
    setCustomWallpaper(null)
    settings?.updateWallpaper(id)
    settings?.updateCustomWallpaper(null)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB')
      return
    }

    const imageUrl = URL.createObjectURL(file)

    setCustomWallpaper(imageUrl)
    setWallpaper('custom')
    settings?.updateCustomWallpaper(imageUrl)
    settings?.updateWallpaper('custom')
  }

  const handleBrightnessChange = (value) => {
    setBrightness(value)
    settings?.updateBrightness(value)
  }

  const handleVolumeChange = (value) => {
    setVolume(value)
    settings?.updateVolume(value)
  }

  const toggleAppVisibility = (appId) => {
    const newHiddenApps = hiddenApps.includes(appId)
      ? hiddenApps.filter(id => id !== appId)
      : [...hiddenApps, appId]

    setHiddenApps(newHiddenApps)
    settings?.updateHiddenApps(newHiddenApps)
  }

  const toggleWidget = (widgetId) => {
    const newSettings = { ...widgetSettings, [widgetId]: !widgetSettings[widgetId] }
    setWidgetSettings(newSettings)
    settings?.updateWidgetSettings(newSettings)
  }

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId)
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono">
      {/* Mobile Tab Selector */}
      {isMobile && (
        <div className="p-4 border-b border-[var(--border-dim)]">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-full flex items-center justify-between p-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-secondary)]"
          >
            <div className="flex items-center space-x-3">
              {tabs.find(t => t.id === activeTab)?.icon}
              <span className="font-medium uppercase">[{tabs.find(t => t.id === activeTab)?.label}]</span>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${showSidebar ? 'rotate-90' : ''}`} />
          </motion.button>

          {/* Dropdown Menu */}
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-1 overflow-hidden"
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 border border-[var(--border-dim)] ${activeTab === tab.id
                    ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-dim)] bg-[var(--bg-secondary)]'
                    }`}
                >
                  {tab.icon}
                  <span className="font-medium uppercase">{tab.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 border-r border-[var(--border-dim)] p-4 space-y-2">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 px-3">SETTINGS::CONFIG</h2>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 border border-transparent smooth-transition ${activeTab === tab.id
                ? 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--accent)]'
                : 'text-[var(--text-dim)] hover:bg-[var(--bg-secondary)]'
                }`}
            >
              {tab.icon}
              <span className="font-medium uppercase">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Appearance</h3>
              <p className="text-[var(--text-dim)] text-sm md:text-base">Configure your desktop theme and visuals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`p-6 border-2 transition-all text-left ${theme === 'dark'
                    ? 'border-[var(--accent)] bg-[var(--bg-secondary)]'
                    : 'border-[var(--border-dim)] bg-transparent'
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`} />
                    <span className={`font-bold uppercase ${theme === 'dark' ? 'text-[var(--text-primary)]' : 'text-[var(--text-dim)]'}`}>
                      Dark Mode [CRT]
                    </span>
                  </div>
                  {theme === 'dark' && <div className="text-[var(--accent)] font-bold">[ACTIVE]</div>}
                </div>
                <div className="h-24 w-full bg-[#0c0c0c] border border-green-900/30 flex items-center justify-center">
                  <span className="text-green-500 font-mono text-[10px]"># system_boot_v1.0.0</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`p-6 border-2 transition-all text-left ${theme === 'light'
                    ? 'border-[var(--accent)] bg-[var(--bg-secondary)]'
                    : 'border-[var(--border-dim)] bg-transparent'
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`} />
                    <span className={`font-bold uppercase ${theme === 'light' ? 'text-[var(--text-primary)]' : 'text-[var(--text-dim)]'}`}>
                      Light Mode [INK]
                    </span>
                  </div>
                  {theme === 'light' && <div className="text-[var(--accent)] font-bold">[ACTIVE]</div>}
                </div>
                <div className="h-24 w-full bg-[#f5f5f5] border border-green-700/30 flex items-center justify-center">
                  <span className="text-green-700 font-mono text-[10px]"># system_boot_v1.0.0</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeTab === 'wallpaper' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Wallpaper</h3>
              <p className="text-[var(--text-dim)] text-sm md:text-base">Choose or upload your background</p>
            </div>

            {/* Upload Custom Image */}
            <div className="space-y-3">
              <h4 className="text-[var(--text-primary)] font-semibold flex items-center space-x-2 text-sm md:text-base">
                <Upload className="w-4 h-4 md:w-5 md:h-5 text-[var(--accent)]" />
                <span>Upload Custom Image</span>
              </h4>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 md:p-8 border-2 border-dashed border-[var(--border-secondary)] text-center cursor-pointer hover:bg-[var(--bg-secondary)] smooth-transition"
              >
                <div className="flex flex-col items-center space-y-3">
                  <Upload className="w-10 h-10 md:w-12 md:h-12 text-[var(--text-dim)]" />
                  <div>
                    <p className="text-[var(--text-primary)] font-medium mb-1 text-sm md:text-base">Upload Custom Wallpaper</p>
                    <p className="text-[var(--text-dim)] text-xs md:text-sm">Click to browse and select an image</p>
                    <p className="text-[var(--text-dim)] opacity-50 text-xs mt-1">Max 10MB • JPG, PNG, WEBP</p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Custom Wallpaper Preview */}
            {customWallpaper && wallpaper === 'custom' && (
              <div className="space-y-3">
                <h4 className="text-[var(--text-primary)] font-semibold text-sm md:text-base">Your Custom Wallpaper</h4>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden aspect-video border-2 border-[var(--accent)]"
                >
                  <img
                    src={customWallpaper}
                    alt="Custom wallpaper"
                    className="w-full h-full object-cover"
                  />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/20"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex items-center justify-center text-xl md:text-2xl text-[var(--accent)]">
                      ✓
                    </div>
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white font-medium text-xs md:text-sm">Custom Image</span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Preset Wallpapers */}
            <div>
              <h4 className="text-[var(--text-primary)] font-semibold mb-3 text-sm md:text-base">Preset Wallpapers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {WALLPAPERS.map((wall) => (
                  <motion.button
                    key={wall.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleWallpaperChange(wall.id)}
                    className={`relative overflow-hidden aspect-video smooth-transition border-2 ${wallpaper === wall.id ? 'border-[var(--accent)]' : 'border-[var(--border-dim)]'
                      }`}
                    style={{ background: wall.value }}
                  >
                    <div className="absolute inset-0 bg-black/20 hover:bg-black/10 smooth-transition" />

                    {wallpaper === wall.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex items-center justify-center text-xl md:text-2xl text-[var(--accent)]">
                          ✓
                        </div>
                      </motion.div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-white font-medium text-xs md:text-sm">{wall.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'display' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Display</h3>
              <p className="text-[var(--text-dim)] text-sm md:text-base">Adjust brightness and display settings</p>
            </div>

            {/* Brightness Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[var(--text-primary)] font-semibold flex items-center space-x-2 text-sm md:text-base">
                  <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                  <span>Brightness</span>
                </label>
                <span className="text-[var(--text-primary)] font-medium text-sm md:text-base">{brightness}%</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--border-secondary)] rounded-none appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${brightness}%, var(--border-dim) ${brightness}%, var(--border-dim) 100%)`
                  }}
                />
              </div>

              <div className="flex justify-between text-[var(--text-dim)] text-xs md:text-sm">
                <span>[LOW]</span>
                <span>[HIGH]</span>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 md:p-6 border border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
              <h4 className="text-[var(--text-primary)] font-semibold mb-4 text-sm md:text-base">Preview Area</h4>
              <div
                className="aspect-video bg-[var(--bg-primary)] border border-[var(--border-dim)] relative overflow-hidden"
                style={{ filter: `brightness(${brightness}%)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sun className="w-12 h-12 md:w-16 md:h-16 text-[var(--text-dim)]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sound' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Sound</h3>
              <p className="text-[var(--text-dim)] text-sm md:text-base">Control system volume and audio settings</p>
            </div>

            {/* Volume Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[var(--text-primary)] font-semibold flex items-center space-x-2 text-sm md:text-base">
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-[var(--accent)]" />
                  <span>System Volume</span>
                </label>
                <span className="text-[var(--text-primary)] font-medium text-sm md:text-base">{volume}%</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--border-secondary)] rounded-none appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${volume}%, var(--border-dim) ${volume}%, var(--border-dim) 100%)`
                  }}
                />
              </div>

              <div className="flex justify-between text-[var(--text-dim)] text-xs md:text-sm">
                <span>[QUIET]</span>
                <span>[LOUD]</span>
              </div>
            </div>

            {/* Volume Indicator */}
            <div className="p-6 md:p-8 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] flex flex-col items-center justify-center space-y-4">
              <Volume2 className="w-16 h-16 md:w-20 md:h-20 text-[var(--accent)]" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)] mb-2">{volume}%</div>
                <div className="text-[var(--text-dim)] text-sm md:text-base uppercase tracking-tighter">Volume Level</div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'widgets' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Widgets</h3>
              <p className="text-[var(--text-dim)] text-sm md:text-base">Show or hide widgets</p>
            </div>

            {/* Widgets List */}
            <div className="space-y-3">
              {[
                { id: 'clock', name: 'Clock Widget', icon: '[CLK]', description: 'Display current time and date' },
                { id: 'weather', name: 'Weather Widget', icon: '[WTH]', description: 'Real-time weather information' },
                { id: 'notes', name: 'Quick Notes', icon: '[NTE]', description: 'Take quick notes' },
                { id: 'systemStats', name: 'System Stats', icon: '[CPU]', description: 'Monitor CPU, RAM, storage' },
              ].map((widget, index) => (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`p-4 md:p-5 rounded-none border border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] smooth-transition ${!widgetSettings[widget.id] ? 'opacity-50' : ''
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-none bg-[var(--bg-primary)] border border-[var(--border-dim)] flex items-center justify-center text-sm font-mono text-[var(--accent)] flex-shrink-0">
                        {widget.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[var(--text-primary)] font-mono font-bold text-sm md:text-base truncate">{widget.name}</h4>
                        <p className="text-[var(--text-dim)] font-mono text-xs md:text-sm truncate">{widget.description}</p>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWidget(widget.id)}
                      className={`w-12 h-6 md:w-14 md:h-7 relative smooth-transition flex-shrink-0 ml-3 border ${widgetSettings[widget.id] ? 'bg-[var(--accent)]/20 border-[var(--accent)]' : 'bg-[var(--bg-primary)] border-[var(--border-dim)]'
                        }`}
                    >
                      <motion.div
                        animate={{ x: widgetSettings[widget.id] ? (isMobile ? 24 : 28) : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`w-4 h-4 md:w-5 md:h-5 rounded-none absolute top-0.5 ${widgetSettings[widget.id] ? 'bg-[var(--accent)]' : 'bg-[var(--text-dim)]'}`}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Info Box */}
            <div className="p-4 md:p-6 border border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
              <div className="flex items-start space-x-3">
                <div className="text-xl md:text-2xl flex-shrink-0 text-[var(--accent)] font-mono">[i]</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[var(--text-primary)] font-mono font-semibold mb-1 text-sm md:text-base">About Widgets</h4>
                  <p className="text-[var(--text-dim)] font-mono text-xs md:text-sm">
                    Widgets appear on your home screen. Toggle them on or off to customize your workspace.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'apps' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Apps Management</h3>
              <p className="text-[var(--text-dim)] text-sm md:text-base">Show or hide apps from your launcher</p>
            </div>

            {/* Apps List */}
            <div className="space-y-3">
              {Object.values(APPS).map((appId) => {
                const app = APP_CONFIG[appId]
                const isHidden = hiddenApps.includes(appId)

                return (
                  <motion.div
                    key={appId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 5 }}
                    className={`p-4 md:p-5 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] smooth-transition ${isHidden ? 'opacity-50' : ''
                      }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                        <div
                          className={`w-12 h-12 md:w-14 md:h-14 border border-[var(--border-dim)] bg-[var(--bg-primary)] flex items-center justify-center text-xl md:text-2xl font-bold text-[var(--text-primary)] flex-shrink-0`}
                        >
                          {app.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[var(--text-primary)] font-bold text-sm md:text-base truncate uppercase tracking-tight">{app.title}</h4>
                          <p className="text-[var(--text-dim)] text-xs md:text-sm">
                            {isHidden ? '[STATUS: HIDDEN]' : '[STATUS: VISIBLE]'}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleAppVisibility(appId)}
                        className={`px-4 md:px-6 py-2 border font-medium smooth-transition text-xs md:text-sm flex-shrink-0 uppercase font-mono ${isHidden
                          ? 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)] hover:bg-[var(--accent)]/30'
                          : 'bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30'
                          }`}
                      >
                        {isHidden ? (
                          <span className="flex items-center space-x-2">
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Show App</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <EyeOff className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Hide App</span>
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Info Box */}
            <div className="p-4 md:p-6 border border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
              <div className="flex items-start space-x-3">
                <div className="text-xl md:text-2xl flex-shrink-0 text-[var(--accent)]">[i]</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[var(--text-primary)] font-bold mb-1 text-sm md:text-base">About App Management</h4>
                  <p className="text-[var(--text-dim)] text-xs md:text-sm">
                    Hidden apps won't appear in your launcher, but you can always show them again from this settings panel.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SettingsApp
