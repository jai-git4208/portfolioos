import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Folder, FileText, Github, ChevronRight, Search, LayoutGrid, List as ListIcon, Star, GitFork, ExternalLink, Download, FileJson } from 'lucide-react'
import { useGitHub } from '../../hooks/useGitHub'
import { USER_INFO } from '../../utils/constants'

const ExplorerApp = () => {
    const [activePath, setActivePath] = useState(['Home'])
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('')
    const { repos, loading, error } = useGitHub()

    const sidebarItems = [
        { id: 'home', label: 'Home', icon: LayoutGrid, path: ['Home'] },
        { id: 'documents', label: 'Documents', icon: FileText, path: ['Home', 'Documents'] },
        { id: 'projects', label: 'Projects', icon: Github, path: ['Home', 'Projects'] },
    ]

    const files = {
        Home: [
            { name: 'Documents', type: 'folder', icon: Folder, color: 'text-blue-400' },
            { name: 'Projects', type: 'folder', icon: Github, color: 'text-purple-400' },
        ],
        Documents: [
            {
                name: 'JaiminPansal_Resume.pdf',
                type: 'file',
                icon: FileText,
                color: 'text-orange-400',
                url: '/JaiminPansal.pdf',
                action: () => window.open('/JaiminPansal.pdf', '_blank')
            },
            {
                name: 'ContactInfo.json',
                type: 'file',
                icon: FileJson,
                color: 'text-green-400',
                content: JSON.stringify(USER_INFO, null, 2)
            },
        ],
        Projects: repos.map(repo => ({
            name: repo.name,
            type: 'repo',
            icon: Github,
            color: 'text-indigo-400',
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            language: repo.language,
            action: () => window.open(repo.html_url, '_blank')
        }))
    }

    const currentFolder = activePath[activePath.length - 1]
    const currentFiles = (files[currentFolder] || []).filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const navigateTo = (folder) => {
        setActivePath(['Home', folder])
    }

    const goBack = () => {
        if (activePath.length > 1) {
            setActivePath(prev => prev.slice(0, -1))
        }
    }

    return (
        <div className="flex h-full bg-[var(--bg-primary)]/80 backdrop-blur-xl text-[var(--text-primary)] rounded-b-2xl overflow-hidden border border-white/10">
            {/* Sidebar */}
            <div className="w-56 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-2">
                <div className="px-2 mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-white/40">Quick Access</h2>
                </div>
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActivePath(item.path)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activePath[activePath.length - 1] === item.label || (item.id === 'home' && activePath.length === 1)
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 text-white'
                            : 'hover:bg-white/5 text-white/60 hover:text-white'
                            }`}
                    >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goBack}
                            disabled={activePath.length === 1}
                            className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-all"
                        >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            {activePath.map((path, i) => (
                                <React.Fragment key={path}>
                                    {i > 0 && <ChevronRight className="w-4 h-4 opacity-30" />}
                                    <span className={i === activePath.length - 1 ? 'text-white font-medium' : ''}>{path}</span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-1 max-w-md">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
                    {loading && currentFolder === 'Projects' ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin" />
                            <p className="text-white/40 text-sm animate-pulse">Syncing with GitHub...</p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                            : "flex flex-col gap-1"
                        }>
                            <AnimatePresence mode="popLayout">
                                {currentFiles.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-30">
                                        <Folder className="w-16 h-16 mb-4" />
                                        <p className="text-lg">This folder is empty</p>
                                    </div>
                                ) : (
                                    currentFiles.map((file, idx) => (
                                        <motion.div
                                            key={file.name}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: idx * 0.02 }}
                                            whileHover={{ scale: viewMode === 'grid' ? 1.05 : 1, y: -2 }}
                                            onClick={() => {
                                                if (file.type === 'folder') navigateTo(file.name)
                                                else if (file.action) file.action()
                                            }}
                                            className={`${viewMode === 'grid'
                                                ? "flex flex-col items-center p-4 rounded-2xl hover:bg-white/10 cursor-pointer border border-transparent hover:border-white/10 transition-all group"
                                                : "flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all group"
                                                }`}
                                        >
                                            <div className={`${viewMode === 'grid' ? "mb-3" : ""
                                                } relative`}>
                                                <file.icon className={`${viewMode === 'grid' ? "w-16 h-16" : "w-6 h-6"} ${file.color} drop-shadow-lg transition-transform group-hover:scale-110`} />
                                                {file.type === 'repo' && (
                                                    <div className="absolute -top-1 -right-1">
                                                        <Github className="w-4 h-4 text-white opacity-50" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`flex-1 min-w-0 w-full ${viewMode === 'grid' ? "text-center" : ""}`}>
                                                <div className="font-medium text-xs break-all line-clamp-2 text-white/90 group-hover:text-white px-1 leading-tight">
                                                    {file.name}
                                                </div>
                                                {file.type === 'repo' && (
                                                    <div className={`flex items-center gap-3 mt-1 text-[10px] text-white/40 ${viewMode === 'grid' ? "justify-center" : ""}`}>
                                                        {file.language && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                                {file.language}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Star className="w-2.5 h-2.5" />
                                                            {file.stars}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <GitFork className="w-2.5 h-2.5" />
                                                            {file.forks}
                                                        </span>
                                                    </div>
                                                )}
                                                {file.type === 'file' && !file.action && (
                                                    <div className="text-[10px] text-white/40 mt-1">
                                                        Plain Text File
                                                    </div>
                                                )}
                                            </div>

                                            {viewMode === 'list' && (
                                                <div className="flex gap-2">
                                                    {file.url && (
                                                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {file.type === 'file' && file.url && (
                                                        <a
                                                            href={file.url}
                                                            download
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="h-8 border-t border-white/5 flex items-center px-6 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                    {currentFiles.length} items | {activePath.join(' / ')}
                </div>
            </div>
        </div>
    )
}

export default ExplorerApp
