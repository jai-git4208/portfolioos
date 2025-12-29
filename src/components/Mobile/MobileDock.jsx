import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Globe, Code, Cpu } from 'lucide-react';
import { Ripple } from '../Ripple';
import { APPS } from '../../utils/constants';

const MobileDock = ({ onAppOpen, activeApp }) => {
    const dockApps = [
        { id: APPS.TERMINAL, icon: <Terminal className="w-6 h-6" />, label: 'TERM' },
        { id: APPS.BROWSER, icon: <Globe className="w-6 h-6" />, label: 'WWW' },
        { id: APPS.PROJECTS, icon: <Code className="w-6 h-6" />, label: 'JS' },
        { id: APPS.SKILLS, icon: <Cpu className="w-6 h-6" />, label: 'SYS' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--border-secondary)] rounded-2xl p-2 flex justify-around items-center shadow-2xl"
            >
                {dockApps.map((app) => (
                    <Ripple
                        key={app.id}
                        onClick={() => onAppOpen(app.id)}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeApp === app.id ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'text-[var(--accent)] hover:bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className="relative"
                        >
                            {app.icon}
                            {activeApp === app.id && (
                                <motion.div
                                    layoutId="dock-indicator"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full"
                                />
                            )}
                        </motion.div>
                    </Ripple>
                ))}
            </motion.div>
        </div>
    );
};

export default MobileDock;
