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
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${customWallpaper})` }}
        >
          <div className="absolute inset-0 bg-black/20" />
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
        className="absolute inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]"
      >
        {/* Retro Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(var(--text-dim) 1px, transparent 1px),
              linear-gradient(90deg, var(--text-dim) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center',
            transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
            transformOrigin: '50% 100%'
          }}
        />

        {/* Horizon Glow */}
        <div className="absolute top-1/2 left-0 right-0 h-full bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />

        {/* Dynamic Wallpaper Overlay Color */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ background: wallpaper.value }}
        />

        {/* Noise Texture for Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Floating Particles (Digital Dust) */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-0.5 h-0.5 bg-[var(--accent)] opacity-50"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * -100],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Wallpaper
