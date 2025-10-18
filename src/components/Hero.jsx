import { motion } from 'framer-motion'
import { Sparkles, Zap, TrendingUp, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { toast } from 'react-hot-toast'
import AuthModal from './auth/AuthModal'

export default function Hero() {
  const [demoTopic, setDemoTopic] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { generateArticle, generating } = useArticles()
  const navigate = useNavigate()

  const demoUsed = localStorage.getItem('demo_used') === 'true'
  const demoDate = localStorage.getItem('demo_date')
  
  const canUseDemo = () => {
    if (!demoUsed) return true
    
    if (demoDate) {
      const demoDateTime = new Date(demoDate).getTime()
      const now = new Date().getTime()
      const thirtyDays = 30 * 24 * 60 * 60 * 1000
      return (now - demoDateTime) >= thirtyDays
    }
    
    return false
  }

  const handleDemoGenerate = async (e) => {
    e.preventDefault()
    
    if (!demoTopic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    if (!canUseDemo()) {
      setShowAuthModal(true)
      return
    }

    try {
      console.log('[HERO] Generating demo article:', demoTopic)
      
      await generateArticle(demoTopic, '')
      
      // Mark demo as used
      const today = new Date().toISOString()
      localStorage.setItem('demo_used', 'true')
      localStorage.setItem('demo_date', today)
      
      console.log('[HERO] Demo article generated, navigating...')
      
      // Navigate to article view
      setTimeout(() => {
        navigate('/article/new')
      }, 500)
      
    } catch (error) {
      console.error('[HERO] Demo generation failed:', error)
      toast.error(error.message || 'Generation failed')
    }
  }

  return (
    <>
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">AI-Powered SEO Content</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                SEO Content
              </span>
              <br />
              Made Simple
            </h1>

            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto">
              Generate high-ranking, SEO-optimized articles in seconds with our advanced AI. 
              No writing experience needed.
            </p>

            {/* DEMO ARTICLE GENERATOR */}
            <div className="max-w-2xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-strong rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4">Try it Free - No Sign Up Required!</h3>
                <form onSubmit={handleDemoGenerate} className="space-y-4">
                  <input
                    type="text"
                    value={demoTopic}
                    onChange={(e) => setDemoTopic(e.target.value)}
                    placeholder="Enter article topic (e.g., Best AI Writing Tools 2025)"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-lg"
                    disabled={generating || !canUseDemo()}
                  />
                  <motion.button
                    type="submit"
                    disabled={generating || !demoTopic.trim() || !canUseDemo()}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: generating || !canUseDemo() ? 1 : 1.02 }}
                    whileTap={{ scale: generating || !canUseDemo() ? 1 : 0.98 }}
                  >
                    {generating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating Your Article...</span>
                      </>
                    ) : !canUseDemo() ? (
                      <>
                        <span>Demo Used - Sign Up for Daily Articles</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Free Demo Article</span>
                      </>
                    )}
                  </motion.button>
                </form>
                {!canUseDemo() && (
                  <p className="text-sm text-white/60 mt-3">
                    Demo resets in 30 days. Sign up now for 1 free article per day!
                  </p>
                )}
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Zap, text: 'Generate in 60 seconds' },
                { icon: TrendingUp, text: 'SEO-optimized content' },
                { icon: CheckCircle, text: 'Ready to publish' }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 glass-card p-4 rounded-xl"
                >
                  <feature.icon className="w-6 h-6 text-purple-400" />
                  <span className="font-semibold">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
