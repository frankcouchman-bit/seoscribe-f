import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../ui/Button'
import { BookOpen } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ReadabilityChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const data = await api.checkReadability(text)
      setResult(data)
      toast.success('Readability checked!')
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
      <h3 className="text-xl font-bold mb-4">Readability Checker</h3>
      <p className="text-white/70 mb-4 text-sm">
        Measure reading level using Flesch formulas.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full px-4 py-3 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 h-32 resize-none"
      />

      <Button onClick={handleCheck} loading={loading}>
        <BookOpen className="w-4 h-4" />
        Check
      </Button>

      {result && (
        <motion.div
          className="bg-white/5 rounded-lg p-4 space-y-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between">
            <span>Flesch Score:</span>
            <span className="font-bold">{result.flesch_reading_ease}</span>
          </div>
          <div className="flex justify-between">
            <span>Grade Level:</span>
            <span className="font-bold">{result.flesch_kincaid_grade}</span>
          </div>
          <div className="text-sm text-white/70 mt-2">{result.level}</div>
        </motion.div>
      )}
    </motion.div>
  )
}
