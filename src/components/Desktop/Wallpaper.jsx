import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WALLPAPERS } from '../../utils/constants'

const Wallpaper = ({ wallpaperId, customWallpaper }) => {
  // Use custom uploaded image wallpaper if available
  if (wallpaperId === 'custom' && customWallpaper) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="custom-wallpaper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${customWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`custom-particle-${i}`}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>
    )
  }

  // Use preset wallpaper
  const wallpaper = WALLPAPERS.find(w => w.id === parseInt(wallpaperId)) || WALLPAPERS[0]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={wallpaperId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 -z-10"
        style={{
          background: wallpaper.value,
        }}
      >
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`${wallpaperId}-particle-${i}`}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </motion.div>
    </AnimatePresence>
  )
}

export default Wallpaper
