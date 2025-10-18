import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { ArrowLeft, Save, Download, Copy, Image as ImageIcon, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Article() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentArticle, loadArticle, saveArticle } = useArticles()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copiedSocial, setCopiedSocial] = useState({})

  useEffect(() => {
    if (id && id !== 'new') {
      loadArticle(id).finally(() => setLoading(false))
    } else if (currentArticle) {
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }, [id, currentArticle, navigate, loadArticle])

  const article = currentArticle

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No article loaded</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple-400 hover:text-purple-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveArticle(article)
    } catch (error) {
      console.error('Save failed:', error)
    }
    setSaving(false)
  }

  const handleCopy = () => {
    const markdown = generateMarkdown(article)
    navigator.clipboard.writeText(markdown)
    toast.success('📋 Copied to clipboard!')
  }

  const handleDownload = () => {
    const markdown = generateMarkdown(article)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${article.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'article'}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('⬇️ Downloaded!')
  }

  const handleCopySocial = (platform, text) => {
    navigator.clipboard.writeText(text)
    setCopiedSocial({ ...copiedSocial, [platform]: true })
    toast.success(`Copied ${platform} post!`)
    setTimeout(() => {
      setCopiedSocial({ ...copiedSocial, [platform]: false })
    }, 2000)
  }

  const heroImage = article.image?.image_url || article.image?.url || null

  // Find conclusion section
  const conclusionIndex = article.sections?.findIndex(s => 
    s.heading.toLowerCase().includes('conclusion') || 
    s.heading.toLowerCase().includes('final thoughts') ||
    s.heading.toLowerCase().includes('wrapping up')
  ) ?? -1

  // Split sections: before conclusion, conclusion, after conclusion
  const sectionsBeforeConclusion = conclusionIndex >= 0 
    ? article.sections.slice(0, conclusionIndex + 1) 
    : article.sections || []
  
  const sectionsAfterConclusion = conclusionIndex >= 0 
    ? article.sections.slice(conclusionIndex + 1) 
    : []

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex gap-2">
            <motion.button
              onClick={handleCopy}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Copy className="w-4 h-4" />
              Copy
            </motion.button>
            <motion.button
              onClick={handleDownload}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
              whileHover={{ scale: saving ? 1 : 1.05 }}
              whileTap={{ scale: saving ? 1 : 0.95 }}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </motion.button>
          </div>
        </div>

        <motion.div
          className="glass-strong rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-6 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-white/30 mx-auto mb-2" />
                <p className="text-white/50 text-sm">No image generated</p>
              </div>
            </div>
          )}

          <h1 className="text-4xl font-black mb-4">{article.title}</h1>

          {article.meta?.description && (
            <p className="text-lg text-white/80 mb-6 italic border-l-4 border-purple-500 pl-4">
              {article.meta.description}
            </p>
          )}

          <div className="flex gap-4 mb-8 text-sm text-white/60 border-b border-white/10 pb-4">
            <span>📊 {article.word_count || 0} words</span>
            <span>⏱️ {article.reading_time_minutes || 0} min read</span>
            <span>🔗 {article.citations?.length || 0} sources</span>
          </div>

          {/* Article Content - Sections before and including conclusion */}
          {sectionsBeforeConclusion.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">{section.heading}</h2>
              {section.paragraphs?.map((para, pIdx) => (
                <p key={pIdx} className="text-white/80 mb-4 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          ))}

          {/* FAQs AFTER Conclusion */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {article.faqs.map((faq, faqIdx) => (
                  <div key={faqIdx}>
                    <h3 className="font-bold text-white mb-2 text-lg">{faq.q}</h3>
                    <p className="text-white/70 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Any sections after conclusion (if any) */}
          {sectionsAfterConclusion.map((section, idx) => (
            <div key={`after-${idx}`} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">{section.heading}</h2>
              {section.paragraphs?.map((para, pIdx) => (
                <p key={pIdx} className="text-white/80 mb-4 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          ))}

          {/* Social Media Drafts with Copy Buttons */}
          {article.social_media_posts && Object.keys(article.social_media_posts).length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold mb-6">📱 Social Media Drafts</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(article.social_media_posts).map(([platform, text]) => (
                  text && (
                    <div key={platform} className="glass rounded-lg p-4 relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold capitalize">{platform}</div>
                        <motion.button
                          onClick={() => handleCopySocial(platform, text)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-semibold flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {copiedSocial[platform] ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </motion.button>
                      </div>
                      <p className="text-sm text-white/70 whitespace-pre-wrap">{text}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {article.citations?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold mb-6">📚 Sources</h2>
              <div className="space-y-2">
                {article.citations.map((citation, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-purple-400 font-bold">[{idx + 1}] </span>
                    <a 
                      href={citation.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {citation.title || 'Source'}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function generateMarkdown(article) {
  let md = `# ${article.title}\n\n`
  
  if (article.meta?.description) {
    md += `> ${article.meta.description}\n\n`
  }

  if (article.image?.image_url) {
    md += `![${article.title}](${article.image.image_url})\n\n`
  }

  // Find conclusion
  const conclusionIndex = article.sections?.findIndex(s => 
    s.heading.toLowerCase().includes('conclusion')
  ) ?? -1

  // Sections before and including conclusion
  const mainSections = conclusionIndex >= 0 
    ? article.sections.slice(0, conclusionIndex + 1)
    : article.sections || []

  mainSections.forEach((section) => {
    md += `## ${section.heading}\n\n`
    section.paragraphs?.forEach((para) => {
      md += `${para}\n\n`
    })
  })

  // FAQs after conclusion
  if (article.faqs?.length > 0) {
    md += `\n## Frequently Asked Questions\n\n`
    article.faqs.forEach((faq) => {
      md += `### ${faq.q}\n\n${faq.a}\n\n`
    })
  }

  // Any remaining sections
  if (conclusionIndex >= 0 && conclusionIndex < article.sections.length - 1) {
    article.sections.slice(conclusionIndex + 1).forEach((section) => {
      md += `## ${section.heading}\n\n`
      section.paragraphs?.forEach((para) => {
        md += `${para}\n\n`
      })
    })
  }

  if (article.citations?.length > 0) {
    md += `\n## Sources\n\n`
    article.citations.forEach((citation, idx) => {
      md += `${idx + 1}. [${citation.title}](${citation.url})\n`
    })
  }

  return md
}
