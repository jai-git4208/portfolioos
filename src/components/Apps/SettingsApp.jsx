import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Image, Monitor, Volume2, Sun, Grid3x3, Eye, EyeOff, Layers, Upload } from 'lucide-react'
import { WALLPAPERS, APPS, APP_CONFIG } from '../../utils/constants'

const SettingsApp = ({ settings }) => {
  const [activeTab, setActiveTab] = useState('wallpaper')
  
  // Local state synced with desktop settings
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

  // Sync local state with desktop settings when they change
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB')
      return
    }

    // Create object URL for the image
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

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 p-4 space-y-2">
        <h2 className="text-xl font-bold text-white mb-4 px-3">Settings</h2>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl smooth-transition ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neon-pink/20 to-neon-orange/20 text-white'
                : 'text-white/60 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'wallpaper' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Wallpaper</h3>
              <p className="text-white/60">Choose or upload your desktop background</p>
            </div>

            {/* Upload Custom Image */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold flex items-center space-x-2">
                <Upload className="w-5 h-5 text-neon-pink" />
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
                className="w-full p-8 rounded-2xl glass border-2 border-dashed border-white/20 text-center cursor-pointer hover:bg-white/5 smooth-transition"
              >
                <div className="flex flex-col items-center space-y-3">
                  <Upload className="w-12 h-12 text-white/60" />
                  <div>
                    <p className="text-white font-medium mb-1">Upload Custom Wallpaper</p>
                    <p className="text-white/60 text-sm">Click to browse and select an image</p>
                    <p className="text-white/40 text-xs mt-1">Max 10MB • JPG, PNG, WEBP</p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Custom Wallpaper Preview */}
            {customWallpaper && wallpaper === 'custom' && (
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Your Custom Wallpaper</h4>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden aspect-video ring-4 ring-white/50"
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
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-2xl">
                      ✓
                    </div>
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white font-medium text-sm">Custom Image</span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Preset Wallpapers */}
            <div>
              <h4 className="text-white font-semibold mb-3">Preset Wallpapers</h4>
              <div className="grid grid-cols-2 gap-4">
                {WALLPAPERS.map((wall) => (
                  <motion.button
                    key={wall.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleWallpaperChange(wall.id)}
                    className={`relative rounded-2xl overflow-hidden aspect-video smooth-transition ${
                      wallpaper === wall.id ? 'ring-4 ring-white/50' : ''
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
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-2xl">
                          ✓
                        </div>
                      </motion.div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-white font-medium text-sm">{wall.name}</span>
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
              <h3 className="text-2xl font-bold text-white mb-2">Display</h3>
              <p className="text-white/60">Adjust brightness and display settings</p>
            </div>

            {/* Brightness Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-white font-semibold flex items-center space-x-2">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  <span>Brightness</span>
                </label>
                <span className="text-white/80 font-medium">{brightness}%</span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) ${brightness}%, rgba(255,255,255,0.1) ${brightness}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>
              
              <div className="flex justify-between text-white/40 text-sm">
                <span>Dim</span>
                <span>Bright</span>
              </div>
            </div>

            {/* Preview */}
            <div className="p-6 rounded-2xl glass">
              <h4 className="text-white font-semibold mb-4">Preview</h4>
              <div 
                className="aspect-video rounded-xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden"
                style={{ filter: `brightness(${brightness}%)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sun className="w-16 h-16 text-white/60" />
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
              <h3 className="text-2xl font-bold text-white mb-2">Sound</h3>
              <p className="text-white/60">Control system volume and audio settings</p>
            </div>

            {/* Volume Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-white font-semibold flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                  <span>System Volume</span>
                </label>
                <span className="text-white/80 font-medium">{volume}%</span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.6) ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>
              
              <div className="flex justify-between text-white/40 text-sm">
                <span>Mute</span>
                <span>Max</span>
              </div>
            </div>

            {/* Volume Indicator */}
            <div className="p-8 rounded-2xl glass flex flex-col items-center justify-center space-y-4">
              <Volume2 className="w-20 h-20 text-blue-400" />
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{volume}%</div>
                <div className="text-white/60">Current Volume Level</div>
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
              <h3 className="text-2xl font-bold text-white mb-2">Widgets</h3>
              <p className="text-white/60">Show or hide desktop widgets</p>
            </div>

            {/* Widgets List */}
            <div className="space-y-3">
              {[
                { id: 'clock', name: 'Clock Widget', icon: '🕐', description: 'Display current time and date' },
                { id: 'weather', name: 'Weather Widget', icon: '🌤️', description: 'Real-time weather information' },
                { id: 'notes', name: 'Quick Notes', icon: '📝', description: 'Take quick notes on desktop' },
                { id: 'systemStats', name: 'System Stats', icon: '📊', description: 'Monitor CPU, RAM, and storage' },
              ].map((widget, index) => (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`p-5 rounded-2xl glass hover:bg-white/10 smooth-transition ${
                    !widgetSettings[widget.id] ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl deep-shadow">
                        {widget.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{widget.name}</h4>
                        <p className="text-white/60 text-sm">{widget.description}</p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWidget(widget.id)}
                      className={`w-14 h-7 rounded-full relative smooth-transition ${
                        widgetSettings[widget.id] ? 'bg-gradient-to-r from-neon-pink to-neon-orange' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        animate={{ x: widgetSettings[widget.id] ? 28 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-5 h-5 bg-white rounded-full absolute top-1"
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Info Box */}
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">About Widgets</h4>
                  <p className="text-white/70 text-sm">
                    Widgets appear in the top-right corner of your desktop. Toggle them on or off to customize your workspace.
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
              <h3 className="text-2xl font-bold text-white mb-2">Apps Management</h3>
              <p className="text-white/60">Show or hide apps from your dock and launcher</p>
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
                    className={`p-5 rounded-2xl glass hover:bg-white/10 smooth-transition ${
                      isHidden ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-3xl deep-shadow`}
                        >
                          {app.icon}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{app.title}</h4>
                          <p className="text-white/60 text-sm">
                            {isHidden ? 'Hidden from dock' : 'Visible in dock'}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleAppVisibility(appId)}
                        className={`px-6 py-2 rounded-lg font-medium smooth-transition ${
                          isHidden
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {isHidden ? (
                          <span className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>Show</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <EyeOff className="w-4 h-4" />
                            <span>Hide</span>
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Info Box */}
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">About App Management</h4>
                  <p className="text-white/70 text-sm">
                    Hidden apps won't appear in your dock or launcher, but you can always show them again from this settings panel.
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
