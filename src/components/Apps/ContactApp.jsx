import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Globe } from 'lucide-react'
import { USER_INFO } from '../../utils/constants'

const ContactApp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const socialLinks = [
    { icon: <Github className="w-6 h-6" />, label: 'GitHub', url: `https://${USER_INFO.github}`, color: 'from-gray-700 to-gray-900' },
    { icon: <Linkedin className="w-6 h-6" />, label: 'LinkedIn', url: '#', color: 'from-blue-600 to-blue-800' },
    { icon: <Twitter className="w-6 h-6" />, label: 'Twitter', url: '#', color: 'from-sky-500 to-blue-600' },
    { icon: <Globe className="w-6 h-6" />, label: 'Website', url: `https://${USER_INFO.website}`, color: 'from-purple-600 to-pink-600' },
  ]

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
      {/* Left Side - Contact Info */}
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Get In Touch</h1>
          <p className="text-white/60">Let's discuss your next project or collaboration</p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {[
            { icon: <Mail className="w-6 h-6" />, label: 'Email', value: USER_INFO.email, color: 'from-pink-500 to-orange-500' },
            { icon: <Phone className="w-6 h-6" />, label: 'Phone', value: USER_INFO.phone, color: 'from-purple-500 to-blue-500' },
            { icon: <MapPin className="w-6 h-6" />, label: 'Location', value: USER_INFO.location, color: 'from-teal-500 to-cyan-500' },
          ].map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, x: 10 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${contact.color} glass-strong flex items-center space-x-4`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                {contact.icon}
              </div>
              <div>
                <div className="text-white/80 text-sm">{contact.label}</div>
                <div className="text-white font-semibold">{contact.value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-bold text-white">Connect With Me</h2>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${social.color} glass-strong flex flex-col items-center justify-center space-y-2 text-white`}
              >
                {social.icon}
                <span className="text-sm font-medium">{social.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-3 rounded-3xl glass p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent smooth-transition"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent smooth-transition"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent smooth-transition"
              placeholder="Project Collaboration"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent smooth-transition resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || submitted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 smooth-transition ${
              submitted
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-neon-pink to-neon-orange hover:from-neon-pink/80 hover:to-neon-orange/80'
            } ${isSubmitting || submitted ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Sending...</span>
              </>
            ) : submitted ? (
              <>
                <span>✓</span>
                <span>Message Sent!</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default ContactApp

