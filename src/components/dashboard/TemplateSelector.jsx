import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Loader2 } from 'lucide-react'

export default function TemplateSelector({ onSelect }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const data = await api.getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template, i) => (
        <motion.button
          key={template.id}
          onClick={() => onSelect(template)}
          className="glass rounded-xl p-4 text-left hover:bg-white/[0.15] transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-3xl mb-2">{template.icon}</div>
          <h3 className="font-bold mb-1">{template.name}</h3>
          <p className="text-sm text-white/60">{template.description}</p>
        </motion.button>
      ))}
    </div>
  )
}
