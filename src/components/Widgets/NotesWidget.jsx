import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save } from 'lucide-react'

import { useDraggable } from '../../hooks/useDraggable'

const NotesWidget = ({ position: propPosition, onPositionChange }) => {
  const { position, handleMouseDown } = useDraggable(propPosition, onPositionChange)
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('widget_notes') || 'Quick notes...'
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    localStorage.setItem('widget_notes', notes)
  }, [notes])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        left: position.x - propPosition.x,
        top: position.y - propPosition.y,
        position: 'relative'
      }}
      className="w-72 p-4 border border-[var(--border-secondary)] bg-[var(--bg-secondary)]/90 font-mono select-none cursor-move active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-3 border-b border-[var(--border-dim)] pb-2">
        <div className="text-xs text-[var(--text-dim)] uppercase tracking-widest">
          [NOTES_BUFFER]
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(!isEditing)
          }}
          className="p-1 rounded-sm bg-[var(--bg-tertiary)] border border-[var(--border-dim)] smooth-transition no-drag"
        >
          {isEditing ? <Save className="w-3 h-3 text-[var(--accent)]" /> : <Edit3 className="w-3 h-3 text-[var(--text-primary)]" />}
        </motion.button>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={!isEditing}
        className="w-full h-36 bg-[var(--bg-tertiary)] border border-[var(--border-dim)] p-2 text-[var(--text-primary)] text-sm placeholder-[var(--text-dim)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)] smooth-transition disabled:opacity-80 no-drag font-mono"
        placeholder="WRITE_SOMETHING..."
      />
    </motion.div>
  )
}

export default NotesWidget
