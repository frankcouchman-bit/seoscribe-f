import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Sparkles, AlertCircle, Lock, UserPlus } from 'lucide-react'
import { useArticles } from '../../hooks/useArticles'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AuthModal from '../auth/AuthModal'

export default function ArticleGenerator() {
  const [topic, setTopic] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [headlines, setHeadlines] = useState([])
  const [selectedHeadline, setSelectedHeadline] = useState('')
  const [showHeadlines, setShowHeadlines] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  
  const { generateArticle, generating } = useArticles()
  const { canGenerate, plan, refreshUsage, user, usage } = useAuth()
  const navigate = useNavigate()

  const canCreate = canGenerate()
  const isDemoUser = !user
  
  // Check localStorage for demo
  const demoUsedStorage = localStorage.getItem('demo_used') === 'true'
  const demoUsed = isDemoUser && (usage?.demo?.used || demoUsedStorage)
  
  const currentGenerations = usage?.today?.generations || 0
  const maxGenerations = plan === 'pro' ? 15 : 1

  useEffect(() => {
    refreshUsage()
  }, [])

  // Force re-render after state changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1)
  }, [usage, demoUsed])

  const generateHeadlines = () => {
    if (!topic.trim()) {
      toast.error('Enter a topic first')
      return
    }

    const baseTopics = [
      `${topic}: The Complete Guide for 2025`,
      `Everything You Need to Know About ${topic}`,
      `${topic}: Ultimate Beginner's Guide`,
      `How to Master ${topic} in 2025`,
      `${topic}: Expert Tips and Strategies`
    ]
    
    setHeadlines(baseTopics)
    setShowHeadlines(true)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    
    // Check demo lockout
    if (isDemoUser && demoUsed) {
      setShowAuthModal(true)
      return
    }
    
    if (!canCreate) {
      if (isDemoUser) {
        setShowAuthModal(true)
      } else {
        toast.error('Daily limit reached!')
      }
      return
    }
    
    try {
      const finalTopic = selectedHeadline || topic
      await generateArticle(finalTopic, websiteUrl)
      
      // Force refresh and re-render
      await refreshUsage()
      setForceUpdate(prev => prev + 1)
      
      navigate('/article/new')
    } catch (error) {
      console.error('Generation failed:', error)
      await refreshUsage()
      
      if (isDemoUser && (error.message.includes('Demo limit') || error.message.includes('Quota'))) {
        setShowAuthModal(true)
      }
    }
  }

  return (
    <>
      <motion.div
        className="glass-strong rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={forceUpdate}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              {canCreate && !demoUsed ? <Sparkles className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Generate Article</h2>
              <p className="text-white/60">
                {isDemoUser 
                  ? demoUsed ? 'Demo used - Sign up for daily articles' : '1 free demo article'
                  : 'Create SEO-optimized content'
                }
              </p>
            </div>
          </div>
          
          {/* USAGE COUNTER - FORCE DISPLAY */}
          <div className="text-right" key={`counter-${currentGenerations}-${demoUsed}`}>
            <div className="text-3xl font-black gradient-text">
              {isDemoUser 
                ? (demoUsed ? '1/1' : '0/1')
                : `${currentGenerations}/${maxGenerations}`
              }
            </div>
            <div className="text-sm text-white/60">
              {isDemoUser ? 'Demo' : 'Today'}
            </div>
          </div>
        </div>

        {/* DEMO USED CTA */}
        <AnimatePresence>
          {isDemoUser && demoUsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl mb-2">🎉 You've Used Your Free Demo!</div>
                  <p className="text-white/70 mb-4">
                    Love what you see? <strong>Sign up now</strong> and get:
                  </p>
                  <ul className="text-white/70 mb-4 space-y-1 text-sm">
                    <li>✅ <strong>1 free article every day</strong></li>
                    <li>✅ Save & edit your articles</li>
                    <li>✅ Access to all SEO tools (1 use per tool/day)</li>
                    <li>✅ Export in multiple formats</li>
                  </ul>
                  <motion.button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up Free - Get 1 Article Daily →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DAILY LIMIT REACHED */}
        {!isDemoUser && !canCreate && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-bold text-red-400 mb-1">Daily Limit Reached</div>
              <div className="text-white/70">
                {plan === 'free'
                  ? "You've used your 1 free article today. Upgrade to Pro for 15 articles/day + 10 tool uses per tool/day!"
                  : "You've reached your daily limit. Limits reset tomorrow."}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Article Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value)
                setShowHeadlines(false)
                setSelectedHeadline('')
              }}
              placeholder="e.g., Best Project Management Tools 2025"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all disabled:opacity-50"
              disabled={generating || demoUsed}
            />
          </div>

          {topic.trim() && !showHeadlines && !generating && canCreate && !demoUsed && (
            <motion.button
              type="button"
              onClick={generateHeadlines}
              className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-sm transition-colors"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              ✨ Generate A/B Tested Headlines
            </motion.button>
          )}

          <AnimatePresence>
            {showHeadlines && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold mb-2">Choose Your Headline</label>
                {headlines.map((headline, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => setSelectedHeadline(headline)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedHeadline === headline
                        ? 'bg-purple-500/30 border-2 border-purple-500'
                        : 'bg-white/10 border border-white/20 hover:bg-white/15'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {headline}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Website URL <span className="text-white/50">(optional)</span>
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all disabled:opacity-50"
              disabled={generating || demoUsed}
            />
            <p className="text-xs text-white/50 mt-2">
              Add your website URL for internal links
            </p>
          </div>

          <motion.button
            type="submit"
            disabled={generating || !topic.trim() || demoUsed}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: (generating || demoUsed) ? 1 : 1.02 }}
            whileTap={{ scale: (generating || demoUsed) ? 1 : 0.98 }}
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Article...</span>
              </>
            ) : demoUsed ? (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Sign Up for Daily Articles</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{isDemoUser ? 'Try Free Demo' : 'Generate Article'}</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
