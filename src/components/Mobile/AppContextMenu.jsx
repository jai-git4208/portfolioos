import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, EyeOff, Info, Share2 } from 'lucide-react';

const AppContextMenu = ({ isOpen, onClose, app, position, onAction }) => {
    if (!app) return null;

    const actions = [
        { id: 'pin', label: 'PIN_TO_DOCK', icon: <Pin className="w-4 h-4" /> },
        { id: 'hide', label: 'HIDE_APP', icon: <EyeOff className="w-4 h-4" />, color: 'text-red-500' },
        { id: 'info', label: 'APP_INFO', icon: <Info className="w-4 h-4" /> },
        { id: 'share', label: 'SHARE_APP', icon: <Share2 className="w-4 h-4" /> },
    ];

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
                        className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
                    />

                    {/* Menu */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        style={{
                            left: Math.min(position.x, window.innerWidth - 220),
                            top: Math.min(position.y, window.innerHeight - 250),
                        }}
                        className="fixed z-[101] w-48 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] shadow-2xl overflow-hidden font-mono"
                    >
                        <div className="px-3 py-2 border-b border-[var(--border-dim)] bg-[var(--bg-tertiary)]">
                            <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">
                                [ {app.tag} ] ACTIONS
                            </span>
                        </div>

                        <div className="p-1">
                            {actions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => {
                                        onAction(action.id, app.id);
                                        onClose();
                                    }}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 text-xs hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors group ${action.color || 'text-[var(--text-primary)]'}`}
                                >
                                    <span className="group-hover:text-inherit">
                                        {action.icon}
                                    </span>
                                    <span className="font-bold tracking-tight">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="p-2 border-t border-[var(--border-dim)] bg-[var(--bg-tertiary)]/50">
                            <p className="text-[9px] text-[var(--text-dim)] uppercase leading-none">
                                PID: {Math.floor(Math.random() * 9000) + 1000}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AppContextMenu;
