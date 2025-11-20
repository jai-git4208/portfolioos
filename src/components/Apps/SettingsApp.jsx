import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Palette, Image, Monitor, Moon, Sun, Sparkles, Volume2, Bell, Info, Zap, Smartphone, Upload } from 'lucide-react'
import { WALLPAPERS } from '../../utils/constants'

const SettingsApp = ({ onSettingsChange }) => {
  // Appearance settings
  const [activeTab, setActiveTab] = useState('appearance')
  const [selectedWallpaper, setSelectedWallpaper] = useState(WALLPAPERS[0])
  const [customWallpaper, setCustomWallpaper] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [accentColor, setAccentColor] = useState('pink')
  
  // Visual effects settings
  const [glassEffect, setGlassEffect] = useState(true)
  const [blurEffects, setBlurEffects] = useState(true)
  const [animations, setAnimations] = useState(true)
  const [parallaxWallpaper, setParallaxWallpaper] = useState(true)
  
  // System settings
  const [performanceMode, setPerformanceMode] = useState(false)
  const [dockSize, setDockSize] = useState('medium')
  
  // Sound & Haptics
  const [volume, setVolume] = useState(70)
  const [vibration, setVibration] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)

  const fileInputRef = useRef(null)

  // Callback to parent (if provided)
  const updateSettings = (newSettings) => {
    if (onSettingsChange) {
      onSettingsChange(newSettings)
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    updateSettings({ theme: newTheme })
  }

  const handleWallpaperChange = (wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setCustomWallpaper(null)
    updateSettings({ wallpaper: wallpaper })
  }

  const handleCustomWallpaperUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG/PNG)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setCustomWallpaper(dataUrl)
      setSelectedWallpaper(null)
      updateSettings({ wallpaper: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { id: 'wallpaper', label: 'Wallpaper', icon: <Image className="w-5 h-5" /> },
    { id: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
    { id: 'sound', label: 'Sound & Haptics', icon: <Volume2 className="w-5 h-5" /> },
    { id: 'about', label: 'About', icon: <Info className="w-5 h-5" /> },
  ]

  const accentColors = [
    { name: 'pink', color: 'from-pink-500 to-rose-500', value: '#ff0080' },
    { name: 'purple', color: 'from-purple-500 to-indigo-500', value: '#b300ff' },
    { name: 'blue', color: 'from-blue-500 to-cyan-500', value: '#00d9ff' },
    { name: 'orange', color: 'from-orange-500 to-red-500', value: '#ff6b00' },
    { name: 'green', color: 'from-green-500 to-emerald-500', value: '#00ff88' },
  ]

  const ToggleSwitch = ({ enabled, onChange }) => (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onChange}
      className={`w-14 h-7 rounded-full relative smooth-transition ${
        enabled ? 'bg-gradient-to-r from-neon-pink to-neon-orange' : 'bg-white/20'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 28 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full absolute top-1"
      />
    </motion.button>
  )

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-2 overflow-x-auto md:overflow-x-visible">
        <h2 className="text-xl font-bold text-white mb-4 px-3">Settings</h2>
        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl smooth-transition whitespace-nowrap ${
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
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Appearance</h3>
              <p className="text-white/60">Customize the look and feel of your portfolio</p>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="text-white font-semibold flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-neon-cyan" />
                <span>Theme Mode</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'dark', label: 'Dark', icon: <Moon className="w-6 h-6" /> },
                  { id: 'light', label: 'Light', icon: <Sun className="w-6 h-6" /> },
                ].map((themeOption) => (
                  <motion.button
                    key={themeOption.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleThemeChange(themeOption.id)}
                    className={`p-6 rounded-2xl flex flex-col items-center space-y-2 smooth-transition ${
                      theme === themeOption.id
                        ? 'bg-gradient-to-br from-neon-pink to-neon-orange ring-2 ring-white/30'
                        : 'glass hover:bg-white/10'
                    }`}
                  >
                    {themeOption.icon}
                    <span className="text-white font-medium">{themeOption.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <label className="text-white font-semibold">Accent Color</label>
              <div className="grid grid-cols-5 gap-3">
                {accentColors.map((color) => (
                  <motion.button
                    key={color.name}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setAccentColor(color.name)
                      updateSettings({ accentColor: color.name })
                    }}
                    className={`aspect-square rounded-2xl bg-gradient-to-br ${color.color} relative ${
                      accentColor === color.name ? 'ring-4 ring-white/50' : ''
                    }`}
                  >
                    {accentColor === color.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center text-white text-2xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Effects Toggle */}
            <div className="space-y-4">
              <label className="text-white font-semibold">Visual Effects</label>
              {[
                { label: 'Glassmorphism', enabled: glassEffect, setter: setGlassEffect },
                { label: 'Blur Effects', enabled: blurEffects, setter: setBlurEffects },
                { label: 'Animations', enabled: animations, setter: setAnimations },
                { label: 'Parallax Wallpaper', enabled: parallaxWallpaper, setter: setParallaxWallpaper },
              ].map((effect, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl glass"
                >
                  <span className="text-white/90">{effect.label}</span>
                  <ToggleSwitch
                    enabled={effect.enabled}
                    onChange={() => {
                      effect.setter(!effect.enabled)
                      updateSettings({ [effect.label.toLowerCase().replace(' ', '_')]: !effect.enabled })
                    }}
                  />
                </motion.div>
              ))}
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
              <h3 className="text-2xl font-bold text-white mb-2">Wallpaper</h3>
              <p className="text-white/60">Choose your desktop background</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WALLPAPERS.map((wallpaper) => (
                <motion.button
                  key={wallpaper.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWallpaperChange(wallpaper)}
                  className={`relative rounded-2xl overflow-hidden aspect-video smooth-transition ${
                    selectedWallpaper?.id === wallpaper.id && !customWallpaper ? 'ring-4 ring-white/50' : ''
                  }`}
                  style={{ background: wallpaper.value }}
                >
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/10 smooth-transition" />
                  
                  {selectedWallpaper?.id === wallpaper.id && !customWallpaper && (
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
                    <span className="text-white font-medium text-sm">{wallpaper.name}</span>
                  </div>
                </motion.button>
              ))}

              {/* Custom Wallpaper Preview */}
              {customWallpaper && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative rounded-2xl overflow-hidden aspect-video ring-4 ring-white/50"
                  style={{
                    backgroundImage: `url(${customWallpaper})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-2xl">
                      ✓
                    </div>
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white font-medium text-sm">Custom Wallpaper</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Upload Custom Wallpaper */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCustomWallpaperUpload}
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 rounded-2xl glass border-2 border-dashed border-white/20 text-center cursor-pointer hover:bg-white/5 smooth-transition"
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-neon-cyan" />
              <p className="text-white font-medium mb-1">Upload Custom Wallpaper</p>
              <p className="text-white/60 text-sm">Click to browse (JPG/PNG supported)</p>
            </motion.button>
          </motion.div>
        )}

        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">System</h3>
              <p className="text-white/60">Performance and system preferences</p>
            </div>

            {/* Performance Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl glass"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className={`w-6 h-6 ${performanceMode ? 'text-yellow-400' : 'text-white/60'}`} />
                  <div>
                    <h4 className="text-white font-semibold">Performance Mode</h4>
                    <p className="text-white/60 text-sm">Reduce animations for better performance</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={performanceMode}
                  onChange={() => {
                    setPerformanceMode(!performanceMode)
                    updateSettings({ performanceMode: !performanceMode })
                  }}
                />
              </div>
            </motion.div>

            {/* Dock Size */}
            <div className="space-y-3">
              <label className="text-white font-semibold">Dock Size</label>
              <div className="grid grid-cols-3 gap-4">
                {['small', 'medium', 'large'].map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setDockSize(size)
                      updateSettings({ dockSize: size })
                    }}
                    className={`p-4 rounded-xl smooth-transition capitalize ${
                      dockSize === size
                        ? 'bg-gradient-to-br from-neon-pink to-neon-orange text-white'
                        : 'glass text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* System Info Cards */}
            <div className="space-y-4">
              {[
                { label: 'Window Animations', value: animations ? 'Enabled' : 'Disabled' },
                { label: 'Blur Effects', value: blurEffects ? 'Enabled' : 'Disabled' },
                { label: 'Theme', value: theme === 'dark' ? 'Dark Mode' : 'Light Mode' },
              ].map((setting, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-2xl glass"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">{setting.label}</span>
                    <div className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium text-sm">
                      {setting.value}
                    </div>
                  </div>
                </motion.div>
              ))}
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
              <h3 className="text-2xl font-bold text-white mb-2">Sound & Haptics</h3>
              <p className="text-white/60">Audio and vibration settings</p>
            </div>

            {/* Volume Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-white font-semibold flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-neon-cyan" />
                  <span>Volume</span>
                </label>
                <span className="text-white/80 font-mono">{volume}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value))
                    updateSettings({ volume: Number(e.target.value) })
                  }}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ff0080 0%, #ff6b00 ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>
            </div>

            {/* Sound & Vibration Toggles */}
            <div className="space-y-4">
              {[
                { label: 'Sound Effects', description: 'Play sounds for UI interactions', enabled: soundEffects, setter: setSoundEffects },
                { label: 'Vibration', description: 'Haptic feedback on mobile devices', enabled: vibration, setter: setVibration, icon: <Smartphone className="w-5 h-5 text-neon-pink" /> },
                { label: 'Notification Sounds', description: 'Play sounds for notifications', enabled: true, setter: () => {}, icon: <Bell className="w-5 h-5 text-neon-orange" /> },
              ].map((setting, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-5 rounded-2xl glass"
                >
                  <div className="flex items-center space-x-3">
                    {setting.icon}
                    <div>
                      <h4 className="text-white font-semibold">{setting.label}</h4>
                      <p className="text-white/60 text-sm">{setting.description}</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={setting.enabled}
                    onChange={() => {
                      setting.setter(!setting.enabled)
                      updateSettings({ [setting.label.toLowerCase().replace(' ', '_')]: !setting.enabled })
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">About Device</h3>
              <p className="text-white/60">System information and details</p>
            </div>

            {/* Device Info Card */}
            <motion.div
              className="p-8 rounded-3xl bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20 backdrop-blur-xl border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-pink to-neon-orange flex items-center justify-center">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-1">Portfolio OS</h4>
                <p className="text-white/60">Version 2.0.25</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Device Name', value: 'Developer Machine' },
                  { label: 'OS Version', value: 'PortfolioOS 2.0.25' },
                  { label: 'Build Number', value: '20251120' },
                  { label: 'Theme', value: theme === 'dark' ? 'Dark Mode' : 'Light Mode' },
                  { label: 'Accent Color', value: accentColor.charAt(0).toUpperCase() + accentColor.slice(1) },
                  { label: 'Performance', value: performanceMode ? 'High Performance' : 'Balanced' },
                ].map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center py-3 border-b border-white/10 last:border-0"
                  >
                    <span className="text-white/70">{info.label}</span>
                    <span className="text-white font-medium">{info.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Legal & Credits */}
            <div className="p-6 rounded-2xl glass text-center">
              <p className="text-white/60 text-sm mb-2">Built with React, Tailwind CSS & Framer Motion</p>
              <p className="text-white/40 text-xs">© 2025 Portfolio OS. All rights reserved.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SettingsApp
