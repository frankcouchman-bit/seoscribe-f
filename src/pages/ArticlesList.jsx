import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useArticles } from '../hooks/useArticles'
import { useNavigate } from 'react-router-dom'
import { FileText, Trash2, Clock, TrendingUp, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ArticlesList() {
  const { articles, fetchArticles, deleteArticle, loading } = useArticles()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(
        articles.filter(article => 
          article.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
  }, [articles, searchQuery])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (confirm('Delete this article?')) {
      await deleteArticle(id)
      toast.success('Article deleted')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black mb-4">Your Articles</h1>
          <p className="text-xl text-white/70">
            {articles.length} saved article{articles.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* SEARCH */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </motion.div>

        {/* ARTICLES GRID */}
        {filteredArticles.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FileText className="w-20 h-20 mx-auto mb-4 text-white/20" />
            <p className="text-xl text-white/60">
              {searchQuery ? 'No articles found' : 'No saved articles yet'}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                className="glass-strong rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/article/${article.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <button
                    onClick={(e) => handleDelete(article.id, e)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                <h3 className="text-xl font-bold mb-3 line-clamp-2">
                  {article.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.reading_time_minutes || 1}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{article.word_count || 0} words</span>
                  </div>
                  {article.seo_score && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{article.seo_score}/100</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-white/40">
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
