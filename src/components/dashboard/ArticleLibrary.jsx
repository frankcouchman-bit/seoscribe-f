import { motion } from 'framer-motion'
import { FileText, Clock, Trash2, Eye } from 'lucide-react'
import { useArticles } from '../../hooks/useArticles'
import { useNavigate } from 'react-router-dom'

export default function ArticleLibrary() {
  const { articles, deleteArticle } = useArticles()
  const navigate = useNavigate()

  if (articles.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No articles yet</h3>
        <p className="text-white/60">Generate your first article to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article, i) => (
        <motion.div
          key={article.id}
          className="glass rounded-2xl p-6 hover:bg-white/[0.15] transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-2">{article.title}</h4>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {article.word_count} words
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(article.updated_at || article.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              onClick={() => navigate(`/article/${article.id}`)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
              View
            </motion.button>
            <motion.button
              onClick={() => deleteArticle(article.id)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
