import React from 'react'
import { motion } from 'framer-motion'
import { Code, Database, Globe, Cpu, Cloud, Shield } from 'lucide-react'

const SkillsApp = () => {
  const skillCategories = [
    {
      title: 'Frontend',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-pink-500 to-orange-500',
      skills: [
        { name: 'React.js', level: 95 },
        { name: 'JavaScript/TypeScript', level: 90 },
        { name: 'Tailwind CSS', level: 92 },
        { name: 'HTML5/CSS3', level: 95 },
        { name: 'React Native', level: 85 },
        { name: 'Framer Motion', level: 88 },
      ],
    },
    {
      title: 'Backend',
      icon: <Database className="w-8 h-8" />,
      color: 'from-purple-500 to-blue-500',
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Python', level: 85 },
        { name: 'Express.js', level: 88 },
        { name: 'MongoDB', level: 82 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'REST APIs', level: 92 },
      ],
    },
    {
      title: 'Blockchain & P2P',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-teal-500 to-cyan-500',
      skills: [
        { name: 'Mesh Networking', level: 88 },
        { name: 'WebRTC', level: 85 },
        { name: 'Decentralized Systems', level: 90 },
        { name: 'P2P Protocols', level: 87 },
        { name: 'Network Security', level: 83 },
        { name: 'Cryptography', level: 80 },
      ],
    },
    {
      title: 'DevOps & Tools',
      icon: <Cloud className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-500',
      skills: [
        { name: 'Git/GitHub', level: 93 },
        { name: 'Docker', level: 78 },
        { name: 'Linux/macOS', level: 90 },
        { name: 'CI/CD', level: 75 },
        { name: 'AWS/Cloud', level: 72 },
        { name: 'Nginx', level: 80 },
      ],
    },
  ]

  const tools = [
    { name: 'VS Code', emoji: '💻' },
    { name: 'Figma', emoji: '🎨' },
    { name: 'Postman', emoji: '📬' },
    { name: 'Terminal', emoji: '⌨️' },
    { name: 'GitHub', emoji: '🐙' },
    { name: 'Vite', emoji: '⚡' },
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Technical Skills</h1>
        <p className="text-[var(--text-secondary)]">Full-stack developer with expertise in modern web technologies</p>
      </motion.div>

      {/* Skill Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: catIndex * 0.1 }}
            className="rounded-3xl bg-[var(--bg-secondary)]/50 border border-[var(--border-dim)] p-6 hover:scale-[1.02] smooth-transition"
          >
            {/* Category Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{category.title}</h2>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIndex * 0.1 + skillIndex * 0.05 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--text-primary)] font-medium">{skill.name}</span>
                    <span className="text-[var(--text-dim)] text-sm">{skill.level}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 bg-[var(--border-dim)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{
                        delay: catIndex * 0.1 + skillIndex * 0.05 + 0.3,
                        duration: 1,
                        ease: "easeOut"
                      }}
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full relative`}
                    >
                      {/* Glow effect */}
                      <motion.div
                        animate={{ x: [-20, 200] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tools & Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl glass p-6"
      >
        <h2 className="text-2xl font-bold text-[var(--accent)] mb-6 flex items-center space-x-2">
          <Cpu className="w-8 h-8 text-[var(--accent)]" />
          <span>Tools & Technologies</span>
        </h2>

        <div className="flex flex-wrap gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-dim)] hover:bg-[var(--bg-tertiary)] smooth-transition flex items-center space-x-3 cursor-pointer"
            >
              <span className="text-3xl">{tool.emoji}</span>
              <span className="text-[var(--text-primary)] font-medium">{tool.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Years Coding', value: '5+', color: 'from-pink-500 to-orange-500' },
          { label: 'Projects Built', value: '50+', color: 'from-purple-500 to-blue-500' },
          { label: 'Technologies', value: '30+', color: 'from-teal-500 to-cyan-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} glass-strong text-center`}
          >
            <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-white/80 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default SkillsApp

