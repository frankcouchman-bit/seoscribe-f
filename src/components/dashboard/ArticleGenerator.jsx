import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useArticles } from '../../hooks/useArticles'
import { useNavigate } from 'react-router-dom'

export default function ArticleGenerator() {
  const [topic, setTopic] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const { generateArticle, generating } = useArticles()
  const navigate = useNavigate()

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    
    try {
      await generateArticle(topic, websiteUrl)
      navigate('/article/new')
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  return (
    <motion.div
      className="glass-strong rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Generate Article</h2>
          <p className="text-white/60">Create SEO-optimized content in seconds</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Article Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Best Project Management Tools 2025"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
            disabled={generating}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Website URL <span className="text-white/50">(optional)</span>
          </label>
          <input
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
            disabled={generating}
          />
          <p className="text-xs text-white/50 mt-2">
            Add your website URL to automatically include relevant internal links
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={generating || !topic.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: generating ? 1 : 1.02 }}
          whileTap={{ scale: generating ? 1 : 0.98 }}
        >
          {generating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Article</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
