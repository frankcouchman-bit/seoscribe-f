import { useAuth } from '../../hooks/useAuth'
import { Lock, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import AuthModal from '../auth/AuthModal'
import { useNavigate } from 'react-router-dom'

export default function ToolWrapper({ children, onUse }) {
  const { canUseTool, user, plan, incrementToolUsage, usage } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const navigate = useNavigate()
  
  const canUse = canUseTool()
  const isDemoUser = !user
  const toolsUsed = usage?.today?.tools || 0
  const maxTools = (!user || plan === 'free') ? 1 : 10

  const handleToolUse = () => {
    if (!canUse) {
      if (isDemoUser) {
        setShowAuthModal(true)
      }
      return
    }
    
    incrementToolUsage()
    if (onUse) onUse()
  }

  if (!canUse) {
    return (
      <>
        <div className="glass-strong rounded-2xl p-8">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Daily Tool Limit Reached</h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              {isDemoUser 
                ? "You've used your 1 free SEO tool for today. Sign up to get 1 tool use per day (or 10/day with Pro)!"
                : plan === 'free'
                ? "You've used your 1 SEO tool for today. Upgrade to Pro for 10 tool uses per day!"
                : "You've used all 10 SEO tools today. Your limit resets in 24 hours."}
            </p>
            <p className="text-sm text-white/50 mb-6">
              Tools used today: {toolsUsed}/{maxTools}
            </p>
            {isDemoUser ? (
              <motion.button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold shadow-lg inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-5 h-5" />
                Sign Up Free
              </motion.button>
            ) : plan === 'free' ? (
              <motion.button
                onClick={() => navigate('/pricing')}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upgrade to Pro
              </motion.button>
            ) : (
              <p className="text-white/60">Check back tomorrow!</p>
            )}
          </div>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </>
    )
  }

  return (
    <div onClick={handleToolUse}>
      {children}
    </div>
  )
}
