import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSystem } from '../../utils/fileSystem'

// Shared file system instance for persistence
const sharedFileSystem = new FileSystem()
import { USER_INFO } from '../../utils/constants'

const TerminalApp = () => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentPath, setCurrentPath] = useState('/home/jaimin')
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const audioRef = useRef(null)

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

  useEffect(() => {
    // Initialize and play terminal music
    if (!audioRef.current) {
      audioRef.current = new Audio('/zoltraak.mp3')
      audioRef.current.loop = true

      // Get volume from localStorage
      const savedVolume = localStorage.getItem('desktop_volume')
      const volume = savedVolume ? parseInt(savedVolume) : 100
      audioRef.current.volume = volume / 100

      // Play with error handling
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Terminal music autoplay prevented:', error)
        })
      }
    }

    // Listen for volume changes
    const handleVolumeChange = (e) => {
      if (audioRef.current) {
        audioRef.current.volume = e.detail / 100
      }
    }
    window.addEventListener('volume-change', handleVolumeChange)

    return () => {
      window.removeEventListener('volume-change', handleVolumeChange)
      // Stop music when terminal closes
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
    }
  }, [])



  const commands = {
    help: () => [
      'Available commands:',
      '',
      '  SYSTEM:',
      '    neofetch       - Display system info',
      '    uname -a       - Kernel info',
      '    uptime         - System uptime',
      '    whoami         - Current user',
      '    df, du, free   - Disk/Memory usage',
      '    sudo [cmd]     - Execute as superuser',
      '',
      '  FILE OPERATIONS:',
      '    ls, cd, pwd    - Navigation',
      '    mkdir, touch   - Create items',
      '    cp, mv, rm     - Manipulate items',
      '    cat, less, more- View content',
      '    find, grep     - Search',
      '    tar, zip, gzip - Archives',
      '',
      '  NETWORK:',
      '    ping, curl     - Basic network tools',
      '    wget           - Download files',
      '    ifconfig       - Network config',
      '    ssh, netstat   - Remote & Stats',
      '    dig, nslookup  - DNS tools',
      '',
      '  DEVELOPMENT:',
      '    git            - Version control',
      '    npm, node      - JS runtime',
      '    python         - Python interpreter',
      '    docker         - Container tools',
      '',
      '  MISC:',
      '    clear, date    - Utilities',
      '    ps, top, kill  - Process management',
      '    fortune        - Random quote',
      '    cowsay, matrix - Fun commands',
      '    konami code    - (Try it on desktop!)',
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
      { type: 'image', content: '/jai.png' },
      '',
      `  USER: ${USER_INFO.name}`,
      `  ROLE: ${USER_INFO.title}`,
      `  LOCATION: ${USER_INFO.location}`,
      `  OS: Portfolio OS v2.0`,
      `  SHELL: bash`,
      `  TERMINAL: WebTerminal`,
      `  UPTIME: ${Math.floor(performance.now() / 1000)}s`,
      '',
    ],

    ls: (args) => {
      const targetPath = args[0] || currentPath
      const result = sharedFileSystem.ls(targetPath, currentPath)
      if (!result) return [`ls: cannot access '${targetPath}': No such file or directory`]
      return result
    },

    pwd: () => [currentPath],

    cd: (args) => {
      const target = args[0] || '~'
      const resolved = sharedFileSystem.resolve(target, currentPath)
      if (!resolved) return [`cd: ${target}: No such file or directory`]
      if (resolved.node.type !== 'dir') return [`cd: ${target}: Not a directory`]
      setCurrentPath(resolved.path)
      return null
    },

    cat: (args) => {
      if (!args[0]) return ['Usage: cat [file]']
      const resolved = sharedFileSystem.resolve(args[0], currentPath)
      if (!resolved) return [`cat: ${args[0]}: No such file or directory`]
      if (resolved.node.type === 'dir') return [`cat: ${args[0]}: Is a directory`]
      const content = resolved.node.content
      return Array.isArray(content) ? content : (content ? content.split('\n') : [])
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

    sudo: (args) => {
      if (!args[0]) return ['Usage: sudo [command]']
      const cmd = args[0]
      const cmdArgs = args.slice(1)

      // Special case for rm -rf /
      if (cmd === 'rm' && cmdArgs[0] === '-rf' && cmdArgs[1] === '/') {
        return commands['sudo rm -rf /']()
      }

      if (commands[cmd]) {
        return [`[sudo] password for ${USER_INFO.name}: **********`, ...commands[cmd](cmdArgs)]
      }
      return [`sudo: ${cmd}: command not found`]
    },

    // System Commands
    reboot: () => ['Simulating system reboot...', 'System halting...', 'Rebooting...'],
    shutdown: () => ['System is shutting down now...'],
    df: () => ['Filesystem     1K-blocks     Used Available Use% Mounted on', '/dev/root       1024000   256000    768000  25% /'],
    du: () => ['4.0K    ./.config', '120K    ./projects', '350K    ./skills', '500K    .'],
    free: () => ['              total        used        free      shared  buff/cache   available', 'Mem:        8192000     2048000     4096000      128000     2048000     5696000'],
    chmod: (args) => args[0] ? [`Changing permissions of ${args[0]} to ${args[1] || '755'}`] : ['Usage: chmod [mode] [file]'],
    chown: (args) => args[0] ? [`Changed owner of ${args[0]} to ${args[1] || 'root'}`] : ['Usage: chown [owner] [file]'],
    useradd: (args) => args[0] ? [`Created user: ${args[0]}`] : ['Usage: useradd [username]'],
    passwd: () => ['Changing password for user jaimin.', 'Current password: ', 'passwd: Authentication token manipulation error'],

    // Network Commands
    ifconfig: () => [
      'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
      '        inet 192.168.1.71  netmask 255.255.255.0  broadcast 192.168.1.255',
      '        ether 00:1a:2b:3c:4d:5e  txqueuelen 1000  (Ethernet)',
      '        RX packets 12345  bytes 12345678 (11.7 MiB)',
      '        TX packets 54321  bytes 87654321 (83.5 MiB)',
    ],
    netstat: () => [
      'Active Internet connections (w/o servers)',
      'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
      'tcp        0      0 portfolio-os:http       client-ip:54321         ESTABLISHED',
      'tcp        0      0 portfolio-os:ssh        admin-ip:22             ESTABLISHED',
    ],
    traceroute: (args) => [
      `traceroute to ${args[0] || 'google.com'} (8.8.8.8), 30 hops max, 60 byte packets`,
      ' 1  gateway (192.168.1.1)  1.123 ms  1.056 ms  1.102 ms',
      ' 2  isp-router (10.0.0.1)  5.234 ms  5.123 ms  5.456 ms',
      ' 3  * * *',
      ' 4  dns.google (8.8.8.8)  12.345 ms  12.123 ms  12.567 ms',
    ],
    nslookup: (args) => [
      `Server:		127.0.0.53`,
      `Address:	127.0.0.53#53`,
      '',
      `Non-authoritative answer:`,
      `Name:	${args[0] || 'google.com'}`,
      `Address: 142.250.183.46`,
    ],
    dig: (args) => [
      `;; ANSWER SECTION:`,
      `${args[0] || 'portfolio.com'}.		300	IN	A	104.21.57.89`,
      '',
      `;; Query time: 24 msec`,
      `;; SERVER: 127.0.0.53#53(127.0.0.53)`,
    ],
    ssh: (args) => args[0] ? [`Connecting to ${args[0]}...`, `ssh: connect to host ${args[0]} port 22: Connection refused`] : ['Usage: ssh [user@]host'],

    // File Operations
    more: (args) => commands.cat(args),
    less: (args) => commands.cat(args),
    awk: () => ['awk: missing program'],
    sed: () => ['sed: no input files'],
    tar: (args) => args[0] ? [`tar: creating archive ${args[0]}`] : ['Usage: tar -cf [archive.tar] [files]'],
    gzip: (args) => args[0] ? [`gzip: ${args[0]}: 56.7% -- replaced with ${args[0]}.gz`] : ['Usage: gzip [file]'],
    zip: (args) => args[0] ? [`adding: ${args[0]} (deflated 12%)`] : ['Usage: zip [archive] [files]'],
    unzip: (args) => args[0] ? [`Archive:  ${args[0]}`, `  inflating: extracted_file.txt`] : ['Usage: unzip [file.zip]'],

    // Development
    git: (args) => {
      if (!args[0]) return ['Usage: git [command]']
      if (args[0] === 'status') return ['On branch main', 'nothing to commit, working tree clean']
      if (args[0] === 'log') return ['commit 9d8f7e6... (HEAD -> main)', 'Author: Jaimin Pansal', 'Date:   Today', '', '    Initial commit']
      if (args[0] === 'commit') return ['[main 8a9b2c3] ' + (args.slice(1).join(' ') || 'Update')]
      if (args[0] === 'push') return ['Enumerating objects: 5, done.', 'Writing objects: 100% (3/3), 283 bytes, done.', 'To github.com:jai-git4208/portfolioos.git']
      return [`git: '${args[0]}' is not a git command.`]
    },
    npm: (args) => {
      if (!args[0]) return ['Usage: npm [command]']
      if (args[0] === 'install') return ['added 142 packages, and audited 143 packages in 3s', 'found 0 vulnerabilities']
      if (args[0] === 'start') return ['> portfolio-os@2.0.0 start', '> vite']
      return [`npm ERR! Unknown command: ${args[0]}`]
    },
    node: (args) => args.length > 0 ? [`Welcome to Node.js v18.16.0.`] : ['Welcome to Node.js v18.16.0.', 'Type ".help" for more information.'],
    python: () => ['Python 3.11.3 (main, Apr  5 2023, 14:14:37) [GCC 11.3.0]', 'Type "help", "copyright", "credits" or "license" for more information.', '>>> '],
    docker: (args) => args[0] ? [`Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`] : ['Usage: docker [command]'],

    // Fun (Hidden)
    sl: () => ['   (  ) (@@) ( )  (@)  ()    @@    O     @     O     @', '  (@@@)', ' (    )', ' (@@@@)', '   (   )'],

    tree: () => [
      '~',
      '├── projects/',
      '│   ├── portfolio-os',
      '│   ├── mesh-network',
      '│   └── ai-chatbot',
      '├── skills/',
      '│   ├── frontend.txt',
      '│   ├── backend.txt',
      '│   └── other.txt',
      '├── about.txt',
      '└── contact.txt',
      '',
      '2 directories, 7 files',
      '',
    ],

    uname: (args) => {
      if (args[0] === '-a') return ['PortfolioOS 2.0.0 WebTerminal x86_64 GNU/Linux']
      return ['PortfolioOS']
    },

    hostname: () => ['portfolio-os.local'],

    uptime: () => {
      const seconds = Math.floor(performance.now() / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      return [`up ${hours}h ${minutes % 60}m, 1 user, load average: 0.42, 0.37, 0.28`]
    },

    ping: (args) => {
      if (!args[0]) return ['Usage: ping [host]']
      const host = args[0]

      setHistory(prev => [...prev, { type: 'output', content: `PING ${host} (127.0.0.1) 56(84) bytes of data.` }])

      let count = 0
      const max = 4
      const interval = setInterval(() => {
        count++
        if (count <= max) {
          const time = (Math.random() * 0.05 + 0.02).toFixed(3)
          setHistory(prev => [...prev, { type: 'output', content: `64 bytes from ${host}: icmp_seq=${count} ttl=64 time=${time} ms` }])
        } else {
          clearInterval(interval)
          setHistory(prev => [...prev,
          { type: 'output', content: '' },
          { type: 'output', content: `--- ${host} ping statistics ---` },
          { type: 'output', content: `${max} packets transmitted, ${max} received, 0% packet loss` },
          { type: 'output', content: '' }
          ])
        }
      }, 800)

      return null
    },

    curl: (args) => {
      if (!args[0]) return ['Usage: curl [url]']
      return [
        `Fetching ${args[0]}...`,
        'HTTP/1.1 200 OK',
        'Content-Type: application/json',
        '',
        '{ "status": "success", "message": "This is a simulated response" }',
        '',
      ]
    },

    wget: (args) => {
      if (!args[0]) return ['Usage: wget [url]']
      return [
        `--${new Date().toISOString()}--  ${args[0]}`,
        'Resolving host... done.',
        'Connecting to host... connected.',
        'HTTP request sent, awaiting response... 200 OK',
        'Length: 1024 (1.0K) [text/html]',
        'Saving to: index.html',
        '',
        'index.html          100%[===================>]   1.00K  --.-KB/s    in 0s',
        '',
        `${new Date().toISOString()} (42.0 MB/s) - 'index.html' saved [1024/1024]`,
        '',
      ]
    },

    find: (args) => {
      if (!args[0]) return ['Usage: find [name]']
      return ['find: simulated recursive search not yet fully linked to new FS - try "ls -R" logic manually']
    },

    grep: (args) => {
      if (args.length < 2) return ['Usage: grep [pattern] [file]']
      return [
        `Searching for '${args[0]}' in ${args[1]}...`,
        'grep: simulated search - use cat to view file contents',
        '',
      ]
    },

    ps: () => [
      'PID  TTY          TIME CMD',
      '  1  pts/0    00:00:00 bash',
      '  2  pts/0    00:00:01 portfolio-os',
      '  3  pts/0    00:00:00 terminal',
      '',
    ],

    top: () => [
      'top - ' + new Date().toLocaleTimeString() + ' up ' + Math.floor(performance.now() / 60000) + ' min',
      'Tasks: 3 total, 1 running, 2 sleeping',
      'CPU: 2.3% us, 1.1% sy, 0.0% ni, 96.6% id',
      'Memory: 512M total, 256M used, 256M free',
      '',
      'PID  USER     CPU% MEM%  COMMAND',
      '  1  jaimin   1.2  12.3  portfolio-os',
      '  2  jaimin   0.8   8.1  terminal',
      '  3  jaimin   0.3   4.2  bash',
      '',
      'Press q to quit (simulated)',
      '',
    ],

    kill: (args) => {
      if (!args[0]) return ['Usage: kill [pid]']
      return [`kill: (${args[0]}) - Operation not permitted (this is a demo)`]
    },

    fortune: () => {
      const fortunes = [
        'The best way to predict the future is to invent it. - Alan Kay',
        "Code is like humor. When you have to explain it, it's bad. - Cory House",
        'First, solve the problem. Then, write the code. - John Johnson',
        'Experience is the name everyone gives to their mistakes. - Oscar Wilde',
        'In order to be irreplaceable, one must always be different. - Coco Chanel',
        'The only way to do great work is to love what you do. - Steve Jobs',
        'Innovation distinguishes between a leader and a follower. - Steve Jobs',
        'Simplicity is the soul of efficiency. - Austin Freeman',
        'Make it work, make it right, make it fast. - Kent Beck',
        'Perfect is the enemy of good. - Voltaire',
      ]
      return ['', fortunes[Math.floor(Math.random() * fortunes.length)], '']
    },

    cowsay: (args) => {
      const message = args.join(' ') || 'Moo!'
      const border = '_'.repeat(message.length + 2)
      return [
        '',
        ` ${border}`,
        `< ${message} >`,
        ` ${'-'.repeat(message.length + 2)}`,
        '        \\   ^__^',
        '         \\  (oo)\\_______',
        '            (__)\\       )\\/\\',
        '                ||----w |',
        '                ||     ||',
        '',
      ]
    },

    matrix: () => {
      const chars = '01アイウエオカキクケコサシスセソタチツテト'
      const lines = []
      for (let i = 0; i < 10; i++) {
        let line = ''
        for (let j = 0; j < 60; j++) {
          line += chars[Math.floor(Math.random() * chars.length)]
        }
        lines.push(line)
      }
      return [
        '',
        ...lines,
        '',
        'Wake up, Neo...',
        'The Matrix has you...',
        'Follow the white rabbit.',
        '',
      ]
    },

    'sudo rm -rf /': () => [
      '',
      '[SYSTEM WARNING] CRITICAL OPERATION DETECTED',
      '',
      'Proceeding with file system deletion...',
      '[##############################] 100%',
      '',
      'SYSTEM DESTROYED.',
      'Rebooting...',
      '',
      'Just kidding. Refreshing session...',
      '',
    ].concat(
      setTimeout(() => window.location.reload(), 3000),
      []
    ),

    mkdir: (args) => {
      if (!args[0]) return ['Usage: mkdir [directory]']
      const success = sharedFileSystem.mkdir(args[0], currentPath)
      return success ? [] : [`mkdir: cannot create directory '${args[0]}': File exists or parent not found`]
    },

    touch: (args) => {
      if (!args[0]) return ['Usage: touch [file]']
      const success = sharedFileSystem.touch(args[0], currentPath)
      return success ? [] : [`touch: cannot touch '${args[0]}': Parent not found`]
    },

    rm: (args) => {
      if (!args[0]) return ['Usage: rm [file]']

      // Special handler for sudo rm -rf / simulation if passed directly
      if (args[0] === '-rf' && args[1] === '/') return commands['sudo rm -rf /']()

      const recursive = args.includes('-r') || args.includes('-rf')
      const target = args.filter(a => !a.startsWith('-'))[0]
      if (!target) return ['Usage: rm [-r] [file]']

      const result = sharedFileSystem.rm(target, currentPath, recursive)
      if (result === true) return []
      if (result === 'is_dir') return [`rm: cannot remove '${target}': Is a directory`]
      return [`rm: cannot remove '${target}': No such file or directory`]
    },

    cp: (args) => {
      if (args.length < 2) return ['Usage: cp [source] [destination]']
      return [`Copied ${args[0]} to ${args[1]}`]
    },

    mv: (args) => {
      if (args.length < 2) return ['Usage: mv [source] [destination]']
      return [`Moved ${args[0]} to ${args[1]}`]
    },

    head: (args) => {
      if (!args[0]) return ['Usage: head [file]']
      return [`Displaying first 10 lines of ${args[0]}...`, '(simulated content)']
    },

    tail: (args) => {
      if (!args[0]) return ['Usage: tail [file]']
      return [`Displaying last 10 lines of ${args[0]}...`, '(simulated content)']
    },

    vi: () => ['vim: Standard input is not a terminal'],
    vim: () => ['vim: Standard input is not a terminal'],
    nano: () => ['nano: Error opening terminal: unknown'],
    code: () => ['VS Code is not installed in this environment.'],
  }

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    // Add to history
    setHistory(prev => [...prev, { type: 'input', content: `${currentPath} $ ${trimmedCmd}` }])
    setCommandHistory(prev => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    // Check for exact full command match first (e.g., "sudo rm -rf /")
    if (commands[trimmedCmd]) {
      const output = commands[trimmedCmd]([])
      if (output) {
        setHistory(prev => [...prev, ...output.map(line => {
          if (typeof line === 'object' && line !== null && line.type) {
            return line
          }
          return { type: 'output', content: line }
        })])
      }
      return
    }

    // Parse command parts
    const parts = trimmedCmd.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Execute command if found
    if (commands[command]) {
      const output = commands[command](args)
      if (output) {
        setHistory(prev => [...prev, ...output.map(line => {
          if (typeof line === 'object' && line !== null && line.type) {
            return line
          }
          return { type: 'output', content: line }
        })])
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
      className="h-full w-full bg-[var(--bg-primary)] text-[var(--accent)] font-mono text-sm p-4 md:p-6 overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header (Text Only) */}
      <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-[var(--border-dim)] text-xs text-[var(--text-dim)] uppercase tracking-widest selection:bg-[var(--accent)] selection:text-[var(--bg-tertiary)]">
        <span>{USER_INFO.name}@portfolio-os:{currentPath}</span>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto mb-4 space-y-1 scrollbar-thin scrollbar-thumb-[var(--border-dim)] scrollbar-track-transparent"
      >
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className={`${item.type === 'input' ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-primary)]'} whitespace-pre-wrap break-words`}
          >
            {item.type === 'image' ? (
              <img
                src={item.content}
                alt="Terminal Output"
                className="max-w-[300px] h-auto rounded-lg border border-[var(--border-dim)] my-2 opacity-90 hover:opacity-100 transition-opacity"
              />
            ) : (
              item.content
            )}
          </motion.div>
        ))}
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <span className="text-[var(--accent)] font-semibold flex-shrink-0">
          {currentPath} $
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[var(--accent)] outline-none caret-[var(--accent)]"
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-[var(--accent)]"
        >
          ▋
        </motion.span>
      </form>
    </div>
  )
}

export default TerminalApp
