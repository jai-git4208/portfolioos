import { useState, useCallback, useRef, useEffect } from 'react'

export const useDraggable = (initialPosition, onPositionChange) => {
  const [position, setPosition] = useState(initialPosition)
  const isDraggingRef = useRef(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const elementStartPos = useRef({ x: 0, y: 0 })

  // Sync position when external position changes
  useEffect(() => {
    setPosition(initialPosition)
  }, [initialPosition.x, initialPosition.y])

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return

    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    const clientY = e.clientY ?? e.touches?.[0]?.clientY

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
    isDraggingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchmove', handleMouseMove)
    document.removeEventListener('touchend', handleMouseUp)
  }, [handleMouseMove])

  const handleMouseDown = useCallback((e) => {
    // Ignore if clicking on no-drag elements
    if (e.target.closest('.no-drag')) return

    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    const clientY = e.clientY ?? e.touches?.[0]?.clientY

    isDraggingRef.current = true
    dragStartPos.current = { x: clientX, y: clientY }
    elementStartPos.current = position

    // Attach listeners immediately
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleMouseMove, { passive: false })
    document.addEventListener('touchend', handleMouseUp)

    if (e.cancelable) {
      e.preventDefault()
    }
  }, [position, handleMouseMove, handleMouseUp])

  return {
    isDragging: isDraggingRef.current,
    position,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
