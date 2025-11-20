import { motion } from 'framer-motion'

export const SpringTransition = ({ children, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
