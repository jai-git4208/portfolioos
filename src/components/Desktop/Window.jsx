import React from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react'
import { useDraggable } from '../../hooks/useDraggable'
import AboutApp from '../Apps/AboutApp'
import SkillsApp from '../Apps/SkillsApp'
import ProjectsApp from '../Apps/ProjectsApp'
import ContactApp from '../Apps/ContactApp'
import TerminalApp from '../Apps/TerminalApp'
import BrowserApp from '../Apps/BrowserApp'
import SettingsApp from '../Apps/SettingsApp'
import { APPS } from '../../utils/constants'

const Window = ({
  window,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
  desktopSettings,
}) => {
  const {
    position,
    handleMouseDown,
  } = useDraggable(window.position, onPositionChange)

  const renderApp = () => {
    switch (window.id) {
      case APPS.ABOUT:
        return <AboutApp />
      case APPS.SKILLS:
        return <SkillsApp />
      case APPS.PROJECTS:
        return <ProjectsApp />
      case APPS.CONTACT:
        return <ContactApp />
      case APPS.TERMINAL:
        return <TerminalApp />
      case APPS.BROWSER:
        return <BrowserApp />
      case APPS.SETTINGS:
        return <SettingsApp settings={desktopSettings} />
      default:
        return null
    }
  }

  const windowStyle = window.maximized
    ? { top: 48, left: 0, right: 0, bottom: 0, width: '100%', height: 'calc(100% - 48px)' }
    : { left: position.x, top: position.y, width: window.size.width, height: window.size.height }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        ...windowStyle,
        zIndex: window.zIndex,
        position: 'fixed',
      }}
      onClick={onFocus}
      className={`rounded-2xl glass-strong deep-shadow overflow-hidden flex flex-col
        ${isActive ? 'ring-2 ring-white/30' : ''} smooth-transition`}
    >
      {/* Title Bar */}
      <div
        className={`h-12 bg-gradient-to-r ${window.color} px-4 flex items-center justify-between cursor-move relative`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Traffic Lights */}
        <div className="flex items-center space-x-2 no-drag">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 smooth-transition"
          />
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 smooth-transition"
          />
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 smooth-transition"
          />
        </div>

        {/* Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
          <span className="text-2xl">{window.icon}</span>
          <span className="text-white font-semibold">{window.title}</span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center space-x-2 no-drag">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onMinimize}
            className="p-1.5 rounded-lg smooth-transition"
          >
            <Minus className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onMaximize}
            className="p-1.5 rounded-lg smooth-transition"
          >
            {window.maximized ? (
              <Minimize2 className="w-4 h-4 text-white" />
            ) : (
              <Maximize2 className="w-4 h-4 text-white" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 rounded-lg smooth-transition"
          >
            <X className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-black/20 backdrop-blur-sm">
        {renderApp()}
      </div>
    </motion.div>
  )
}

export default Window
