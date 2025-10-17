import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Sparkles, TrendingUp, Zap, Crown, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useArticles } from '../hooks/useArticles'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import ArticleGenerator from '../components/dashboard/ArticleGenerator'
import ArticleLibrary from '../components/dashboard/ArticleLibrary'

export default function Dashboard() {
  const { user, plan, usage, refreshUsage, canGenerate } = useAuth()
  const { fetchArticles } = useArticles()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('generate')
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchArticles()
    refreshUsage()
  }, [user, navigate, fetchArticles, refreshUsage])

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      const { url } = await api.createCheckoutSession()
      window.location.href = url
    } catch (error) {
      toast.error('Failed to start checkout')
      setUpgrading(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const { url } = await api.createPortalSession()
      window.location.href = url
    } catch (error) {
      toast.error('Failed to open billing portal')
    }
  }

  if (!user) return null

  const maxGenerations = plan === 'pro' ? 15 : 1
  const currentGenerations = usage?.today?.generations || 0
  const canCreate = canGenerate()

  const stats = [
    { 
      label: 'Articles Today', 
      value: currentGenerations, 
      max: maxGenerations, 
      icon: Zap,
      color: canCreate ? 'from-purple-500 to-pink-500' : 'from-red-500 to-orange-500'
    },
    { 
      label: 'This Month', 
      value: usage?.month?.generations || 0, 
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
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
          <p className="text-white/70">Welcome back, {user.email?.split('@')[0]}! Ready to create amazing content?</p>
        </motion.div>

        {!canCreate && plan === 'free' && (
          <motion.div
            className="mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-6 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="font-bold text-lg">Daily Limit Reached</div>
                <div className="text-sm text-white/70">You've used your 1 free article today. Upgrade to Pro for 15 articles/day!</div>
              </div>
            </div>
            <motion.button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold shadow-lg disabled:opacity-50"
              whileHover={{ scale: upgrading ? 1 : 1.05 }}
              whileTap={{ scale: upgrading ? 1 : 0.95 }}
            >
              {upgrading ? 'Loading...' : 'Upgrade Now'}
            </motion.button>
          </motion.div>
        )}

        {plan === 'free' && canCreate && (
          <motion.div
            className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Upgrade to Pro</div>
                <div className="text-sm text-white/70">Get 15 articles/day + unlimited exports for $24/month</div>
              </div>
            </div>
            <motion.button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold shadow-lg disabled:opacity-50"
              whileHover={{ scale: upgrading ? 1 : 1.05 }}
              whileTap={{ scale: upgrading ? 1 : 0.95 }}
            >
              {upgrading ? 'Loading...' : 'Upgrade Now'}
            </motion.button>
          </motion.div>
        )}

        {plan === 'pro' && (
          <motion.div
            className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Pro Plan Active ✨</div>
                <div className="text-sm text-white/70">Enjoying unlimited access to all features</div>
              </div>
            </div>
            <motion.button
              onClick={handleManageBilling}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Manage Billing
            </motion.button>
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
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.max && (
                  <div className="text-sm text-white/60">
                    /{stat.max}
                  </div>
                )}
              </div>
              <div className="text-3xl font-black gradient-text">
                {stat.value}{stat.max ? `/${stat.max}` : ''}
              </div>
              <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              {stat.max && (
                <div className="mt-3 bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                    style={{ width: `${(stat.value / stat.max) * 100}%` }}
                  />
                </div>
              )}
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
              {tab === 'generate' ? '✨ Generate' : '📚 Library'}
            </button>
          ))}
        </div>

        {activeTab === 'generate' ? <ArticleGenerator /> : <ArticleLibrary />}
      </div>
    </div>
  )
}
