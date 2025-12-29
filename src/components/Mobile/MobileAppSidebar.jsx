import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Monitor, Sun, Volume2, Shield, LogOut, Maximize, Minimize } from 'lucide-react';
import { USER_INFO } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';

const MobileAppSidebar = ({ isOpen, onClose, settings, isFullscreen, onToggleFullscreen }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Sidebar Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 bottom-0 z-[101] w-[80%] max-w-[300px] bg-[var(--bg-primary)] border-r border-[var(--border-secondary)] flex flex-col font-mono"
                    >
                        {/* Header / User Profile */}
                        <div className="p-6 border-b border-[var(--border-dim)] bg-[var(--bg-secondary)]/50">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 border border-[var(--accent)] flex items-center justify-center bg-[var(--bg-tertiary)]">
                                    <User className="w-6 h-6 text-[var(--accent)]" />
                                </div>
                                <button onClick={onClose} className="text-[var(--text-dim)] hover:text-[var(--accent)] p-1">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">[ {USER_INFO.name} ]</h2>
                            <p className="text-[10px] text-[var(--text-dim)] uppercase mt-1">Status: Online // Root_User</p>
                        </div>

                        {/* System Controls */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-[10px] text-[var(--accent)] uppercase font-bold tracking-[0.2em] px-2">System_Controls</h3>

                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between p-3 border border-[var(--border-dim)] bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)] transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Monitor className="w-4 h-4 text-[var(--accent)]" />
                                        <span className="text-xs text-[var(--text-primary)]">THEME_MODE</span>
                                    </div>
                                    <span className="text-[10px] text-[var(--accent)] font-bold">{theme.toUpperCase()}</span>
                                </button>

                                {/* Fullscreen Toggle */}
                                <button
                                    onClick={onToggleFullscreen}
                                    className="w-full flex items-center justify-between p-3 border border-[var(--border-dim)] bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)] transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        {isFullscreen ? <Minimize className="w-4 h-4 text-[var(--accent)]" /> : <Maximize className="w-4 h-4 text-[var(--accent)]" />}
                                        <span className="text-xs text-[var(--text-primary)]">FULLSCREEN_MODE</span>
                                    </div>
                                    <span className="text-[10px] text-[var(--accent)] font-bold">{isFullscreen ? 'ON' : 'OFF'}</span>
                                </button>

                                {/* Brightness (Visual only in sidebar for now) */}
                                <div className="p-3 border border-[var(--border-dim)] bg-[var(--bg-secondary)]/30 space-y-2">
                                    <div className="flex items-center space-x-3 text-[var(--text-primary)] mb-1">
                                        <Sun className="w-4 h-4 text-[var(--accent)]" />
                                        <span className="text-xs">BRIGHTNESS</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="20" max="100"
                                        value={settings.brightness}
                                        onChange={(e) => settings.updateBrightness(parseInt(e.target.value))}
                                        className="w-full accent-[var(--accent)] h-1 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[8px] text-[var(--text-dim)] uppercase">
                                        <span>Low</span>
                                        <span>{settings.brightness}%</span>
                                        <span>Max</span>
                                    </div>
                                </div>

                                {/* Volume */}
                                <div className="p-3 border border-[var(--border-dim)] bg-[var(--bg-secondary)]/30 space-y-2">
                                    <div className="flex items-center space-x-3 text-[var(--text-primary)] mb-1">
                                        <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                                        <span className="text-xs">VOLUME_LEVEL</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={settings.volume}
                                        onChange={(e) => settings.updateVolume(parseInt(e.target.value))}
                                        className="w-full accent-[var(--accent)] h-1 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[8px] text-[var(--text-dim)] uppercase">
                                        <span>Mute</span>
                                        <span>{settings.volume}%</span>
                                        <span>Max</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] text-[var(--accent)] uppercase font-bold tracking-[0.2em] px-2">Utility</h3>

                                <button className="w-full flex items-center space-x-3 p-3 border border-[var(--border-dim)] bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)] transition-colors">
                                    <Shield className="w-4 h-4 text-[var(--accent)]" />
                                    <span className="text-xs text-[var(--text-primary)] font-bold uppercase">Security_Logs</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-[var(--border-dim)]">
                            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase">
                                <LogOut className="w-4 h-4" />
                                <span>Terminate_Session</span>
                            </button>
                            <p className="text-[8px] text-[var(--text-dim)] text-center mt-4">
                                v2.0.4-STABLE // BUILD_2025
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileAppSidebar;
