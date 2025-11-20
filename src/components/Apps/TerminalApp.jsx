import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { USER_INFO } from '../../utils/constants'

const TerminalApp = () => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentPath, setCurrentPath] = useState('~')
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  useEffect(() => {
    // Welcome message
    setHistory([
      { type: 'output', content: `Welcome to ${USER_INFO.name}'s Portfolio Terminal v2.0` },
      { type: 'output', content: 'Type "help" for available commands' },
      { type: 'output', content: '' },
    ])
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    // Focus input on mount and when clicking terminal
    inputRef.current?.focus()
  }, [])

  const fileSystem = {
    '~': ['projects', 'skills', 'about.txt', 'contact.txt'],
    '~/projects': ['portfolio-os', 'mesh-network', 'ai-chatbot'],
    '~/skills': ['frontend.txt', 'backend.txt', 'other.txt'],
  }

  const commands = {
    help: () => [
      'Available commands:',
      '',
      '  help           - Show this help message',
      '  clear          - Clear the terminal',
      '  whoami         - Display current user info',
      '  neofetch       - Display system information',
      '  ls             - List directory contents',
      '  cd [dir]       - Change directory',
      '  pwd            - Print working directory',
      '  cat [file]     - Display file contents',
      '  about          - About me',
      '  skills         - My technical skills',
      '  projects       - View my projects',
      '  contact        - Get contact information',
      '  github         - Open GitHub profile',
      '  sudo rm -rf /  - DON\'T TRY THIS! (just kidding, try it)',
      '  exit           - Close terminal',
      '',
    ],

    clear: () => {
      setHistory([])
      return null
    },

    whoami: () => [
      USER_INFO.name,
      USER_INFO.title,
      `Location: ${USER_INFO.location}`,
      `Email: ${USER_INFO.email}`,
      '',
    ],

    neofetch: () => [
      '                 ',
      '      ██╗██████╗ ',
      '      ██║██╔══██╗',
      '      ██║██████╔╝',
      '      ██║██╔═══╝ ',
      '      ██║██║     ',
      '      ╚═╝╚═╝     ',
      '                 ',
      `  USER: ${USER_INFO.name}`,
      `  ROLE: ${USER_INFO.title}`,
      `  LOCATION: ${USER_INFO.location}`,
      `  OS: Portfolio OS v2.0`,
      `  SHELL: bash`,
      `  TERMINAL: WebTerminal`,
      `  UPTIME: ${Math.floor(performance.now() / 1000)}s`,
      '',
    ],

    ls: () => {
      const contents = fileSystem[currentPath] || ['No such directory']
      return contents.map(item => `  ${item}`)
    },

    pwd: () => [currentPath],

    cd: (args) => {
      if (!args[0]) return ['Usage: cd [directory]']
      
      if (args[0] === '..') {
        if (currentPath === '~') return ['Already at root directory']
        const parts = currentPath.split('/')
        parts.pop()
        const newPath = parts.join('/') || '~'
        setCurrentPath(newPath)
        return [`Changed directory to ${newPath}`]
      }
      
      const newPath = currentPath === '~' ? `~/${args[0]}` : `${currentPath}/${args[0]}`
      
      if (fileSystem[newPath]) {
        setCurrentPath(newPath)
        return [`Changed directory to ${newPath}`]
      }
      
      return [`cd: ${args[0]}: No such directory`]
    },

    cat: (args) => {
      if (!args[0]) return ['Usage: cat [file]']
      
      const files = {
        'about.txt': [
          USER_INFO.bio,
          '',
          'Education:',
          ...USER_INFO.education.map(edu => `  ${edu.school} - ${edu.board} (${edu.year})`),
          '',
        ],
        'contact.txt': [
          'Contact Information:',
          '',
          `Email: ${USER_INFO.email}`,
          `Phone: ${USER_INFO.phone}`,
          `Location: ${USER_INFO.location}`,
          `GitHub: ${USER_INFO.github}`,
          '',
        ],
        'frontend.txt': [
          'Frontend Skills:',
          '  - React.js',
          '  - TypeScript',
          '  - Tailwind CSS',
          '  - Framer Motion',
          '',
        ],
        'backend.txt': [
          'Backend Skills:',
          '  - Node.js',
          '  - Python',
          '  - Express.js',
          '  - MongoDB',
          '',
        ],
        'other.txt': [
          'Other Skills:',
          '  - Mesh Networking',
          '  - WebRTC',
          '  - Git',
          '  - Linux',
          '',
        ],
      }
      
      return files[args[0]] || [`cat: ${args[0]}: No such file`]
    },

    about: () => [
      `Hi! I'm ${USER_INFO.name}`,
      '',
      USER_INFO.bio,
      '',
      'Type "cat about.txt" for more details',
      '',
    ],

    skills: () => [
      'Technical Skills:',
      '',
      '  Frontend: React.js, TypeScript, Tailwind CSS',
      '  Backend: Node.js, Python, Express.js',
      '  Other: Mesh Networking, WebRTC, Git',
      '',
      'Type "ls ~/skills" and "cat [file]" for details',
      '',
    ],

    projects: () => [
      'Featured Projects:',
      '',
      '  1. Portfolio OS - Interactive portfolio website',
      '  2. Mesh Network - Decentralized communication',
      '  3. AI Chatbot - Intelligent conversation bot',
      '',
      `Visit: https://${USER_INFO.github}`,
      '',
    ],

    contact: () => [
      'Contact Me:',
      '',
      `  Email: ${USER_INFO.email}`,
      `  Phone: ${USER_INFO.phone}`,
      `  Location: ${USER_INFO.location}`,
      `  GitHub: https://${USER_INFO.github}`,
      '',
    ],

    github: () => {
      window.open(`https://${USER_INFO.github}`, '_blank')
      return [`Opening GitHub profile...`]
    },

    'sudo rm -rf /': () => [
      '',
      '⚠️  WARNING: CRITICAL SYSTEM OPERATION DETECTED ⚠️',
      '',
      '┌─────────────────────────────────────────┐',
      '│  You are about to delete EVERYTHING!    │',
      '│  This will destroy the universe...      │',
      '│  Just kidding! But watch this...        │',
      '└─────────────────────────────────────────┘',
      '',
      '[████████████████████████████] 100%',
      '',
      '💥 System destroyed successfully!',
      '🔄 Rebooting universe in 3... 2... 1...',
      '',
      '...just kidding! Refreshing page instead 😎',
      '',
    ].concat(
      // Actually refresh after 3 seconds
      setTimeout(() => window.location.reload(), 3000),
      []
    ),

    exit: () => {
      return ['Goodbye! 👋']
    },

    echo: (args) => [args.join(' ')],

    date: () => [new Date().toString()],

    history: () => commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`),
  }

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    // Add to history
    setHistory(prev => [...prev, { type: 'input', content: `${currentPath} $ ${trimmedCmd}` }])
    setCommandHistory(prev => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    // Parse command
    const parts = trimmedCmd.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Execute command
    if (commands[command]) {
      const output = commands[command](args)
      if (output) {
        setHistory(prev => [...prev, ...output.map(line => ({ type: 'output', content: line }))])
      }
    } else {
      setHistory(prev => [...prev, { type: 'output', content: `Command not found: ${command}. Type "help" for available commands.` }])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    executeCommand(input)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  return (
    <div 
      className="h-full w-full bg-black/95 text-green-400 font-mono text-sm p-4 md:p-6 overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-green-400/20">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-green-400/60 text-xs ml-4">
          {USER_INFO.name}@portfolio-os: {currentPath}
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-y-auto mb-4 space-y-1 scrollbar-thin scrollbar-thumb-green-400/20 scrollbar-track-transparent"
      >
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className={`${item.type === 'input' ? 'text-green-400 font-semibold' : 'text-green-300/80'} whitespace-pre-wrap break-words`}
          >
            {item.content}
          </motion.div>
        ))}
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <span className="text-green-400 font-semibold flex-shrink-0">
          {currentPath} $
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-green-400"
        >
          ▋
        </motion.span>
      </form>
    </div>
  )
}

export default TerminalApp
