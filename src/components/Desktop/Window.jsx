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
import ExplorerApp from '../Apps/ExplorerApp'
import { APPS, APP_CONFIG } from '../../utils/constants'

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
      case APPS.EXPLORER:
        return <ExplorerApp />
      default:
        return (
          <div className="flex items-center justify-center h-full text-red-500 font-mono">
            [ERROR] APPLICATION_NOT_FOUND: {window.id}
          </div>
        )
    }
  }

  const windowStyle = window.maximized
    ? { top: 48, left: 0, right: 0, bottom: 0, width: '100%', height: 'calc(100% - 48px)' }
    : { left: position.x, top: position.y, width: window.size.width, height: window.size.height }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.1 }} // Instant snap
      style={{
        ...windowStyle,
        zIndex: window.zIndex,
        position: 'fixed',
      }}
      onClick={onFocus}
      className={`terminal-box flex flex-col shadow-2xl
        ${isActive ? 'border-[var(--accent)] shadow-[0_0_15px_rgba(51,255,0,0.15)]' : 'border-[var(--border-secondary)] opacity-90'} 
        transition-colors duration-100 ease-linear`}
    >
      {/* Title Bar */}
      <div
        className={`h-8 px-2 flex items-center justify-between cursor-move shrink-0 border-b border-[var(--border-dim)] ${isActive ? 'bg-[var(--accent)] text-[var(--bg-tertiary)]' : 'bg-[var(--bg-secondary)] text-[var(--text-dim)]'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Title */}
        <div className="flex items-center space-x-2 font-mono text-sm tracking-tight px-2">
          <span className="font-bold uppercase">[{APP_CONFIG[window.id]?.tag || window.id}]</span>
          <span>{window.title}</span>
        </div>

        {/* Text-based Controls */}
        <div className="flex items-center space-x-1 no-drag font-mono text-sm font-bold">
          <button
            onClick={onMinimize}
            className={`px-2 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors ${isActive ? 'hover:text-[var(--accent)]' : ''}`}
          >
            [_]
          </button>
          <button
            onClick={onMaximize}
            className={`px-2 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors ${isActive ? 'hover:text-[var(--accent)]' : ''}`}
          >
            [{window.maximized ? '^' : 'O'}]
          </button>
          <button
            onClick={onClose}
            className="px-2 hover:bg-red-600 hover:text-white transition-colors"
          >
            [X]
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[var(--bg-tertiary)] relative p-1">
        {/* Inner Grid/Scanline optional */}
        <div className="h-full w-full text-[var(--text-primary)] font-mono text-sm">
          {renderApp()}
        </div>
      </div>
    </motion.div>
  )
}

export default Window
