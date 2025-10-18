import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { ArrowLeft } from 'lucide-react'
import EnhancedArticleView from '../components/article/EnhancedArticleView'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function Article() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentArticle, loadArticle, saveArticle, setCurrentArticle } = useArticles()
  const { plan, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [expanding, setExpanding] = useState(false)

  const getExpansionCount = () => {
    if (!currentArticle) return 0
    if (currentArticle.expansion_count !== undefined) {
      return currentArticle.expansion_count
    }
    const articleId = currentArticle.id || 'new'
    const stored = localStorage.getItem(`expansion_count_${articleId}`)
    return stored ? parseInt(stored) : 0
  }

  const [expansionCount, setExpansionCount] = useState(getExpansionCount())
  const maxExpansions = plan === 'pro' || plan === 'enterprise' ? 6 : 2

  useEffect(() => {
    console.log('[ARTICLE] Mounted - ID:', id)
    console.log('[ARTICLE] Has current article:', !!currentArticle)
    console.log('[ARTICLE] User:', user?.email || 'Demo User')
    
    if (id === 'new') {
      if (!currentArticle) {
        console.log('[ARTICLE] No article to display')
        toast.error('No article to display. Please generate an article first.')
        navigate('/')
      } else {
        console.log('[ARTICLE] Displaying new article:', currentArticle.title)
      }
    } else if (id) {
      if (!user) {
        toast.error('Please sign in to view saved articles')
        navigate('/')
        return
      }
      
      setLoading(true)
      loadArticle(id)
        .then(() => setLoading(false))
        .catch((error) => {
          console.error('[ARTICLE] Load failed:', error)
          toast.error('Failed to load article')
          setLoading(false)
          navigate('/dashboard')
        })
    }
  }, [id])

  useEffect(() => {
    if (currentArticle) {
      const count = getExpansionCount()
      setExpansionCount(count)
    }
  }, [currentArticle])

  const handleSave = async (article) => {
    if (!user) {
      toast.error('Sign up to save your articles!')
      return
    }
    await saveArticle(article)
  }

  const handleExpand = async () => {
    if (!currentArticle) return
    
    if (expansionCount >= maxExpansions) {
      toast.error(`Maximum expansions reached (${expansionCount}/${maxExpansions})`)
      return
    }
    
    setExpanding(true)
    try {
      const originalImage = currentArticle.image || currentArticle.hero_image
      const originalSections = [...(currentArticle.sections || [])]
      const originalWordCount = currentArticle.word_count || 0
      
      const expanded = await api.expandArticle({
        context: JSON.stringify(currentArticle),
        article_json: currentArticle,
        keyword: currentArticle.title,
        current_word_count: originalWordCount,
        expand_only: true
      })
      
      let mergedSections = [...originalSections]
      let newSectionsAdded = 0
      
      if (expanded.sections && expanded.sections.length > 0) {
        const newSections = expanded.sections.filter(newSection => 
          !originalSections.some(oldSection => 
            oldSection.heading.toLowerCase().trim() === newSection.heading.toLowerCase().trim()
          )
        )
        
        if (newSections.length > 0) {
          mergedSections = [...originalSections, ...newSections]
          newSectionsAdded = newSections.length
        }
      }
      
      const newWordCount = mergedSections.reduce((total, section) => {
        const sectionWords = section.paragraphs?.reduce((count, para) => 
          count + para.split(' ').filter(w => w.length > 0).length, 0
        ) || 0
        return total + sectionWords
      }, 0)
      
      const mergedArticle = {
        ...currentArticle,
        sections: mergedSections,
        word_count: newWordCount,
        reading_time_minutes: Math.ceil(newWordCount / 200),
        expansion_count: expansionCount + 1,
        image: originalImage,
        hero_image: originalImage
      }
      
      const articleId = currentArticle.id || 'new'
      localStorage.setItem(`expansion_count_${articleId}`, String(expansionCount + 1))
      
      setExpansionCount(expansionCount + 1)
      setCurrentArticle(mergedArticle)
      
      if (newSectionsAdded > 0) {
        toast.success(`✨ Added ${newSectionsAdded} sections! Now ${mergedArticle.word_count} words`)
      } else {
        toast.error('No new content added')
      }
    } catch (error) {
      console.error('[EXPAND] Error:', error)
      toast.error(error.message || 'Expansion failed')
    } finally {
      setExpanding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white/60 mb-4">No article to display</p>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
          >
            {user ? 'Go to Dashboard' : 'Go Home'}
          </button>
        </div>
      </div>
    )
  }

  const canExpand = expansionCount < maxExpansions

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5" />
          {user ? 'Back to Dashboard' : 'Back to Home'}
        </motion.button>

        {!user && (
          <motion.div
            className="mb-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="font-semibold">
                💡 Love what you see? Sign up free to save this article and get 1 article per day!
              </span>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
              >
                Sign Up Free
              </button>
            </div>
          </motion.div>
        )}

        {!canExpand && (
          <motion.div
            className="mb-8 p-6 bg-yellow-500/20 border border-yellow-500/30 rounded-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-semibold">
              ⚠️ Maximum expansions reached ({expansionCount}/{maxExpansions})
              {plan === 'free' && ' - Upgrade to Pro for 6 expansions!'}
            </span>
          </motion.div>
        )}

        {expanding && (
          <motion.div
            className="mb-8 p-6 bg-purple-500/20 border border-purple-500/30 rounded-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span className="font-semibold">
                Expanding article... ({expansionCount + 1}/{maxExpansions})
              </span>
            </div>
          </motion.div>
        )}

        <EnhancedArticleView 
          article={currentArticle} 
          onSave={handleSave}
          onExpand={canExpand && !expanding ? handleExpand : null}
          expansionInfo={{
            count: expansionCount,
            max: maxExpansions,
            canExpand
          }}
        />
      </div>
    </div>
  )
}
