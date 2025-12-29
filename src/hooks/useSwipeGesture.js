import { useState, useEffect, useRef } from 'react'

export const useSwipeGesture = (onSwipe) => {
    const touchStart = useRef({ x: 0, y: 0, time: 0 })
    const touchEnd = useRef({ x: 0, y: 0 })
    const [isActive, setIsActive] = useState(false)

    const minSwipeDistance = 50
    const maxSwipeTime = 500
    const edgeThreshold = 30

    const handleTouchStart = (e) => {
        const touch = e.touches[0]
        touchStart.current = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        }

        const isEdge =
            touch.clientX < edgeThreshold ||
            touch.clientX > window.innerWidth - edgeThreshold ||
            touch.clientY > window.innerHeight - edgeThreshold

        setIsActive(isEdge)
    }

    const handleTouchMove = (e) => {
        if (!isActive) return

        const touch = e.touches[0]
        touchEnd.current = {
            x: touch.clientX,
            y: touch.clientY
        }
    }

    const handleTouchEnd = () => {
        if (!isActive) {
            setIsActive(false)
            return
        }

        const deltaX = touchEnd.current.x - touchStart.current.x
        const deltaY = touchEnd.current.y - touchStart.current.y
        const deltaTime = Date.now() - touchStart.current.time

        if (deltaTime > maxSwipeTime) {
            setIsActive(false)
            return
        }

        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)

        if (absX < minSwipeDistance && absY < minSwipeDistance) {
            setIsActive(false)
            return
        }

        let direction = null
        let fromEdge = null

        if (touchStart.current.y > window.innerHeight - edgeThreshold && deltaY < -minSwipeDistance) {
            direction = 'up'
            fromEdge = 'bottom'
        } else if (touchStart.current.x > window.innerWidth - edgeThreshold && deltaX < -minSwipeDistance) {
            direction = 'left'
            fromEdge = 'right'
        } else if (touchStart.current.x < edgeThreshold && deltaX > minSwipeDistance) {
            direction = 'right'
            fromEdge = 'left'
        }

        if (direction && fromEdge) {
            onSwipe({ direction, fromEdge, deltaX, deltaY })
        }

        setIsActive(false)
    }

    useEffect(() => {
        document.addEventListener('touchstart', handleTouchStart)
        document.addEventListener('touchmove', handleTouchMove)
        document.addEventListener('touchend', handleTouchEnd)

        return () => {
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', handleTouchEnd)
        }
    })

    return { isActive }
}
