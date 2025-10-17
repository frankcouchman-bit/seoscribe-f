import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Mail, Loader2 } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function AuthModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleMagicLink = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      await api.requestMagicLink(email)
      setEmailSent(true)
      toast.success('Check your email for the magic link!')
    } catch (error) {
      toast.error(error.message || 'Failed to send magic link')
    }
    setLoading(false)
  }

  const handleGoogleAuth = () => {
    api.handleGoogleAuth()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          className="glass-strong rounded-2xl p-8 max-w-md w-full relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-black mb-2">Welcome to SEOScribe</h2>
          <p className="text-white/70 mb-6">Sign in to start creating amazing content</p>

          {!emailSent ? (
            <>
              <motion.button
                onClick={handleGoogleAuth}
                className="w-full py-3 bg-white text-gray-900 rounded-lg font-bold mb-4 flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900 text-white/60">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    disabled={loading}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Send Magic Link</span>
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Check your email!</h3>
              <p className="text-white/70 mb-6">
                We sent a magic link to <strong>{email}</strong>
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="text-purple-400 hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
