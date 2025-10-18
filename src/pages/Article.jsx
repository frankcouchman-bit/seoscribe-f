import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { ArrowLeft } from 'lucide-react'
import EnhancedArticleView from '../components/article/EnhancedArticleView'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Article() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentArticle, loadArticle, saveArticle, setCurrentArticle } = useArticles()
  const [loading, setLoading] = useState(false)
  const [expanding, setExpanding] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      loadArticle(id).finally(() => setLoading(false))
    }
  }, [id, loadArticle])

  const handleSave = async (article) => {
    await saveArticle(article)
  }

  const handleExpand = async () => {
    if (!currentArticle) return
    
    setExpanding(true)
    try {
      const expanded = await api.expandArticle({
        context: currentArticle,
        article_json: currentArticle,
        keyword: currentArticle.title
      })
      
      setCurrentArticle(expanded)
      toast.success('✨ Article expanded!')
    } catch (error) {
      toast.error(error.message || 'Expansion failed')
    } finally {
      setExpanding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white/60 mb-4">No article found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BACK BUTTON */}
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

        {expanding && (
          <motion.div
            className="mb-8 p-6 bg-purple-500/20 border border-purple-500/30 rounded-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span className="font-semibold">Expanding article with AI...</span>
            </div>
          </motion.div>
        )}

        <EnhancedArticleView 
          article={currentArticle} 
          onSave={handleSave}
          onExpand={!expanding ? handleExpand : null}
        />
      </div>
    </div>
  )
}
