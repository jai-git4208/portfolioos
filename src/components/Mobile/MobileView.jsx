import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import MobileTopbar from './MobileTopbar'
import MobileWidgets from './MobileWidgets'
import DynamicIsland from './DynamicIsland'
import TerminalApp from '../Apps/TerminalApp'
import { APPS, APP_CONFIG, USER_INFO } from '../../utils/constants'

const MobileView = () => {
  const [activeApp, setActiveApp] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const { scrollY } = useScroll()
  
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])

  // Fetch GitHub repos when Projects app opens
  React.useEffect(() => {
    if (activeApp === APPS.PROJECTS) {
      setLoading(true)
      fetch('https://api.github.com/users/jai-git4208/repos?sort=updated&per_page=10')
        .then(res => res.json())
        .then(data => {
          setRepos(data)
          setLoading(false)
        })
        .catch(() => {
          setRepos([])
          setLoading(false)
        })
    }
  }, [activeApp])

  const apps = Object.entries(APP_CONFIG)

  const renderAppContent = () => {
    switch (activeApp) {
      case APPS.ABOUT:
        return <AboutMobile onClose={() => setActiveApp(null)} />
      case APPS.SKILLS:
        return <SkillsMobile onClose={() => setActiveApp(null)} />
      case APPS.PROJECTS:
        return <ProjectsMobile onClose={() => setActiveApp(null)} repos={repos} loading={loading} />
      case APPS.CONTACT:
        return <ContactMobile onClose={() => setActiveApp(null)} />
      case APPS.TERMINAL:
        return <TerminalMobile onClose={() => setActiveApp(null)} />
      case APPS.SETTINGS:
        return <SettingsMobile onClose={() => setActiveApp(null)} />
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900">
      <div className="relative w-full max-w-md h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated Background */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20"
        >
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Dynamic Island */}
        <DynamicIsland showNotification={showNotification} />

        {/* Main Content */}
        {!activeApp ? (
          <div ref={scrollRef} className="relative h-full overflow-y-auto">
            {/* Top Bar */}
            <MobileTopbar />

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-12 text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-orange flex items-center justify-center text-white text-5xl font-bold deep-shadow"
              >
                JP
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-3"
              >
                {USER_INFO.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-lg mb-2"
              >
                {USER_INFO.title}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/60"
              >
                📍 {USER_INFO.location}
              </motion.p>
            </motion.div>

            {/* Widgets Section */}
            <MobileWidgets />

            {/* App Grid */}
            <div className="px-6 py-8">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-white mb-6"
              >
                Apps
              </motion.h2>

              <div className="grid grid-cols-4 gap-4">
                {apps.map(([id, app], index) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setActiveApp(id)
                      setShowNotification(true)
                      setTimeout(() => setShowNotification(false), 3000)
                    }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-3xl deep-shadow`}>
                      {app.icon}
                    </div>
                    <span className="text-white/90 text-xs font-medium text-center">
                      {app.title}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-8">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-white mb-6"
              >
                Quick Actions
              </motion.h2>

              <div className="space-y-3">
                {[
                  { label: 'Download Resume', icon: '📄', color: 'from-blue-500 to-cyan-500', href: USER_INFO.resume },
                  { label: 'View GitHub', icon: '🐙', color: 'from-purple-500 to-pink-500', href: 'https://github.com/jai-git4208' },
                  { label: 'Send Email', icon: '✉️', color: 'from-orange-500 to-red-500', href: `mailto:${USER_INFO.email}` },
                ].map((action, index) => (
                  <motion.a
                    key={index}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-5 rounded-2xl bg-gradient-to-r ${action.color} glass-strong flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{action.icon}</span>
                      <span className="text-white font-semibold text-lg">{action.label}</span>
                    </div>
                    <span className="text-white/80">→</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="px-6 py-12 text-center text-white/60"
            >
              <p>Made with ❤️ by {USER_INFO.name}</p>
              <p className="text-sm mt-2">Portfolio OS v2.0</p>
            </motion.div>
          </div>
        ) : (
          renderAppContent()
        )}
      </div>
    </div>
  )
}

// Mobile App Components
const AboutMobile = ({ onClose }) => (
  <motion.div
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl overflow-y-auto"
  >
    <div className="p-6">
      <button onClick={onClose} className="text-white text-2xl mb-6">← Back</button>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">About Me</h1>
          <p className="text-white/80 text-lg leading-relaxed">{USER_INFO.bio}</p>
        </motion.div>

        {USER_INFO.education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="p-5 rounded-2xl glass"
          >
            <h3 className="text-xl font-bold text-white mb-2">{edu.school}</h3>
            <p className="text-neon-cyan font-medium mb-1">{edu.board}</p>
            <p className="text-white/60 text-sm mb-2">{edu.year}</p>
            {edu.achievement && (
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-neon-pink to-neon-orange text-white font-bold text-sm">
                {edu.achievement}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
)

const SkillsMobile = ({ onClose }) => {
  const skills = [
    { name: 'React.js', level: 95, color: 'from-pink-500 to-rose-500' },
    { name: 'Node.js', level: 90, color: 'from-green-500 to-emerald-500' },
    { name: 'TypeScript', level: 88, color: 'from-blue-500 to-cyan-500' },
    { name: 'Python', level: 85, color: 'from-yellow-500 to-orange-500' },
    { name: 'Tailwind CSS', level: 92, color: 'from-teal-500 to-cyan-500' },
    { name: 'Mesh Networking', level: 88, color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl overflow-y-auto"
    >
      <div className="p-6">
        <button onClick={onClose} className="text-white text-2xl mb-6">← Back</button>

        <h1 className="text-4xl font-bold text-white mb-8 text-center">My Skills</h1>

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl glass"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold text-lg">{skill.name}</span>
                <span className="text-white/80">{skill.level}%</span>
              </div>

              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 1 }}
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const ProjectsMobile = ({ onClose, repos, loading }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl overflow-y-auto"
    >
      <div className="p-6">
        <button onClick={onClose} className="text-white text-2xl mb-6">← Back</button>

        <h1 className="text-4xl font-bold text-white mb-8 text-center">My Projects</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-t-neon-pink border-r-neon-blue border-b-neon-purple border-l-neon-orange rounded-full"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {repos.slice(0, 8).map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="block p-5 rounded-2xl glass hover:bg-white/10"
              >
                <h3 className="text-white font-bold text-lg mb-2">{repo.name}</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">
                  {repo.description || 'No description'}
                </p>
                <div className="flex items-center space-x-4 text-white/60 text-sm">
                  {repo.language && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-neon-blue" />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <span>⭐ {repo.stargazers_count}</span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const ContactMobile = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.href = `mailto:${USER_INFO.email}?subject=Message from ${formData.name}&body=${formData.message}`
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl overflow-y-auto"
    >
      <div className="p-6">
        <button onClick={onClose} className="text-white text-2xl mb-6">← Back</button>

        <h1 className="text-4xl font-bold text-white mb-8 text-center">Contact Me</h1>

        <div className="space-y-4 mb-8">
          {[
            { icon: '✉️', label: 'Email', value: USER_INFO.email },
            { icon: '📞', label: 'Phone', value: USER_INFO.phone },
            { icon: '📍', label: 'Location', value: USER_INFO.location },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl glass flex items-center space-x-4"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-white/60 text-sm">{item.label}</p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-neon-pink"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-neon-pink"
          />
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows="4"
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-neon-pink resize-none"
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-pink to-neon-orange text-white font-bold text-lg"
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}

const TerminalMobile = ({ onClose }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-black"
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-green-400/20">
          <button onClick={onClose} className="text-green-400 text-xl">← Back</button>
          <span className="text-green-400/60 text-sm">Terminal</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <TerminalApp />
        </div>
      </div>
    </motion.div>
  )
}

const SettingsMobile = ({ onClose }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-xl overflow-y-auto"
    >
      <div className="p-6">
        <button onClick={onClose} className="text-white text-2xl mb-6">← Back</button>

        <h1 className="text-4xl font-bold text-white mb-8 text-center">Settings</h1>

        <div className="space-y-4">
          {[
            { icon: '🎨', label: 'Appearance', value: 'System' },
            { icon: '🔔', label: 'Notifications', value: 'Enabled' },
            { icon: '🌐', label: 'Language', value: 'English' },
            { icon: '🔒', label: 'Privacy', value: 'Secure' },
          ].map((setting, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl glass flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{setting.icon}</span>
                <span className="text-white font-semibold">{setting.label}</span>
              </div>
              <span className="text-white/60">{setting.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default MobileView
