import { motion } from 'framer-motion'
import { FileText, TrendingUp } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useEffect } from 'react'

export default function Stats() {
  const { usage, plan } = useAuth()

  const today = usage?.today?.generations || 0
  const thisMonth = usage?.thisMonth?.total || 0
  const maxToday = plan === 'pro' || plan === 'enterprise' ? 15 : 1

  // Auto-refresh every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const { getLocalUsage } = useAuth.getState()
      useAuth.setState({ usage: getLocalUsage() })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      label: 'Articles Today',
      value: `${today}/${maxToday}`,
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
                className={`h-full bg-gradient-to-r ${stat.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stat.progress, 100)}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
