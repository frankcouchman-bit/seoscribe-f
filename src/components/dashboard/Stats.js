import { motion } from 'framer-motion'
import { FileText, TrendingUp } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useEffect, useState } from 'react'

export default function Stats() {
  const { usage, plan, user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Force re-render every second to show real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const { getLocalUsage } = useAuth.getState()
      const newUsage = getLocalUsage()
      useAuth.setState({ usage: newUsage })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const today = usage?.today?.generations || 0
  const thisMonth = usage?.thisMonth?.total || 0
  const maxToday = (plan === 'pro' || plan === 'enterprise') ? 15 : 1

  const stats = [
    {
      label: 'Articles Today',
      value: user ? `${today}/${maxToday}` : `${today}/1`,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      progress: (today / maxToday) * 100
    },
    {
      label: 'This Month',
      value: thisMonth,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      progress: null
    }
  ]

  if (!mounted) return null

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          className="glass-strong rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white/60 text-sm mb-1">{stat.label}</div>
              <div className="text-3xl font-black">{stat.value}</div>
            </div>
            <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-7 h-7" />
            </div>
          </div>
          
          {stat.progress !== null && (
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                key={`progress-${today}`}
                className={`h-full bg-gradient-to-r ${stat.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stat.progress, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
