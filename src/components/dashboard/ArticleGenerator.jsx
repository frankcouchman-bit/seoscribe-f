import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Sparkles, AlertCircle, Lock, UserPlus } from 'lucide-react'
import { useArticles } from '../../hooks/useArticles'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AuthModal from '../auth/AuthModal'
import { api } from '../../lib/api'

const TEMPLATES = [
  { id: 'default', name: 'Standard Article', icon: '📝', description: 'Comprehensive long-form content' },
  { id: 'listicle', name: 'Listicle', icon: '📋', description: 'Top 10, Best 20 list format' },
  { id: 'how-to-guide', name: 'How-To Guide', icon: '📚', description: 'Step-by-step instructions' },
  { id: 'product-review', name: 'Product Review', icon: '⭐', description: 'Detailed analysis with pros/cons' },
  { id: 'comparison-post', name: 'Comparison', icon: '⚖️', description: 'X vs Y side-by-side' },
  { id: 'ultimate-guide', name: 'Ultimate Guide', icon: '📖', description: 'In-depth 3000+ word guide' },
]

export default function ArticleGenerator() {
  const [topic, setTopic] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [showTemplates, setShowTemplates] = useState(false)
  const [headlines, setHeadlines] = useState([])
  const [selectedHeadline, setSelectedHeadline] = useState('')
  const [showHeadlines, setShowHeadlines] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const { generateArticle, generating } = useArticles()
  const { canGenerate, plan, incrementGeneration, user, usage } = useAuth()
  const navigate = useNavigate()

  const isDemoUser = !user
  const demoUsed = isDemoUser && localStorage.getItem('demo_used') === 'true'
  const canCreate = canGenerate()
  const currentGenerations = usage?.today?.generations || 0
  const maxGenerations = plan === 'pro' || plan === 'enterprise' ? 15 : 1

  // Auto-refresh usage display every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const { getLocalUsage } = useAuth.getState()
      useAuth.setState({ usage: getLocalUsage() })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
    
    // Check demo user
    if (isDemoUser) {
      if (demoUsed) {
        setShowAuthModal(true)
        return
      }
    }
    
    // Check quota
    if (!canCreate) {
      if (isDemoUser) {
        setShowAuthModal(true)
      } else {
        toast.error('Daily limit reached! ' + (plan === 'free' ? 'Upgrade to Pro for 15 articles/day!' : 'Limit resets tomorrow.'))
      }
      return
    }
    
    try {
      const finalTopic = selectedHeadline || topic
      
      if (selectedTemplate !== 'default') {
        console.log('[GENERATOR] Using template:', selectedTemplate)
        
        const response = await api.generateFromTemplate({
          template_id: selectedTemplate,
          topic: finalTopic,
          website_url: websiteUrl
        })
        
        // Initialize expansion count
        response.expansion_count = 0
        
        useArticles.setState({ currentArticle: response })
        
        // Mark demo as used for non-logged users
        if (isDemoUser) {
          const today = new Date().toISOString().split('T')[0]
          localStorage.setItem('demo_used', 'true')
          localStorage.setItem('demo_date', today)
        } else {
          // Increment generation count
          incrementGeneration()
        }
        
        navigate('/article/new')
      } else {
        console.log('[GENERATOR] Using standard generation')
        
        await generateArticle(finalTopic, websiteUrl)
        
        // Mark demo as used for non-logged users
        if (isDemoUser) {
          const today = new Date().toISOString().split('T')[0]
          localStorage.setItem('demo_used', 'true')
          localStorage.setItem('demo_date', today)
        }
        // Note: incrementGeneration() is already called in generateArticle
        
        navigate('/article/new')
      }
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  return (
    <>
      <motion.div
        className="glass-strong rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
          
          <div className="text-right">
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

        <AnimatePresence>
          {demoUsed && (
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
                    <li>✅ 1 use per SEO tool/day (10/day for Pro)</li>
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

        {!isDemoUser && !canCreate && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-bold text-red-400 mb-1">Daily Limit Reached</div>
              <div className="text-white/70">
                {plan === 'free'
                  ? "You've used your 1 free article today. Upgrade to Pro for 15 articles/day!"
                  : "You've reached your daily limit of 15 articles. Limit resets tomorrow."}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold">Content Template</label>
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                {showTemplates ? 'Hide' : 'Show'} templates
              </button>
            </div>
            
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-3 mb-4"
                >
                  {TEMPLATES.map((template) => (
                    <motion.button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        selectedTemplate === template.id
                          ? 'bg-purple-500/30 border-2 border-purple-500'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">{template.icon}</div>
                      <div className="font-semibold text-sm mb-1">{template.name}</div>
                      <div className="text-xs text-white/60">{template.description}</div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {selectedTemplate !== 'default' && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm">
                <strong>Selected:</strong> {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
              </div>
            )}
          </div>

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
              disabled={generating || demoUsed || (!isDemoUser && !canCreate)}
            />
          </div>

          {topic.trim() && !showHeadlines && !generating && !demoUsed && canCreate && (
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
              disabled={generating || demoUsed || (!isDemoUser && !canCreate)}
            />
            <p className="text-xs text-white/50 mt-2">
              Add your website URL for internal links
            </p>
          </div>

          <motion.button
            type="submit"
            disabled={generating || !topic.trim() || demoUsed || (!isDemoUser && !canCreate)}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: (generating || demoUsed || (!isDemoUser && !canCreate)) ? 1 : 1.02 }}
            whileTap={{ scale: (generating || demoUsed || (!isDemoUser && !canCreate)) ? 1 : 0.98 }}
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
            ) : (!isDemoUser && !canCreate) ? (
              <>
                <Lock className="w-5 h-5" />
                <span>Daily Limit Reached</span>
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
