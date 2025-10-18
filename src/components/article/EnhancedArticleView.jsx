import { motion } from 'framer-motion'
import { Copy, Download, Save, Expand, Sparkles, MessageSquare, CheckCircle, BookOpen, TrendingUp, Star } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function EnhancedArticleView({ article, onSave, onExpand }) {
  const [saving, setSaving] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleCopy = () => {
    const markdown = articleToMarkdown(article)
    navigator.clipboard.writeText(markdown)
    toast.success('Copied to clipboard!')
  }

  const handleDownload = () => {
    const markdown = articleToMarkdown(article)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(article.title || 'article').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`
    a.click()
    toast.success('Downloaded!')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(article)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!article) {
    return null
  }

  // Helper to get image URL from various possible formats
  const getImageUrl = () => {
    // Check various possible image locations
    const imageData = article.image || article.hero_image || article.featured_image
    
    if (!imageData) {
      console.log('[IMAGE] No image data found in article')
      return null
    }

    console.log('[IMAGE] Image data found:', imageData)

    // If it's a string, it's probably a direct URL
    if (typeof imageData === 'string') {
      return imageData
    }

    // If it's an object, check for various properties
    if (typeof imageData === 'object') {
      // Check for direct URL
      if (imageData.url || imageData.image_url) {
        return imageData.url || imageData.image_url
      }

      // Check for base64 encoded image
      if (imageData.b64 || imageData.image_b64 || imageData.base64) {
        const b64Data = imageData.b64 || imageData.image_b64 || imageData.base64
        return `data:image/png;base64,${b64Data}`
      }

      // Check if the object itself has properties that indicate it's image data
      if (imageData.data) {
        return `data:image/png;base64,${imageData.data}`
      }
    }

    return null
  }

  const imageUrl = getImageUrl()

  return (
    <div className="max-w-5xl mx-auto">
      {/* ACTIONS */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0e27] via-[#0a0e27]/95 to-transparent pb-4 mb-8">
        <div className="flex justify-end items-center gap-3">
          <motion.button onClick={handleCopy} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2 border border-white/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button">
            <Copy className="w-4 h-4" />
            Copy
          </motion.button>
          
          <motion.button onClick={handleDownload} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2 border border-white/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button">
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          
          <motion.button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50" whileHover={{ scale: saving ? 1 : 1.05 }} whileTap={{ scale: saving ? 1 : 0.95 }} type="button">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </motion.button>

          {onExpand && (
            <motion.button onClick={() => onExpand()} className="px-5 py-2.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg font-semibold flex items-center gap-2 border border-green-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button">
              <Expand className="w-4 h-4" />
              Expand
            </motion.button>
          )}
        </div>
      </div>

      {/* HERO IMAGE */}
      {imageUrl && !imageError && (
        <motion.div
          className="mb-8 rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-auto object-cover"
            onError={(e) => {
              console.error('[IMAGE] Failed to load image:', imageUrl)
              setImageError(true)
            }}
            onLoad={() => {
              console.log('[IMAGE] Image loaded successfully')
            }}
          />
        </motion.div>
      )}

      {/* DEBUG: Show if image should be there but isn't loading */}
      {imageUrl && imageError && (
        <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-sm text-red-400">
            ⚠️ Image failed to load. This might be a temporary issue.
          </p>
        </div>
      )}

      {/* TITLE */}
      <motion.h1 className="text-5xl font-black mb-6 leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {article.title}
      </motion.h1>

      {/* META */}
      <motion.div className="flex items-center gap-6 mb-8 text-white/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>{article.word_count || 0} words</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>{article.reading_time_minutes || 1} min read</span>
        </div>
        {article.seo_score && article.seo_score.overall && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>SEO: {article.seo_score.overall}/100</span>
          </div>
        )}
      </motion.div>

      {/* ALTERNATIVE TITLES */}
      {article.alternative_titles && article.alternative_titles.length > 0 && (
        <motion.div className="mb-8 p-6 glass-strong rounded-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Alternative Headlines
          </h3>
          <div className="space-y-2">
            {article.alternative_titles.map((title, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors" onClick={() => { navigator.clipboard.writeText(title); toast.success('Copied!'); }}>
                {title}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* SECTIONS */}
      {article.sections && article.sections.map((section, i) => (
        <motion.div key={i} className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
          <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
          <div className="space-y-4 text-lg leading-relaxed text-white/80">
            {section.paragraphs && section.paragraphs.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
          </div>
        </motion.div>
      ))}

      {/* FAQS */}
      {article.faqs && article.faqs.length > 0 && (
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-green-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {article.faqs.map((faq, i) => (
              <div key={i} className="p-6 glass-strong rounded-xl">
                <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                <p className="text-white/80 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CITATIONS */}
      {article.citations && article.citations.length > 0 && (
        <motion.div className="mb-12 p-6 glass-strong rounded-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Sources
          </h3>
          <div className="space-y-3">
            {article.citations.map((citation, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-lg">
                <div className="font-semibold text-purple-400 mb-1">[{i + 1}] {citation.title}</div>
                <div className="text-sm text-white/60 truncate">{citation.url}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* SOCIAL MEDIA */}
      {article.social_media_posts && Object.keys(article.social_media_posts).length > 0 && (
        <motion.div className="mb-12 p-6 glass-strong rounded-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-xl font-bold mb-4">Social Media Posts</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(article.social_media_posts).map(([platform, content]) => {
              if (!content) return null
              return (
                <div key={platform} className="p-4 bg-white/5 rounded-lg">
                  <div className="font-semibold capitalize mb-2 text-purple-400">{platform}</div>
                  <div className="text-sm text-white/70 mb-3 line-clamp-3">{content}</div>
                  <button onClick={() => { navigator.clipboard.writeText(content); toast.success('Copied!'); }} className="text-xs px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded" type="button">
                    Copy
                  </button>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function articleToMarkdown(article) {
  let md = `# ${article.title}\n\n`
  if (article.sections) {
    article.sections.forEach(section => {
      md += `## ${section.heading}\n\n`
      if (section.paragraphs) {
        section.paragraphs.forEach(para => {
          md += `${para}\n\n`
        })
      }
    })
  }
  if (article.faqs && article.faqs.length > 0) {
    md += `## FAQs\n\n`
    article.faqs.forEach(faq => {
      md += `### ${faq.q}\n\n${faq.a}\n\n`
    })
  }
  return md
}
