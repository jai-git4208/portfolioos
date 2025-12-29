import React from 'react'
import { APPS, APP_CONFIG } from '../../utils/constants'

const Dock = ({ onAppOpen, openWindows, onWindowRestore, hiddenApps = [] }) => {
  // Filter out hidden apps
  const visibleApps = Object.values(APPS).filter(app => !hiddenApps.includes(app))

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-[var(--bg-tertiary)] border-t border-[var(--border-dim)] flex items-center justify-center z-50">
      <div className="flex space-x-1">
        {visibleApps.map((app) => {
          const isOpen = openWindows.some(w => w.id === app && !w.minimized)
          const isMinimized = openWindows.some(w => w.id === app && w.minimized)

          return (
            <button
              key={app}
              onClick={() => {
                const window = openWindows.find(w => w.id === app)
                if (window?.minimized) {
                  onWindowRestore(app)
                } else {
                  onAppOpen(app)
                }
              }}
              className={`
                px-4 py-2 font-mono text-sm uppercase tracking-wider transition-all duration-200 border-b-2
                ${isOpen && !isMinimized ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-secondary)]' : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}
                ${isMinimized ? 'border-yellow-600 text-yellow-600' : ''}
              `}
            >
              <span className="mr-2 text-xs opacity-50">{APP_CONFIG[app].tag}</span>
              {APP_CONFIG[app].title}
            </button>
          )
        })}
      </div>
    </div>
  )
}


export default Dock
