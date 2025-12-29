import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContextMenu } from '../../contexts/ContextMenuContext'

const ContextMenu = () => {
    const { menu, hideMenu } = useContextMenu()
    const menuRef = useRef(null)

    useEffect(() => {
        if (menu.visible && menuRef.current) {
            const { x, y } = menu
            const { innerWidth, innerHeight } = window
            const { offsetWidth, offsetHeight } = menuRef.current

            let finalX = x
            let finalY = y

            if (x + offsetWidth > innerWidth) finalX = innerWidth - offsetWidth - 10
            if (y + offsetHeight > innerHeight) finalY = innerHeight - offsetHeight - 10

            menuRef.current.style.left = `${finalX}px`
            menuRef.current.style.top = `${finalY}px`
        }
    }, [menu.visible, menu.x, menu.y])

    if (!menu.visible) return null

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.1 }}
                className="absolute pointer-events-auto min-w-[180px] bg-black border border-[#33ff00]/50 shadow-[8px_8px_0px_rgba(0,0,0,0.8)] backdrop-blur-md p-1.5 font-mono text-xs uppercase"
            >
                <div className="flex flex-col gap-0.5">
                    {menu.items.map((item, index) => (
                        item.separator ? (
                            <div key={`sep-${index}`} className="h-[1px] bg-[#33ff00]/20 my-1 mx-1" />
                        ) : (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    item.action()
                                    hideMenu()
                                }}
                                className={`flex items-center justify-between w-full px-3 py-1.5 transition-all duration-100 text-left group
                  ${item.danger ? 'text-red-500 hover:bg-red-500 hover:text-white' : 'text-[#33ff00] hover:bg-[#33ff00] hover:text-black'}
                `}
                            >
                                <div className="flex items-center gap-2">
                                    {item.icon && <item.icon className="w-3.5 h-3.5" />}
                                    <span>{item.label}</span>
                                </div>
                                {item.shortcut && (
                                    <span className="text-[10px] opacity-40 group-hover:opacity-100">{item.shortcut}</span>
                                )}
                            </button>
                        )
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default ContextMenu
