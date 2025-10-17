import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sparkles, Zap, Check, Star, FileText, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { useAuth } from '../hooks/useAuth'
import AuthModal from '../components/auth/AuthModal'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { generateArticle, generating } = useArticles()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return

    try {
      const article = await generateArticle(topic, websiteUrl)
      navigate('/dashboard')
    } catch (error) {
      if (error.message.includes('Sign in')) {
        setShowAuthModal(true)
      }
    }
  }

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold">Rated #1 AI Writer • 12,000+ Users</span>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              The Best <span className="gradient-text">AI Writer</span>
              <br />for SEO Content
            </motion.h1>

            <motion.p
              className="text-xl text-white/80 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Generate <strong className="text-white">proven, rank-ready articles</strong> with citations 
              and images in 90 seconds. Our AI writing tool creates SEO-optimized content that 
              outranks competitors.
            </motion.p>

            <motion.form
              onSubmit={handleGenerate}
              className="max-w-2xl mx-auto glass-strong rounded-2xl p-8 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your topic (e.g., Best Project Management Tools 2025)"
                className="w-full px-4 py-4 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                disabled={generating}
              />
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Your website URL (optional, for internal links)"
                className="w-full px-4 py-4 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                disabled={generating}
              />
              <motion.button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={generating || !topic.trim()}
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Generate Article Now - Free</span>
                  </>
                )}
              </motion.button>
              <p className="text-white/60 text-sm mt-4">
                Free forever: 1 article/day • Pro: 15/day + unlimited exports
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-4">Why Choose Our AI Writer</h2>
            <p className="text-xl text-white/70">
              Everything you need to create, optimize, and publish SEO content
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Complete Content Packages',
                description: 'Get articles with citations, images, FAQs, and social posts - everything ready to publish',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Check,
                title: 'SEO-Optimized Structure',
                description: 'Proper headings, meta descriptions, keyword placement, and readability optimization',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: TrendingUp,
                title: 'Proven to Rank',
                description: 'Our AI writer creates content that actually ranks on Google and drives organic traffic',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-8 hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
