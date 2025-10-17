import { motion } from 'framer-motion'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { ArrowLeft, Save, Download, Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Article() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentArticle, saveArticle } = useArticles()
  const [saving, setSaving] = useState(false)

  const article = currentArticle

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
    a.download = `${article.title || 'article'}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('⬇️ Downloaded!')
  }

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
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
          {article.image && article.image.image_url && (
            <img
              src={article.image.image_url}
              alt={article.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}

          <h1 className="text-4xl font-black mb-4">{article.title}</h1>

          {article.meta?.description && (
            <p className="text-lg text-white/80 mb-6">{article.meta.description}</p>
          )}

          <div className="flex gap-4 mb-6 text-sm text-white/60">
            <span>📊 {article.word_count} words</span>
            <span>⏱️ {article.reading_time_minutes} min read</span>
            <span>🔗 {article.citations?.length || 0} sources</span>
          </div>

          {article.sections?.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">{section.heading}</h2>
              {section.paragraphs?.map((para, pIdx) => (
                <p key={pIdx} className="text-white/80 mb-4 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          ))}

          {article.faqs?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold mb-6">FAQs</h2>
              {article.faqs.map((faq, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                  <p className="text-white/80">{faq.a}</p>
                </div>
              ))}
            </div>
          )}

          {article.citations?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold mb-6">Sources</h2>
              {article.citations.map((citation, idx) => (
                <div key={idx} className="mb-3 flex gap-2">
                  <span className="text-purple-400 font-bold">[{idx + 1}]</span>
                  
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {citation.title}
                  </a>
                </div>
              ))}
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

  article.sections?.forEach((section) => {
    md += `## ${section.heading}\n\n`
    section.paragraphs?.forEach((para) => {
      md += `${para}\n\n`
    })
  })

  if (article.faqs?.length > 0) {
    md += `\n## FAQs\n\n`
    article.faqs.forEach((faq) => {
      md += `**${faq.q}**\n\n${faq.a}\n\n`
    })
  }

  return md
}
