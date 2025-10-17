import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Sparkles, TrendingUp, Zap } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useArticles } from '../hooks/useArticles'
import { useNavigate } from 'react-router-dom'
import ArticleGenerator from '../components/dashboard/ArticleGenerator'
import ArticleLibrary from '../components/dashboard/ArticleLibrary'

export default function Dashboard() {
  const { user, plan, usage } = useAuth()
  const { fetchArticles } = useArticles()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('generate')

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchArticles()
  }, [user, navigate, fetchArticles])

  if (!user) return null

  const stats = [
    { label: 'Today', value: usage.today.generations, max: plan === 'pro' ? 15 : 1, icon: Zap },
    { label: 'This Month', value: usage.month.generations, icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">Dashboard</h1>
          <p className="text-white/70">Welcome back! Ready to create amazing content?</p>
        </motion.div>

        {plan === 'free' && (
          <motion.div
            className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-bold">Upgrade to Pro</div>
                <div className="text-sm text-white/70">Get 15 articles/day + unlimited exports</div>
              </div>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold">
              Upgrade
            </button>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.max && (
                  <div className="text-xs text-white/60">
                    /{stat.max}
                  </div>
                )}
              </div>
              <div className="text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-sm text-white/70 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['generate', 'library'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {tab === 'generate' ? 'Generate' : 'Library'}
            </button>
          ))}
        </div>

        {activeTab === 'generate' ? <ArticleGenerator /> : <ArticleLibrary />}
      </div>
    </div>
  )
}
