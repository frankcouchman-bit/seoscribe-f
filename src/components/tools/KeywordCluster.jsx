import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'
import { Grid } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function KeywordCluster() {
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCluster = async () => {
    if (!topic.trim()) return

    setLoading(true)
    try {
      const data = await api.clusterKeywords(topic, '')
      setResult(data)
      toast.success('Keywords clustered!')
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
      <h3 className="text-xl font-bold mb-4">Keyword Cluster</h3>
      <p className="text-white/70 mb-4 text-sm">
        Cluster related keywords to capture search intent.
      </p>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Topic (e.g., productivity tools)"
        className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
      />

      <Button onClick={handleCluster} loading={loading}>
        <Grid className="w-4 h-4" />
        Cluster
      </Button>

      {result && (
        <motion.div
          className="bg-white/5 rounded-lg p-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {['primary', 'secondary', 'long_tail'].map((type) => (
            result[type] && result[type].length > 0 && (
              <div key={type} className="mb-3">
                <div className="text-xs text-purple-400 font-bold uppercase mb-1">
                  {type.replace('_', ' ')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {result[type].slice(0, 5).map((keyword, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
