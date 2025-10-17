import { motion } from 'framer-motion'
import { Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, plan, clearAuth } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-black text-white">SEOScribe</div>
              <div className="text-xs font-bold text-purple-400">AI Writing Tool</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/ai-writer" className="text-white/80 hover:text-white font-semibold transition-colors">
              AI Writer
            </Link>
            <Link to="/tools" className="text-white/80 hover:text-white font-semibold transition-colors">
              Tools
            </Link>
            <a href="#pricing" className="text-white/80 hover:text-white font-semibold transition-colors">
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-white/80 hover:text-white font-semibold">
                  Dashboard
                </Link>
                <div className="text-sm">
                  <span className="text-white/70">{user.email}</span>
                  <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase">
                    {plan}
                  </span>
                </div>
                <button onClick={handleSignOut} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-white">
                  Sign Out
                </button>
              </>
            ) : (
              <motion.button
                onClick={() => navigate('/?auth=signup')}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold shadow-lg text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free
              </motion.button>
            )}
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <Link to="/ai-writer" className="text-white font-semibold">AI Writer</Link>
              <Link to="/tools" className="text-white font-semibold">Tools</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-white font-semibold">Dashboard</Link>
                  <button onClick={handleSignOut} className="text-left text-white font-semibold">Sign Out</button>
                </>
              ) : (
                <Link to="/?auth=signup" className="text-white font-semibold">Start Free</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
