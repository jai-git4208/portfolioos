import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DynamicIsland = ({ showNotification }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence mode="wait">
        {showNotification ? (
          <motion.div
            key="expanded"
            initial={{ scale: 1, width: 150, height: 37 }}
            animate={{ scale: 1, width: 350, height: 80 }}
            exit={{ scale: 1, width: 150, height: 37 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-black rounded-full flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-3 px-6"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink to-neon-orange flex items-center justify-center text-xl">
                📱
              </div>
              <div>
                <p className="text-white font-semibold text-sm">App Opened</p>
                <p className="text-white/60 text-xs">Tap to view</p>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-32 h-8 bg-black rounded-full"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default DynamicIsland
