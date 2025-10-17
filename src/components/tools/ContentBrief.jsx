import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'
import { FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ContentBrief() {
  const [keyword, setKeyword] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!keyword.trim()) return

    setLoading(true)
    try {
      const data = await api.generateBrief(keyword)
      setResult(data)
      toast.success('Brief generated!')
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
      <h3 className="text-xl font-bold mb-4">Content Brief</h3>
      <p className="text-white/70 mb-4 text-sm">
        Generate a detailed brief for a target keyword.
      </p>

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Keyword"
        className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
      />

      <Button onClick={handleGenerate} loading={loading}>
        <FileText className="w-4 h-4" />
        Generate Brief
      </Button>

      {result && (
        <motion.div
          className="bg-white/5 rounded-lg p-4 mt-4 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between">
            <span>Search Intent:</span>
            <span className="font-bold capitalize">{result.search_intent}</span>
          </div>
          <div className="flex justify-between">
            <span>Target Word Count:</span>
            <span className="font-bold">{result.target_word_count}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
