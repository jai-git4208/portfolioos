import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const useRipple = () => {
    const [ripples, setRipples] = useState([])

    const createRipple = useCallback((event) => {
        const button = event.currentTarget
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = event.clientX - rect.left - size / 2
        const y = event.clientY - rect.top - size / 2

        const newRipple = {
            x,
            y,
            size,
            id: Date.now(),
        }

        setRipples((prev) => [...prev, newRipple])

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
        }, 600)
    }, [])

    return { ripples, createRipple }
}

export const RippleEffect = ({ ripples }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        initial={{
                            x: ripple.x,
                            y: ripple.y,
                            width: ripple.size,
                            height: ripple.size,
                            opacity: 0.5,
                            scale: 0,
                        }}
                        animate={{
                            scale: 2,
                            opacity: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute rounded-full bg-[var(--ripple)]"
                        style={{
                            width: ripple.size,
                            height: ripple.size,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}

export const Ripple = ({ children, onClick, className = '', disabled = false }) => {
    const { ripples, createRipple } = useRipple()

    const handleClick = (e) => {
        if (!disabled) {
            createRipple(e)
            onClick?.(e)
        }
    }

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onClick={handleClick}
        >
            <RippleEffect ripples={ripples} />
            {children}
        </div>
    )
}
