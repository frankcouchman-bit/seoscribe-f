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

  // Get expansion count from article or localStorage
  const getExpansionCount = () => {
    if (!currentArticle) return 0
    
    // Check article metadata first
    if (currentArticle.expansion_count !== undefined) {
      return currentArticle.expansion_count
    }
    
    // Check localStorage as fallback
    const articleId = currentArticle.id || 'new'
    const stored = localStorage.getItem(`expansion_count_${articleId}`)
    return stored ? parseInt(stored) : 0
  }

  const [expansionCount, setExpansionCount] = useState(getExpansionCount())

  const maxExpansions = plan === 'pro' || plan === 'enterprise' ? 6 : 2

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      loadArticle(id).finally(() => setLoading(false))
    }
  }, [id, loadArticle])

  useEffect(() => {
    if (currentArticle) {
      const count = getExpansionCount()
      setExpansionCount(count)
      console.log('[ARTICLE] Expansion count loaded:', count)
    }
  }, [currentArticle])

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
      console.log('[EXPAND] Starting expansion', expansionCount + 1, 'of', maxExpansions)
      console.log('[EXPAND] Current sections:', currentArticle.sections?.length || 0)
      console.log('[EXPAND] Current word count:', currentArticle.word_count || 0)
      
      // Store ALL original data
      const originalImage = currentArticle.image || currentArticle.hero_image || currentArticle.featured_image
      const originalSections = JSON.parse(JSON.stringify(currentArticle.sections || []))
      const originalWordCount = currentArticle.word_count || 0
      const originalFaqs = currentArticle.faqs || []
      const originalCitations = currentArticle.citations || []
      const originalSocialPosts = currentArticle.social_media_posts || {}
      const originalAlternativeTitles = currentArticle.alternative_titles || []
      const originalInternalLinks = currentArticle.internal_links || []
      
      console.log('[EXPAND] Stored original data - sections:', originalSections.length)
      
      // Call backend to expand
      const expanded = await api.expandArticle({
        context: JSON.stringify(currentArticle),
        article_json: currentArticle,
        keyword: currentArticle.title,
        current_word_count: originalWordCount,
        current_section_count: originalSections.length,
        expansion_number: expansionCount + 1,
        expand_only: true
      })
      
      console.log('[EXPAND] Expansion received from backend')
      console.log('[EXPAND] Backend returned sections:', expanded.sections?.length || 0)
      
      // CRITICAL: ALWAYS MERGE, NEVER REPLACE
      let mergedSections = [...originalSections]
      let newSectionsAdded = 0
      
      if (expanded.sections && expanded.sections.length > 0) {
        // Find truly new sections
        const newSections = expanded.sections.filter(newSection => {
          // Check if this section heading already exists
          const exists = originalSections.some(oldSection => 
            oldSection.heading.toLowerCase().trim() === newSection.heading.toLowerCase().trim()
          )
          return !exists
        })
        
        console.log('[EXPAND] Found', newSections.length, 'new unique sections')
        
        if (newSections.length > 0) {
          mergedSections = [...originalSections, ...newSections]
          newSectionsAdded = newSections.length
          console.log('[EXPAND] Merged sections - total now:', mergedSections.length)
        } else {
          console.log('[EXPAND] No new sections to add, keeping original')
        }
      }
      
      // Calculate new word count from ALL sections
      const newWordCount = mergedSections.reduce((total, section) => {
        const sectionWords = section.paragraphs?.reduce((count, para) => 
          count + para.split(' ').filter(w => w.length > 0).length, 0
        ) || 0
        return total + sectionWords
      }, 0)
      
      console.log('[EXPAND] Word count: ', originalWordCount, '->', newWordCount, '(+' + (newWordCount - originalWordCount) + ')')
      
      // Build complete merged article
      const mergedArticle = {
        ...currentArticle,
        sections: mergedSections,
        word_count: newWordCount,
        reading_time_minutes: Math.ceil(newWordCount / 200),
        expansion_count: expansionCount + 1,
        // Preserve ALL original metadata
        image: originalImage,
        hero_image: originalImage,
        featured_image: originalImage,
        faqs: originalFaqs,
        citations: originalCitations,
        social_media_posts: originalSocialPosts,
        alternative_titles: originalAlternativeTitles,
        internal_links: originalInternalLinks,
        title: currentArticle.title,
        meta: currentArticle.meta,
        seo_score: currentArticle.seo_score
      }
      
      console.log('[EXPAND] Final merged article:')
      console.log('  - Sections:', mergedArticle.sections.length)
      console.log('  - Word count:', mergedArticle.word_count)
      console.log('  - Has image:', !!mergedArticle.image)
      console.log('  - Expansion count:', mergedArticle.expansion_count)
      
      // Store expansion count in localStorage
      const articleId = currentArticle.id || 'new'
      localStorage.setItem(`expansion_count_${articleId}`, String(expansionCount + 1))
      
      // Update state
      setExpansionCount(expansionCount + 1)
      setCurrentArticle(mergedArticle)
      
      if (newSectionsAdded > 0) {
        toast.success(`✨ Added ${newSectionsAdded} new sections! Article now ${mergedArticle.word_count} words (${expansionCount + 1}/${maxExpansions})`)
      } else {
        toast.error('No new content was added. Try again or contact support.')
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
              {plan === 'free' && ' - Upgrade to Pro for 6 expansions per article!'}
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
                Expanding article... Adding 3-4 new sections with 300-500 words each (Expansion {expansionCount + 1}/{maxExpansions})
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
