import { motion } from 'framer-motion'
import { useArticles } from '../../hooks/useArticles'
import { useEffect } from 'react'
import { FileText, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function RecentArticles() {
  const { articles, fetchArticles, loading } = useArticles()
  const navigate = useNavigate()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const recentArticles = articles.slice(0, 5)

  return (
    <motion.div
      className="glass-strong rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Recent Articles</h2>
        <button
          onClick={() => navigate('/library')}
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : recentArticles.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/60 text-sm">No articles yet</p>
          <p className="text-white/40 text-xs mt-1">Generate your first article to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentArticles.map((article, i) => (
            <motion.button
              key={article.id}
              onClick={() => navigate(`/article/${article.id}`)}
              className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 hover:border-purple-500/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-semibold text-sm mb-2 line-clamp-2">
                {article.title || 'Untitled Article'}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Clock className="w-3 h-3" />
                <span>
                  {article.created_at 
                    ? new Date(article.created_at).toLocaleDateString()
                    : 'Recently created'
                  }
                </span>
                {article.word_count && (
                  <>
                    <span>•</span>
                    <span>{article.word_count} words</span>
                  </>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
