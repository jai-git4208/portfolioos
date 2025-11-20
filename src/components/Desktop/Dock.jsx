import React, { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { APPS, APP_CONFIG } from '../../utils/constants'

const DockIcon = ({ app, isOpen, onClick, mouseX }) => {
  const iconRef = React.useRef(null)
  
  const distance = useTransform(mouseX, (val) => {
    const bounds = iconRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [60, 80, 60])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.div
      ref={iconRef}
      style={{ width }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="relative cursor-pointer"
    >
      <motion.div
        className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${APP_CONFIG[app].color} 
          flex items-center justify-center text-4xl deep-shadow relative overflow-hidden
          hover:shadow-2xl smooth-transition`}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 hover:opacity-100 smooth-transition" />
        
        <span className="relative z-10">{APP_CONFIG[app].icon}</span>
        
        {/* Reflection */}
        <div className="absolute -bottom-1 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent blur-sm" />
      </motion.div>

      {/* Active Indicator */}
      {isOpen && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: -5 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 
          rounded-lg glass-strong text-white text-sm whitespace-nowrap pointer-events-none"
      >
        {APP_CONFIG[app].title}
      </motion.div>
    </motion.div>
  )
}

const Dock = ({ onAppOpen, openWindows, onWindowRestore }) => {
  const mouseX = useMotionValue(Infinity)

  const apps = Object.values(APPS)

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className="pointer-events-auto"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        <div className="flex items-end space-x-3 px-6 py-4 rounded-3xl glass-strong deep-shadow">
          {/* Dock Divider */}
          <div className="w-px h-12 bg-white/20 mx-2" />
          
          {apps.map(app => (
            <DockIcon
              key={app}
              app={app}
              isOpen={openWindows.some(w => w.id === app && !w.minimized)}
              onClick={() => {
                const window = openWindows.find(w => w.id === app)
                if (window?.minimized) {
                  onWindowRestore(app)
                } else {
                  onAppOpen(app)
                }
              }}
              mouseX={mouseX}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dock
