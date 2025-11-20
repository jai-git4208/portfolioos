import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, HardDrive, Activity } from 'lucide-react'

const SystemStatsWidget = () => {
  const [stats, setStats] = useState({
    cpu: 45,
    ram: 62,
    storage: 78,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 30,
        ram: Math.floor(Math.random() * 20) + 50,
        storage: 78,
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const StatBar = ({ label, value, icon, color }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-white/80 text-sm">{label}</span>
        </div>
        <span className="text-white font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="w-72 p-6 rounded-3xl glass-strong deep-shadow bg-gradient-to-br from-teal-500/20 to-cyan-500/20"
    >
      <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
        <Activity className="w-5 h-5 text-neon-cyan" />
        <span>System Stats</span>
      </h3>

      <div className="space-y-4">
        <StatBar
          label="CPU"
          value={stats.cpu}
          icon={<Cpu className="w-4 h-4 text-neon-pink" />}
          color="from-pink-500 to-orange-500"
        />
        <StatBar
          label="RAM"
          value={stats.ram}
          icon={<Activity className="w-4 h-4 text-neon-purple" />}
          color="from-purple-500 to-blue-500"
        />
        <StatBar
          label="Storage"
          value={stats.storage}
          icon={<HardDrive className="w-4 h-4 text-neon-cyan" />}
          color="from-teal-500 to-cyan-500"
        />
      </div>
    </motion.div>
  )
}

export default SystemStatsWidget

