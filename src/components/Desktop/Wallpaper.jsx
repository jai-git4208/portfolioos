import React from 'react'
import { motion } from 'framer-motion'

const Wallpaper = ({ wallpaper }) => {
  // Handle both old prop format (wallpaperId) and new format (wallpaper object/string)
  const wallpaperValue = typeof wallpaper === 'string' 
    ? wallpaper 
    : wallpaper?.value || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

  return (
    <motion.div
      key={wallpaperValue}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 -z-10"
      style={{
        background: wallpaperValue.startsWith('data:') || wallpaperValue.startsWith('http') 
          ? `url(${wallpaperValue})` 
          : wallpaperValue,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
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
  )
}

export default Wallpaper
