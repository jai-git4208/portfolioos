import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ContextMenuContext = createContext()

export const useContextMenu = () => {
    const context = useContext(ContextMenuContext)
    if (!context) {
        throw new Error('useContextMenu must be used within a ContextMenuProvider')
    }
    return context
}

export const ContextMenuProvider = ({ children }) => {
    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        items: [],
    })

    const showMenu = useCallback((event, items) => {
        event.preventDefault()
        setMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            items,
        })
    }, [])

    const hideMenu = useCallback(() => {
        setMenu(prev => ({ ...prev, visible: false }))
    }, [])

    useEffect(() => {
        const handleGlobalClick = () => {
            if (menu.visible) hideMenu()
        }
        window.addEventListener('click', handleGlobalClick)
        window.addEventListener('contextmenu', (e) => {
            // Allow the context menu to show if we explicitly call showMenu,
            // otherwise hide existing menu if clicking elsewhere.
            // This listener is mostly to hide the menu when right-clicking on areas
            // that don't have custom context menus (though usually the default browser menu would show if not prevented).
        })
        return () => {
            window.removeEventListener('click', handleGlobalClick)
        }
    }, [menu.visible, hideMenu])

    return (
        <ContextMenuContext.Provider value={{ showMenu, hideMenu, menu }}>
            {children}
        </ContextMenuContext.Provider>
    )
}
