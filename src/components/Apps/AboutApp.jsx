import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Globe, Github, Award } from 'lucide-react'
import { USER_INFO } from '../../utils/constants'

const AboutApp = () => {
  return (
    <div className="p-8 space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 p-8 glass"
      >
        <div className="flex items-start space-x-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-pink to-neon-orange flex items-center justify-center text-white text-4xl font-bold deep-shadow"
          >
            JP
          </motion.div>
          
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {USER_INFO.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/80 font-medium mb-4"
            >
              {USER_INFO.title}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass">
                <MapPin className="w-4 h-4 text-neon-cyan" />
                <span className="text-white/90 text-sm">{USER_INFO.location}</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass">
                <Mail className="w-4 h-4 text-neon-pink" />
                <span className="text-white/90 text-sm">{USER_INFO.email}</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass">
                <Phone className="w-4 h-4 text-neon-purple" />
                <span className="text-white/90 text-sm">{USER_INFO.phone}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-pink/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-orange/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl glass p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <span className="text-3xl">👨‍💻</span>
          <span>About Me</span>
        </h2>
        <p className="text-white/80 leading-relaxed text-lg">
          {USER_INFO.bio}
        </p>
        <p className="text-white/80 leading-relaxed text-lg mt-4">
          Aspiring to study engineering at MIT, I'm committed to leveraging global opportunities to develop revolutionary technology solutions. My focus is on building decentralized systems, AI-powered applications, and innovative platforms that solve real-world problems.
        </p>
      </motion.div>

      {/* Education Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl glass p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <span className="text-3xl">🎓</span>
          <span>Education</span>
        </h2>
        
        <div className="space-y-4">
          {USER_INFO.education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 10 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 smooth-transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{edu.school}</h3>
                  <p className="text-neon-cyan font-medium">{edu.board}</p>
                </div>
                {edu.achievement && (
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-orange text-white font-bold">
                    {edu.achievement}
                  </div>
                )}
              </div>
              <p className="text-white/60 text-sm mb-2">{edu.year}</p>
              <p className="text-white/80">{edu.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="rounded-3xl glass p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Award className="w-8 h-8 text-neon-purple" />
          <span>Certifications</span>
        </h2>
        
        <div className="grid gap-3">
          {USER_INFO.certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 smooth-transition flex items-center space-x-3"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue" />
              <span className="text-white/90">{cert}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex gap-4"
      >
        <motion.a
          href={`https://${USER_INFO.website}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 glass hover:from-neon-blue/30 hover:to-neon-cyan/30 smooth-transition flex items-center justify-center space-x-3"
        >
          <Globe className="w-6 h-6 text-neon-cyan" />
          <span className="text-white font-semibold">Visit Website</span>
        </motion.a>
        
        <motion.a
          href={`https://${USER_INFO.github}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 glass hover:from-purple-500/30 hover:to-pink-500/30 smooth-transition flex items-center justify-center space-x-3"
        >
          <Github className="w-6 h-6 text-neon-pink" />
          <span className="text-white font-semibold">GitHub Profile</span>
        </motion.a>
      </motion.div>
    </div>
  )
}

export default AboutApp

