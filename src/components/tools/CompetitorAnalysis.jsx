import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'
import { Target } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CompetitorAnalysis() {
  const [keyword, setKeyword] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!keyword.trim()) return

    setLoading(true)
    try {
      const data = await api.analyzeCompetitors(keyword)
      setResult(data)
      toast.success('Analysis complete!')
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
      <h3 className="text-xl font-bold mb-4">Competitor Analysis</h3>
      <p className="text-white/70 mb-4 text-sm">
        Analyze top ranking pages and discover gaps.
      </p>

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter keyword (e.g., project management)"
        className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
      />

      <Button onClick={handleAnalyze} loading={loading}>
        <Target className="w-4 h-4" />
        Analyze
      </Button>

      {result && (
        <motion.div
          className="bg-white/5 rounded-lg p-4 mt-4 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between">
            <span>Difficulty:</span>
            <span className="font-bold capitalize">{result.difficulty}</span>
          </div>
          {result.top_content_insights && (
            <>
              <div className="flex justify-between">
                <span>Avg Word Count:</span>
                <span className="font-bold">{result.top_content_insights.avg_word_count}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Citations:</span>
                <span className="font-bold">{result.top_content_insights.avg_citations}</span>
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
