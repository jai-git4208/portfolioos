import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { APP_CONFIG, APPS } from '../../utils/constants'

const Spotlight = ({ onClose, onAppOpen }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const apps = Object.entries(APP_CONFIG).filter(([id, app]) =>
    app.title.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % apps.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + apps.length) % apps.length)
      } else if (e.key === 'Enter' && apps.length > 0) {
        onAppOpen(apps[selectedIndex][0])
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [apps, selectedIndex, onAppOpen, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-start justify-center pt-32"
    >
      <motion.div
        initial={{ scale: 0.9, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-strong rounded-3xl p-6 deep-shadow"
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-6 h-6" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applications..."
            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl 
              text-white text-lg placeholder-white/40 focus:outline-none focus:ring-2 
              focus:ring-neon-pink focus:border-transparent smooth-transition"
          />
        </div>

        {/* Results */}
        <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {apps.map(([id, app], index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  onAppOpen(id)
                  onClose()
                }}
                className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer smooth-transition
                  ${selectedIndex === index
                    ? 'bg-white/10 ring-2 ring-neon-pink'
                    : 'hover:bg-white/5'
                  }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} 
                  flex items-center justify-center text-3xl`}>
                  {app.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{app.title}</div>
                  <div className="text-white/60 text-sm">Application</div>
                </div>
                <kbd className="px-3 py-1 bg-white/10 rounded text-white/60 text-sm">
                  {selectedIndex === index && '↵'}
                </kbd>
              </motion.div>
            ))}
          </AnimatePresence>

          {apps.length === 0 && query && (
            <div className="text-center py-12 text-white/40">
              No applications found for "{query}"
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Spotlight
