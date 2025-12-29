import React from 'react'
import { motion } from 'framer-motion'
import { Folder, FileText, Github, Terminal, Settings, Info, MessageSquare, ExternalLink, Trash2, Edit2 } from 'lucide-react'
import { useContextMenu } from '../../contexts/ContextMenuContext'

const DesktopIcon = ({ name, icon, type, onClick, initialPosition = { x: 0, y: 0 }, color = 'text-[#33ff00]' }) => {
    const getIcon = () => {
        switch (type) {
            case 'folder': return Folder
            case 'file': return FileText
            case 'github': return Github
            case 'terminal': return Terminal
            case 'settings': return Settings
            case 'about': return Info
            case 'contact': return MessageSquare
            default: return icon || Folder
        }
    }

    const IconComponent = getIcon()
    const { showMenu } = useContextMenu()

    const handleContextMenu = (e) => {
        e.stopPropagation()
        showMenu(e, [
            { label: 'Open', icon: ExternalLink, action: onClick },
            { label: 'Rename', icon: Edit2, action: () => alert('Rename coming soon!') },
            { separator: true },
            { label: 'Properties', icon: Info, action: () => alert(`Type: ${type}\nName: ${name}`) },
            { label: 'Delete', icon: Trash2, danger: true, action: () => alert('Protected system file!') },
        ])
    }

    return (
        <motion.div
            drag
            dragMomentum={false}
            style={{ left: initialPosition.x, top: initialPosition.y }}
            onDoubleClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            onContextMenu={handleContextMenu}
            className="absolute flex flex-col items-center justify-start w-24 p-2 rounded group cursor-grab active:cursor-grabbing select-none pointer-events-auto z-10 active:z-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className={`p-3 bg-black border border-[#33ff00]/30 group-hover:border-[#33ff00] transition-colors duration-200 ${color} shadow-[6px_6px_0px_rgba(0,0,0,0.5)] group-active:shadow-none group-active:translate-x-1 group-active:translate-y-1`}>
                <IconComponent className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <span className="mt-2 text-[10px] font-mono uppercase bg-black text-[#33ff00] border border-[#33ff00]/30 px-2 py-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                {name}
            </span>
        </motion.div>
    )
}

export default DesktopIcon
