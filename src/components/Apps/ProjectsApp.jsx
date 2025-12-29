import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Star, GitFork, Clock } from 'lucide-react'
import { useGitHub } from '../../hooks/useGitHub'

const ProjectsApp = () => {
  const { repos, loading, error } = useGitHub()

  const featuredProjects = [
    {
      name: 'Ivelosi DNC Protocol',
      description: 'Decentralized Network Communication protocol for secure P2P mesh networking',
      tech: ['Node.js', 'WebRTC', 'React', 'Mesh Networks'],
      color: 'from-pink-500 to-orange-500',
      icon: '🔗',
      status: 'Active Development',
    },
    {
      name: 'Portfolio OS',
      description: 'Interactive desktop-like portfolio with GNOME and OxygenOS inspired design',
      tech: ['React', 'Tailwind', 'Framer Motion', 'Vite'],
      color: 'from-purple-500 to-blue-500',
      icon: '💻',
      status: 'Live',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-neon-pink border-r-neon-blue border-b-neon-purple border-l-neon-orange rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-white/80">Failed to load repositories</p>
          <p className="text-white/60 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">My Projects</h1>
        <p className="text-[var(--text-secondary)]">Building innovative solutions with cutting-edge technology</p>
      </motion.div>

      {/* Featured Projects */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center space-x-2">
          <span className="text-3xl">⭐</span>
          <span>Featured Projects</span>
        </h2>

        {featuredProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 10 }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${project.color} glass-strong cursor-pointer relative overflow-hidden group`}
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{project.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                    <span className="inline-block px-3 py-1 mt-2 rounded-full bg-white/20 text-white text-xs font-medium">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-white/90 mb-4 text-lg">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 smooth-transition" />
          </motion.div>
        ))}
      </div>

      {/* GitHub Repositories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--accent)] flex items-center space-x-2">
          <Github className="w-8 h-8 text-[var(--accent)]" />
          <span>GitHub Repositories</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {repos.map((repo, index) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-dim)] hover:bg-[var(--bg-tertiary)] smooth-transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] smooth-transition flex items-center space-x-2">
                    <span>{repo.name}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 smooth-transition" />
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm mt-1 line-clamp-2">
                    {repo.description || 'No description available'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-white/60 text-sm">
                {repo.language && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-neon-blue" />
                    <span>{repo.language}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {repo.topics.slice(0, 3).map((topic, topicIndex) => (
                    <span
                      key={topicIndex}
                      className="px-2 py-1 rounded-full bg-white/5 text-white/70 text-xs"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsApp

