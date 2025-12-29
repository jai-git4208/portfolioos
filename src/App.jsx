import React, { useState, useEffect } from 'react'
import Desktop from './components/Desktop/Desktop'
import MobileView from './components/Mobile/MobileView'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bootLines, setBootLines] = useState([
    "   ___  __  ____  ____  ____  __  __   __   __   ____  ",
    "  / __)/  \\(  _ \\(  __)(  _ \\(  )(  ) (  ) (  ) / ___) ",
    " (  _ (  O ))   / ) _)  )   / )( / (_/\\)(__ )(__\\___ \\ ",
    "  \\___/\\__/(__\\_)(__)  (__\\_)(__)\\____/____)(____|____/",
    "                                                       ",
    "Initializing PortfolioOS Kernel v1.0.0...",
    "Loading modules: [ cpu mem disk net ]",
    "mounting /dev/sda1 on / ... [ OK ]",
  ])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isLoading) {
      const bootSequence = [
        "detecting hardware...",
        "logic core: online",
        "vision systems: online",
        "audio subsys: online",
        "mounting user space...",
        "starting daemons...",
        "starting sshd... [ OK ]",
        "starting httpd... [ OK ]",
        "starting vision_matrix... [ OK ]",
        "boot sequence complete.",
        "entering graphical shell..."
      ]

      let delay = 300
      bootSequence.forEach((line, index) => {
        setTimeout(() => {
          setBootLines(prev => [...prev.slice(-15), line])
        }, delay)
        delay += Math.random() * 500 + 100
      })

      setTimeout(() => setIsLoading(false), delay + 500)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="w-full h-full bg-black p-8 font-mono text-[var(--accent)] overflow-hidden flex flex-col justify-end items-start text-sm md:text-base leading-tight">
        {bootLines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-gray-500 mr-2">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
            <span className="animate-pulse">{line}</span>
          </div>
        ))}
        <div className="flex animate-pulse">
          <span className="text-gray-500 mr-2">root@SYSTEM:~#</span>
          <span className="w-2 h-4 bg-[var(--accent)] inline-block ml-1" />
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {isMobile ? (
        <MobileView key="mobile" />
      ) : (
        <Desktop key="desktop" />
      )}
    </AnimatePresence>
  )
}

export default App
