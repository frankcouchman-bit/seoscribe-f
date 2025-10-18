import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sparkles, AlertCircle, Lock, Download, Copy, Save } from 'lucide-react'
import { useArticles } from '../../hooks/useArticles'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function ArticleGenerator() {
  const [topic, setTopic] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [generatedHeadlines, setGeneratedHeadlines] = useState([])
  const [selectedHeadline, setSelectedHeadline] = useState(null)
  const [showHeadlines, setShowHeadlines] = useState(false)
  const { generateArticle, generating, saveArticle } = useArticles()
  const { canGenerate, plan, refreshUsage, user, usage } = useAuth()
  const navigate = useNavigate()

  const canCreate = canGenerate()
  const isDemoUser = !user

  const handleGenerateHeadlines = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic first')
      return
    }

    const headlines = [
      `${topic}: The Complete Guide for 2025`,
      `Everything You Need to Know About ${topic}`,
      `${topic}: Ultimate Beginner's Guide`,
      `The Best Way to ${topic} in 2025`,
      `${topic}: Expert Tips and Strategies`
    ]
    
    setGeneratedHeadlines(headlines)
    setShowHeadlines(true)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    
    if (!canCreate) {
      if (isDemoUser) {
        toast.error('Demo limit reached! Sign up for 1 free article/day.')
      } else {
        toast.error('Daily limit reached! Upgrade to Pro for 15 articles/day.')
      }
      return
    }
    
    try {
      const finalTopic = selectedHeadline || topic
      await generateArticle(finalTopic, websiteUrl)
      await refreshUsage()
      navigate('/article/new')
    } catch (error) {
      console.error('Generation failed:', error)
      await refreshUsage()
    }
  }

  const currentGenerations = usage?.today?.generations || 0
  const maxGenerations = plan === 'pro' ? 15 : 1

  return (
    <motion.div
      className="glass-strong rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            {canCreate ? <Sparkles className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Generate Article</h2>
            <p className="text-white/60">
              {isDemoUser 
                ? 'Try it free - no account needed'
                : 'Create SEO-optimized content in seconds'
              }
            </p>
          </div>
        </div>
        
        {/* Usage Counter */}
        <div className="text-right">
          <div className="text-3xl font-black gradient-text">
            {currentGenerations}/{maxGenerations}
          </div>
          <div className="text-sm text-white/60">Articles Today</div>
        </div>
      </div>

      {!canCreate && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-red-400 mb-1">
              {isDemoUser ? 'Demo Limit Reached' : 'Daily Limit Reached'}
            </div>
            <div className="text-white/70">
              {isDemoUser 
                ? "You've used your free demo article for this month. Sign up for 1 free article per day!"
                : plan === 'free'
                ? "You've used your 1 free article today. Upgrade to Pro for 15 articles/day!"
                : "You've reached your daily limit of 15 articles. Limit resets tomorrow."}
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
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Best Project Management Tools 2025"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all disabled:opacity-50"
            disabled={generating || !canCreate}
          />
        </div>

        {/* A/B Headline Generator */}
        {topic.trim() && !showHeadlines && (
          <motion.button
            type="button"
            onClick={handleGenerateHeadlines}
            className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-sm transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✨ Generate A/B Tested Headlines
          </motion.button>
        )}

        {showHeadlines && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold mb-2">Choose Your Headline</label>
            {generatedHeadlines.map((headline, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setSelectedHeadline(headline)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedHeadline === headline
                    ? 'bg-purple-500/30 border-2 border-purple-500'
                    : 'bg-white/10 border border-white/20 hover:bg-white/15'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {headline}
              </motion.button>
            ))}
          </motion.div>
        )}

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
            disabled={generating || !canCreate}
          />
          <p className="text-xs text-white/50 mt-2">
            Add your website URL to automatically include relevant internal links
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={generating || !topic.trim() || !canCreate}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: (generating || !canCreate) ? 1 : 1.02 }}
          whileTap={{ scale: (generating || !canCreate) ? 1 : 0.98 }}
        >
          {generating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Article...</span>
            </>
          ) : !canCreate ? (
            <>
              <Lock className="w-5 h-5" />
              <span>Limit Reached</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Article</span>
            </>
          )}
        </motion.button>

        {!canCreate && isDemoUser && (
          <p className="text-center text-sm text-white/60">
            Want more? Sign up for <strong>1 free article per day</strong>!
          </p>
        )}
      </form>
    </motion.div>
  )
}
