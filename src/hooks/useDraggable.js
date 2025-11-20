import { useState, useCallback, useRef, useEffect } from 'react'

export const useDraggable = (initialPosition, onPositionChange) => {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const elementStartPos = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.no-drag')) return
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    setIsDragging(true)
    isDraggingRef.current = true
    dragStartPos.current = { x: clientX, y: clientY }
    elementStartPos.current = position
    e.preventDefault()
  }, [position])

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return

    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    const deltaX = clientX - dragStartPos.current.x
    const deltaY = clientY - dragStartPos.current.y

    const newPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 200, elementStartPos.current.x + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - 100, elementStartPos.current.y + deltaY)),
    }

    setPosition(newPosition)
    onPositionChange?.(newPosition)
  }, [onPositionChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    isDraggingRef.current = false
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleMouseMove, { passive: false })
      window.addEventListener('touchend', handleMouseUp)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchmove', handleMouseMove)
        window.removeEventListener('touchend', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    isDragging,
    position,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
