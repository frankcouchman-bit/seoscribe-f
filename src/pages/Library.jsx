import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useArticles } from '../hooks/useArticles'
import { useNavigate } from 'react-router-dom'
import { FileText, Search, Trash2, ExternalLink, Calendar } from 'lucide-react'

export default function Library() {
  const { articles, fetchArticles, deleteArticle, loading } = useArticles()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState([])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredArticles(
        articles.filter(article => 
          article.title?.toLowerCase().includes(query) ||
          article.meta?.description?.toLowerCase().includes(query)
        )
      )
    } else {
      setFilteredArticles(articles)
    }
  }, [searchQuery, articles])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(id)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-2">Article Library</h1>
          <p className="text-white/60 text-lg">Manage and view all your generated articles</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </motion.div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-strong rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FileText className="w-20 h-20 text-white/20 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">
              {searchQuery ? 'No articles found' : 'No articles yet'}
            </h2>
            <p className="text-white/60 mb-8">
              {searchQuery 
                ? 'Try a different search term'
                : 'Generate your first article to get started'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
              >
                Generate Article
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/article/${article.id}`)}
                className="glass-strong rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/article/${article.id}`)
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="View article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(article.id, e)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {article.title || 'Untitled Article'}
                </h3>

                <p className="text-sm text-white/60 line-clamp-2 mb-4">
                  {article.meta?.description || 'No description available'}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {article.created_at 
                        ? new Date(article.created_at).toLocaleDateString()
                        : 'Recently created'
                      }
                    </span>
                  </div>
                  {article.word_count && (
                    <span>{article.word_count} words</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
