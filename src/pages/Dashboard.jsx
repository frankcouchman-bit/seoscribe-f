import { motion } from 'framer-motion'
import { useEffect } from 'react'
import ArticleGenerator from '../components/dashboard/ArticleGenerator'
import Stats from '../components/dashboard/Stats'
import RecentArticles from '../components/dashboard/RecentArticles'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { refreshUsage, initializeUsage } = useAuth()

  useEffect(() => {
    initializeUsage()
    refreshUsage()

    const interval = setInterval(() => {
      refreshUsage()
    }, 3000)

    return () => clearInterval(interval)
  }, [refreshUsage, initializeUsage])

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-2">Dashboard</h1>
          <p className="text-white/60 text-lg">Generate SEO-optimized content with AI</p>
        </motion.div>

        <Stats />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArticleGenerator />
          </div>
          
          <div className="lg:col-span-1">
            <RecentArticles />
          </div>
        </div>
      </div>
    </div>
  )
}
