import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import AuthModal from '../auth/AuthModal'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xl text-white">SEOScribe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/tools" className="text-white/80 hover:text-white transition-colors font-medium">
                Tools
              </Link>
              <Link to="/ai-writer" className="text-white/80 hover:text-white transition-colors font-medium">
                AI Writer
              </Link>
              <Link to="/blog" className="text-white/80 hover:text-white transition-colors font-medium">
                Blog
              </Link>
              <a
                href="/#pricing"
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Pricing
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors font-semibold"
                    type="button"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    type="button"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors font-semibold"
                    type="button"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold shadow-lg"
                    type="button"
                  >
                    Start Free
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
              aria-label="Toggle menu"
              type="button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 glass-strong"
            >
              <div className="px-4 py-4 space-y-3">
                <Link
                  to="/tools"
                  className="block py-2 text-white/80 hover:text-white transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tools
                </Link>
                <Link
                  to="/ai-writer"
                  className="block py-2 text-white/80 hover:text-white transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AI Writer
                </Link>
                <Link
                  to="/blog"
                  className="block py-2 text-white/80 hover:text-white transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <a
                  href="/#pricing"
                  className="block py-2 text-white/80 hover:text-white transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>

                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('/dashboard')
                        setMobileMenuOpen(false)
                      }}
                      className="w-full text-left py-2 text-white/80 hover:text-white transition-colors font-medium"
                      type="button"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                      type="button"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowAuthModal(true)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full text-left py-2 text-white/80 hover:text-white transition-colors font-medium"
                      type="button"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthModal(true)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full py-2 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold shadow-lg"
                      type="button"
                    >
                      Start Free
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
