import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'
import { Tag } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function MetaGenerator() {
  const [content, setContent] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const data = await api.generateMeta(content)
      setResult(data)
      toast.success('Meta description generated!')
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
      <h3 className="text-xl font-bold mb-4">Meta Description</h3>
      <p className="text-white/70 mb-4 text-sm">
        Generate compelling meta descriptions from your content.
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste content here..."
        className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 h-32 resize-none"
      />

      <Button onClick={handleGenerate} loading={loading}>
        <Tag className="w-4 h-4" />
        Generate Meta
      </Button>

      {result && (
        <motion.div
          className="bg-white/5 rounded-lg p-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-sm text-white/80">{result.description}</div>
          <div className="text-xs text-white/50 mt-2">{result.description.length} characters</div>
        </motion.div>
      )}
    </motion.div>
  )
}
