import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save } from 'lucide-react'

const NotesWidget = () => {
  const [notes, setNotes] = useState('Quick notes...')
  const [isEditing, setIsEditing] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="w-72 p-6 rounded-3xl glass-strong deep-shadow bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg flex items-center space-x-2">
          <span>📝</span>
          <span>Quick Notes</span>
        </h3>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 smooth-transition"
        >
          {isEditing ? <Save className="w-4 h-4 text-white" /> : <Edit3 className="w-4 h-4 text-white" />}
        </motion.button>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={!isEditing}
        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-neon-orange smooth-transition"
        placeholder="Write something..."
      />
    </motion.div>
  )
}

export default NotesWidget

