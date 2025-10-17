import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'
import { Shield } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function PlagiarismChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const data = await api.checkPlagiarism(text)
      setResult(data)
      toast.success('Plagiarism check complete!')
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
      <h3 className="text-xl font-bold mb-4">Plagiarism Checker</h3>
      <p className="text-white/70 mb-4 text-sm">
        Estimate originality and complexity of your text.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 h-32 resize-none"
      />

      <Button onClick={handleCheck} loading={loading}>
        <Shield className="w-4 h-4" />
        Check
      </Button>

      {result && (
        <motion.div
          className="bg-white/5 rounded-lg p-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Originality Score:</span>
            <span className="text-2xl font-black gradient-text">{result.originality_score}%</span>
          </div>
          <div className="text-sm text-white/70">{result.message}</div>
        </motion.div>
      )}
    </motion.div>
  )
}
