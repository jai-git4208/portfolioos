import React from 'react'
import { motion } from 'framer-motion'

const DynamicIsland = ({ showNotification }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="mx-4 mt-2 p-3 bg-[var(--bg-primary)] border border-[var(--border-secondary)] font-mono"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
            <div className="flex-1">
              <p className="text-[var(--accent)] font-bold text-xs uppercase tracking-wider">
                [APP_LAUNCHED]
              </p>
              <p className="text-[var(--text-secondary)] text-xs mt-0.5">
                Initializing...
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DynamicIsland
