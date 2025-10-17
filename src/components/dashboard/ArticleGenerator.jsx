import { useState } from 'react'
import { useArticles } from '../../hooks/useArticles'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { FileText, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ArticleGenerator() {
  const [topic, setTopic] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const { generateArticle, generating } = useArticles()
  const { plan, usage } = useAuth()

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    
    try {
      await generateArticle(topic, websiteUrl)
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  const limit = plan === 'pro' ? 15 : 1
  const used = usage.today.generations
  const canGenerate = used < limit

  return (
    <motion.div
      className="glass-strong rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Generate Article</h2>
          <p className="text-white/60 text-sm">
            {used}/{limit} used today • {plan === 'pro' ? 'Pro' : 'Free'} plan
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic (e.g., Best Project Management Tools 2025)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            disabled={generating || !canGenerate}
          />
        </div>

        <div>
          <input
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="Your website URL (optional, for internal links)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            disabled={generating || !canGenerate}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={generating}
          disabled={!canGenerate || !topic.trim()}
          className="w-full flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          {generating ? 'Generating...' : 'Generate Article'}
        </Button>

        {!canGenerate && (
          <p className="text-red-400 text-sm text-center">
            Daily limit reached. {plan === 'free' ? 'Upgrade to Pro for 15/day.' : 'Resets at midnight.'}
          </p>
        )}
      </form>
    </motion.div>
  )
}
