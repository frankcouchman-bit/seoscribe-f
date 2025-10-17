import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Helmet } from 'react-helmet-async'

export default function Success() {
  const navigate = useNavigate()
  const { fetchProfile } = useAuth()

  useEffect(() => {
    // Refresh profile to get updated plan
    fetchProfile()
  }, [fetchProfile])

  return (
    <>
      <Helmet>
        <title>Welcome to Pro! | SEOScribe</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="glass-strong rounded-2xl p-12 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>

          <h1 className="text-3xl font-black mb-4">Welcome to Pro! 🎉</h1>
          <p className="text-white/70 mb-8">
            Your subscription is now active. You can now generate 15 articles per day 
            and use all Pro features!
          </p>

          <div className="glass rounded-xl p-4 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-bold">Pro Features Unlocked:</span>
            </div>
            <ul className="text-sm text-white/70 space-y-1">
              <li>✅ 15 articles per day</li>
              <li>✅ Unlimited exports</li>
              <li>✅ 10 SEO tool uses per tool/day</li>
              <li>✅ Priority support</li>
            </ul>
          </div>

          <motion.button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Dashboard
          </motion.button>
        </motion.div>
      </div>
    </>
  )
}
