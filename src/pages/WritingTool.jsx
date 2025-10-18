import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function WritingTool() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">AI Writing Tool</span>
          </div>
          
          <h1 className="text-5xl font-black mb-4">
            AI Writing Assistant
          </h1>
          
          <p className="text-xl text-white/70">
            Coming soon - Professional AI writing tools
          </p>
        </motion.div>

        <motion.div
          className="glass-strong rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-2">Under Construction</h2>
            <p className="text-white/60">
              This feature is coming soon. Check back later!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
