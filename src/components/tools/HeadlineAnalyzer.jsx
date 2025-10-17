import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'
import { Zap } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function HeadlineAnalyzer() {
  const [headline, setHeadline] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!headline.trim()) return

    setLoading(true)
    try {
      const data = await api.analyzeHeadline(headline)
      setResult(data)
      toast.success('Headline analyzed!')
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
      <h3 className="text-xl font-bold mb-4">Headline Analyzer</h3>
      <p className="text-white/70 mb-4 text-sm">
        Evaluate the strength and click-through potential of your headline.
      </p>

      <input
        type="text"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        placeholder="Enter headline..."
        className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
      />

      <Button onClick={handleAnalyze} loading={loading} className="mb-4">
        <Zap className="w-4 h-4" />
        Analyze
      </Button>

      {result && (
        <motion.div
          className="bg-white/5 rounded-lg p-4 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">Score:</span>
            <span className="text-2xl font-black gradient-text">{result.score}/100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Grade:</span>
            <span className="text-xl font-bold text-green-400">{result.grade}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
