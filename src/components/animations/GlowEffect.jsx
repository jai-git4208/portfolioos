import { motion } from 'framer-motion'

export const GlowEffect = ({ children, color = "pink" }) => {
  const glowColors = {
    pink: "0 0 20px rgba(255, 0, 128, 0.5), 0 0 40px rgba(255, 0, 128, 0.3)",
    blue: "0 0 20px rgba(0, 217, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)",
    purple: "0 0 20px rgba(179, 0, 255, 0.5), 0 0 40px rgba(179, 0, 255, 0.3)",
    orange: "0 0 20px rgba(255, 107, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.3)",
  }

  return (
    <motion.div
      whileHover={{
        boxShadow: glowColors[color],
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

