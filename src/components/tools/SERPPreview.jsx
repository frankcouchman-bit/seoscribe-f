import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'
import { Search } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SERPPreview() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePreview = async () => {
    if (!title.trim()) return

    setLoading(true)
    try {
      const data = await api.generateSERPPreview({ title, description, url })
      setResult(data)
      toast.success('Preview generated!')
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <motion.div
      className="glass rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold mb-4">SERP Preview</h3>
      <p className="text-white/70 mb-4 text-sm">
        See how your content appears in search results.
      </p>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Page title"
        className="w-full px-4 py-3 mb-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Meta description"
        className="w-full px-4 py-3 mb-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
      />

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL (e.g., seoscribe.pro/article)"
        className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
      />

      <Button onClick={handlePreview} loading={loading}>
        <Search className="w-4 h-4" />
        Preview
      </Button>

      {result && result.google && (
        <motion.div
          className="bg-white/5 rounded-lg p-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-xs text-green-400 mb-1">{result.google.url}</div>
          <div className="text-lg font-bold text-blue-400 mb-1">{result.google.title}</div>
          <div className="text-sm text-white/70">{result.google.description}</div>
        </motion.div>
      )}
    </motion.div>
  )
}
