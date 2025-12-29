import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from 'lucide-react';
import { Ripple } from '../Ripple';
import { useLongPress } from '../../hooks/useLongPress';

const MobileAppIcon = ({ id, app, index, onOpen, onContextMenu, icon }) => {
    const longPressProps = useLongPress(
        (e) => {
            const touch = e.touches ? e.touches[0] : e;
            onContextMenu(app, { x: touch.clientX, y: touch.clientY });
        },
        () => onOpen(id)
    );

    return (
        <Ripple
            key={id}
            {...longPressProps}
            className="flex flex-col items-center space-y-3 p-4 border border-[var(--border-dim)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-all cursor-pointer group"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center space-y-3 w-full"
            >
                <div className="text-[var(--accent)] group-active:scale-90 transition-transform">
                    {icon || <Layout className="w-6 h-6" />}
                </div>
                <span className="text-[var(--text-secondary)] text-[9px] font-mono text-center uppercase tracking-[0.2em] font-bold">
                    {app.tag}
                </span>
            </motion.div>
        </Ripple>
    );
};

export default MobileAppIcon;
