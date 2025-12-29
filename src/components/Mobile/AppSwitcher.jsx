import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { APP_CONFIG } from '../../utils/constants'
import { Ripple } from '../Ripple'

const AppSwitcher = ({ isOpen, onClose, openWindows, onAppOpen, onWindowRestore }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed inset-0 z-[60] bg-[var(--bg-primary)]/95 backdrop-blur-sm"
                >
                    <div className="h-full flex flex-col p-4 font-mono">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 pt-2">
                            <h2 className="text-[var(--accent)] font-bold text-sm uppercase tracking-widest">
                                [RECENT_APPS]
                            </h2>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="text-[var(--accent)] border border-[var(--border-dim)] p-2 hover:bg-[var(--bg-secondary)]"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* App Cards */}
                        <div className="flex-1 overflow-y-auto">
                            {openWindows.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-[var(--text-dim)] text-xs">
                                        [NO_RECENT_APPS]
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {openWindows.map((window, index) => {
                                        const appConfig = APP_CONFIG[window.id]
                                        return (
                                            <Ripple
                                                key={window.id}
                                                className="relative p-4 border border-[var(--border-dim)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                                                onClick={() => {
                                                    if (window.minimized) {
                                                        onWindowRestore(window.id)
                                                    } else {
                                                        onAppOpen(window.id)
                                                    }
                                                    onClose()
                                                }}
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                                                >
                                                    {/* App Icon/Tag */}
                                                    <div className="text-[var(--accent)] text-lg font-bold mb-2">
                                                        {appConfig?.icon || '[APP]'}
                                                    </div>

                                                    {/* App Title */}
                                                    <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider truncate">
                                                        {appConfig?.tag || window.id}
                                                    </div>

                                                    {/* Status Indicator */}
                                                    <div className="absolute top-2 right-2">
                                                        <div className={`w-2 h-2 rounded-full ${window.minimized ? 'bg-yellow-500' : 'bg-[var(--accent)]'
                                                            }`} />
                                                    </div>
                                                </motion.div>
                                            </Ripple>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Bottom Hint */}
                        <div className="mt-4 text-center text-[var(--text-dim)] text-xs">
                            SWIPE_DOWN_TO_CLOSE
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AppSwitcher
