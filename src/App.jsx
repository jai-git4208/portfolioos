import React, { useState, useEffect } from 'react'
import Desktop from './components/Desktop/Desktop'
import MobileView from './components/Mobile/MobileView'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-4 border-4 border-t-neon-pink border-r-neon-blue border-b-neon-purple border-l-neon-orange rounded-full"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold gradient-text"
          >
            Portfolio OS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 mt-2"
          >
            Booting up...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {isMobile ? (
        <MobileView key="mobile" />
      ) : (
        <Desktop key="desktop" />
      )}
    </AnimatePresence>
  )
}

export default App
