import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock } from 'lucide-react'

const BrowserApp = () => {
  const [url, setUrl] = useState('https://jaimin.ivelosi.com')
  const [inputUrl, setInputUrl] = useState(url)

  const handleNavigate = (e) => {
    e.preventDefault()
    let newUrl = inputUrl
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl
    }
    setUrl(newUrl)
  }

  const quickLinks = [
    { name: 'GitHub', url: 'https://github.com/jai-git4208', icon: '🐙' },
    { name: 'Ivelosi', url: 'https://ivelosi.com', icon: '🔗' },
    { name: 'Portfolio', url: 'https://jaimin.ivelosi.com', icon: '💼' },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-900/50">
      {/* Browser Controls */}
      <div className="p-4 space-y-3 border-b border-white/10">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg smooth-transition"
          >
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg smooth-transition"
          >
            <ArrowRight className="w-5 h-5 text-white/80" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg smooth-transition"
          >
            <RotateCw className="w-5 h-5 text-white/80" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg smooth-transition"
          >
            <Home className="w-5 h-5 text-white/80" />
          </motion.button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleNavigate} className="flex items-center space-x-2">
          <div className="flex-1 flex items-center space-x-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <Lock className="w-4 h-4 text-green-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none placeholder-white/40"
              placeholder="Enter URL..."
            />
          </div>
        </form>

        {/* Quick Links */}
        <div className="flex space-x-2">
          {quickLinks.map((link, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setUrl(link.url)
                setInputUrl(link.url)
              }}
              className="px-4 py-2 rounded-lg glass hover:bg-white/10 smooth-transition flex items-center space-x-2"
            >
              <span>{link.icon}</span>
              <span className="text-white/80 text-sm">{link.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="Browser Content"
        />
      </div>
    </div>
  )
}

export default BrowserApp

