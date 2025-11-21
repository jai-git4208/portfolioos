export const APPS = {
  ABOUT: 'about',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  CONTACT: 'contact',
  TERMINAL: 'terminal',
  BROWSER: 'browser',
  SETTINGS: 'settings',
}

export const APP_CONFIG = {
  [APPS.ABOUT]: {
    title: 'About Me',
    icon: '👤',
    color: 'from-pink-500 to-orange-500',
    initialSize: { width: 700, height: 500 },
    initialPosition: { x: 100, y: 100 },
  },
  [APPS.SKILLS]: {
    title: 'Skills',
    icon: '⚡',
    color: 'from-purple-500 to-blue-500',
    initialSize: { width: 800, height: 600 },
    initialPosition: { x: 150, y: 120 },
  },
  [APPS.PROJECTS]: {
    title: 'Projects',
    icon: '🚀',
    color: 'from-teal-500 to-cyan-500',
    initialSize: { width: 900, height: 650 },
    initialPosition: { x: 200, y: 80 },
  },
  [APPS.CONTACT]: {
    title: 'Contact',
    icon: '📬',
    color: 'from-blue-500 to-purple-500',
    initialSize: { width: 600, height: 500 },
    initialPosition: { x: 250, y: 150 },
  },
  [APPS.TERMINAL]: {
    title: 'Terminal',
    icon: '⌨️',
    color: 'from-gray-800 to-gray-900',
    initialSize: { width: 800, height: 500 },
    initialPosition: { x: 120, y: 100 },
  },
  [APPS.BROWSER]: {
    title: 'Browser',
    icon: '🌐',
    color: 'from-indigo-500 to-blue-500',
    initialSize: { width: 1000, height: 700 },
    initialPosition: { x: 100, y: 50 },
  },
  [APPS.SETTINGS]: {
    title: 'Settings',
    icon: '⚙️',
    color: 'from-gray-700 to-gray-800',
    initialSize: { width: 700, height: 600 },
    initialPosition: { x: 180, y: 100 },
  },
}

export const WALLPAPERS = [
  {
    id: 1,
    name: 'Cosmic Gradient',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
  },
  {
    id: 2,
    name: 'Sunset Dreams',
    type: 'gradient',
    value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 3,
    name: 'Ocean Breeze',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)',
  },
  {
    id: 4,
    name: 'Purple Haze',
    type: 'gradient',
    value: 'linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)',
  },
  {
    id: 5,
    name: 'Neon Nights',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 50%, #40e0d0 100%)',
  },
]

export const GITHUB_USERNAME = 'jai-git4208'
export const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos`

export const USER_INFO = {
  name: 'Jaimin Pansal',
  title: 'Founder & CEO - Ivelosi Technologies',
  location: 'Ahmedabad, Gujarat, India',
  email: 'jaiminpansal@gmail.com',
  phone: '+91 9428912118',
  website: 'jai.ivelosi.com',
  github: 'github.com/jai-git4208',
  bio: "Motivated and analytically driven high school student with a passion for innovation and technology. Founded Ivelosi Technologies with a vision to create cutting-edge solutions in decentralized systems and AI.",
  education: [
    {
      school: 'Airport School, Ahmedabad',
      board: 'Class 11 CBSE Board',
      year: '2026 - Present',
      description: 'Currently pursuing advanced studies in science with a focus on engineering, mathematics, and computer science.',
    },
    {
      school: 'Airport School, Ahmedabad',
      board: 'Class 10 CBSE Board',
      year: 'Graduated: 2025',
      achievement: '96.00%',
      description: 'Demonstrated exceptional academic performance with strong aptitude in mathematics, science, and technology subjects.',
    },
  ],
  certifications: [
    'Node.js Backend Development - Curious Jr. (Aug 2020 - Nov 2020)',
    'HTML, CSS & JavaScript Frontend - Curious Jr. (Jun 2020 - Mar 2025)',
    'Python Backend Development - Curious Jr. (Jun 2020)',
  ],
}
