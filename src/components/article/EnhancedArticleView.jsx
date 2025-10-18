import { motion } from 'framer-motion'
import { 
  Copy, 
  Download, 
  Save, 
  Link as LinkIcon,
  MessageSquare,
  Star,
  ExternalLink,
  CheckCircle,
  BookOpen,
  TrendingUp,
  Expand,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function EnhancedArticleView({ article, onSave, onExpand }) {
  const [saving, setSaving] = useState(false)

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

  return (
    <div className="max-w-5xl mx-auto">
      {/* STICKY HEADER WITH ACTIONS */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0e27] via-[#0a0e27]/95 to-transparent pb-4 mb-8">
        <div className="flex justify-end items-center gap-3">
          <motion.button
            onClick={handleCopy}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="w-4 h-4" />
            Copy
          </motion.button>
          
          <motion.button
            onClick={handleDownload}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 shadow-xl border border-purple-400/50"
            whileHover={{ scale: saving ? 1 : 1.05 }}
            whileTap={{ scale: saving ? 1 : 0.95 }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Article'}
          </motion.button>

          {onExpand && (
            <motion.button
              onClick={() => onExpand()}
              className="px-5 py-2.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg font-semibold flex items-center gap-2 border border-green-500/30 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Expand className="w-4 h-4" />
              Expand
            </motion.button>
          )}
        </div>
      </div>

      {/* HERO IMAGE */}
      {article.image && (article.image.image_url || article.image.image_b64) && (
        <motion.div
          className="mb-8 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={article.image.image_url || `data:image/png;base64,${article.image.image_b64}`}
            alt={article.title}
            className="w-full h-auto"
          />
        </motion.div>
      )}

      {/* TITLE */}
      <motion.h1
        className="text-5xl font-black mb-6 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {article.title}
      </motion.h1>

      {/* META INFO */}
      <motion.div
        className="flex items-center gap-6 mb-8 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
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
        <motion.div
          className="mb-8 p-6 glass-strong rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Alternative Headlines
          </h3>
          <div className="space-y-2">
            {article.alternative_titles.map((title, i) => (
              <div
                key={i}
                className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(title)
                  toast.success('Headline copied!')
                }}
              >
                {title}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ARTICLE SECTIONS */}
      {article.sections && article.sections.map((section, i) => (
        <motion.div
          key={i}
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
          <div className="space-y-4 text-lg leading-relaxed text-white/80">
            {section.paragraphs && section.paragraphs.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
          </div>
        </motion.div>
      ))}

      {/* INTERNAL LINKS */}
      {article.internal_links && article.internal_links.length > 0 && (
        <motion.div
          className="mb-12 p-6 glass-strong rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-400" />
            Suggested Internal Links
          </h3>
          <div className="space-y-3">
            {article.internal_links.map((link, i) => (
              
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div>
                  <div className="font-semibold">{link.title}</div>
                  {link.suggested_anchor && (
                    <div className="text-sm text-white/60">Anchor: {link.suggested_anchor}</div>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* FAQS */}
      {article.faqs && article.faqs.length > 0 && (
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
        <motion.div
          className="mb-12 p-6 glass-strong rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Sources & Citations
          </h3>
          <div className="space-y-3">
            {article.citations.map((citation, i) => (
              
                key={i}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-purple-400 font-bold">[{i + 1}]</span>
                <div className="flex-1">
                  <div className="font-semibold group-hover:text-purple-400 transition-colors">
                    {citation.title}
                  </div>
                  <div className="text-sm text-white/60 truncate">{citation.url}</div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* SOCIAL MEDIA POSTS */}
      {article.social_media_posts && (
        <motion.div
          className="mb-12 p-6 glass-strong rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-4">Social Media Posts</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(article.social_media_posts).map(([platform, content]) => (
              content && (
                <div key={platform} className="p-4 bg-white/5 rounded-lg">
                  <div className="font-semibold capitalize mb-2 text-purple-400">{platform}</div>
                  <div className="text-sm text-white/70 mb-3 line-clamp-3">{content}</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(content)
                      toast.success(`${platform} post copied!`)
                    }}
                    className="text-xs px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
              )
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function articleToMarkdown(article) {
  let md = `# ${article.title}\n\n`
  
  if (article.meta?.description) {
    md += `${article.meta.description}\n\n`
  }
  
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
