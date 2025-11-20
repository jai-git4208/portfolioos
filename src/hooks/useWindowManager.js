import { useState, useCallback } from 'react'

export const useWindowManager = () => {
  const [windows, setWindows] = useState([])
  const [activeWindow, setActiveWindow] = useState(null)
  const [zIndexCounter, setZIndexCounter] = useState(100)

  const openWindow = useCallback((appId, config) => {
    const existingWindow = windows.find(w => w.id === appId && !w.minimized)
    
    if (existingWindow) {
      setActiveWindow(appId)
      setZIndexCounter(prev => prev + 1)
      setWindows(prev => prev.map(w => 
        w.id === appId ? { ...w, zIndex: zIndexCounter + 1 } : w
      ))
      return
    }

    const newWindow = {
      id: appId,
      ...config,
      zIndex: zIndexCounter + 1,
      minimized: false,
      maximized: false,
      position: config.initialPosition,
      size: config.initialSize,
    }

    setWindows(prev => [...prev, newWindow])
    setActiveWindow(appId)
    setZIndexCounter(prev => prev + 1)
  }, [windows, zIndexCounter])

  const closeWindow = useCallback((appId) => {
    setWindows(prev => prev.filter(w => w.id !== appId))
    if (activeWindow === appId) {
      setActiveWindow(null)
    }
  }, [activeWindow])

  const minimizeWindow = useCallback((appId) => {
    setWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, minimized: true } : w
    ))
    if (activeWindow === appId) {
      setActiveWindow(null)
    }
  }, [activeWindow])

  const maximizeWindow = useCallback((appId) => {
    setWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, maximized: !w.maximized } : w
    ))
  }, [])

  const restoreWindow = useCallback((appId) => {
    setWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, minimized: false } : w
    ))
    setActiveWindow(appId)
    setZIndexCounter(prev => prev + 1)
    setWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, zIndex: zIndexCounter + 1 } : w
    ))
  }, [zIndexCounter])

  const focusWindow = useCallback((appId) => {
    setActiveWindow(appId)
    setZIndexCounter(prev => prev + 1)
    setWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, zIndex: zIndexCounter + 1 } : w
    ))
  }, [zIndexCounter])

  const updateWindowPosition = useCallback((appId, position) => {
    setWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, position } : w
    ))
  }, [])

  const updateWindowSize = useCallback((appId, size) => {
    setWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, size } : w
    ))
  }, [])

  return {
    windows,
    activeWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  }
}
