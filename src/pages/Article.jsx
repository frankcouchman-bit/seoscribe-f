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
  const { plan } = useAuth()
  const [loading, setLoading] = useState(false)
  const [expanding, setExpanding] = useState(false)
  const [expansionCount, setExpansionCount] = useState(0)

  const maxExpansions = plan === 'pro' || plan === 'enterprise' ? 6 : 2

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      loadArticle(id).finally(() => setLoading(false))
    }
    
    if (currentArticle && currentArticle.expansion_count !== undefined) {
      setExpansionCount(currentArticle.expansion_count)
    }
  }, [id, loadArticle, currentArticle])

  const handleSave = async (article) => {
    await saveArticle(article)
  }

  const handleExpand = async () => {
    if (!currentArticle) return
    
    if (expansionCount >= maxExpansions) {
      if (plan === 'free') {
        toast.error(`Free users can expand up to ${maxExpansions} times. Upgrade to Pro for 6 expansions!`)
      } else {
        toast.error(`Maximum expansions (${maxExpansions}) reached.`)
      }
      return
    }
    
    setExpanding(true)
    try {
      console.log('[EXPAND] Starting expansion...')
      console.log('[EXPAND] Current sections:', currentArticle.sections?.length || 0)
      
      // Store original data
      const originalImage = currentArticle.image || currentArticle.hero_image || currentArticle.featured_image
      const originalSections = [...(currentArticle.sections || [])]
      const originalWordCount = currentArticle.word_count || 0
      
      // Call backend to expand
      const expanded = await api.expandArticle({
        context: currentArticle,
        article_json: currentArticle,
        keyword: currentArticle.title,
        current_word_count: originalWordCount,
        expand_only: true
      })
      
      console.log('[EXPAND] Expansion received')
      console.log('[EXPAND] New sections:', expanded.sections?.length || 0)
      
      // CRITICAL: MERGE sections instead of replacing
      let mergedSections = []
      let newSections = []
      
      if (expanded.sections && expanded.sections.length > 0) {
        // Keep ALL original sections
        mergedSections = [...originalSections]
        
        // Add new sections from expansion
        newSections = expanded.sections.filter(newSection => 
          !originalSections.some(oldSection => 
            oldSection.heading === newSection.heading
          )
        )
        
        console.log('[EXPAND] Adding', newSections.length, 'new sections')
        mergedSections = [...mergedSections, ...newSections]
      } else {
        // If backend didn't return sections, keep originals
        mergedSections = originalSections
      }
      
      // Calculate new word count
      const newWordCount = mergedSections.reduce((total, section) => {
        const sectionWords = section.paragraphs?.reduce((count, para) => 
          count + para.split(' ').length, 0
        ) || 0
        return total + sectionWords
      }, 0)
      
      console.log('[EXPAND] Word count: ', originalWordCount, '->', newWordCount)
      
      // Build merged article
      const mergedArticle = {
        ...currentArticle,
        ...expanded,
        sections: mergedSections,
        word_count: newWordCount,
        reading_time_minutes: Math.ceil(newWordCount / 200),
        expansion_count: expansionCount + 1
      }
      
      // RESTORE original image
      if (originalImage) {
        mergedArticle.image = originalImage
        mergedArticle.hero_image = originalImage
        mergedArticle.featured_image = originalImage
      }
      
      console.log('[EXPAND] Final article sections:', mergedArticle.sections.length)
      console.log('[EXPAND] Final word count:', mergedArticle.word_count)
      
      setExpansionCount(expansionCount + 1)
      setCurrentArticle(mergedArticle)
      
      toast.success(`✨ Added ${newSections.length} new sections! Article now ${mergedArticle.word_count} words.`)
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

  const canExpand = expansionCount < maxExpansions

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

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
                Expanding article... Adding 3-4 new sections with 300-500 words each
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
