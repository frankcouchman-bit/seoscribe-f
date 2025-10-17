import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Zap, Target, TrendingUp, Sparkles, FileText, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import AuthModal from '../components/auth/AuthModal'

export default function WritingTool() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <Helmet>
        <title>Best Writing Tool for Content Creation - Free | SEOScribe</title>
        <meta name="description" content="The most powerful writing tool for SEO content. Free AI writing software with 15+ tools including article generation and optimization." />
        <link rel="canonical" href="https://seoscribe.pro/writing-tool" />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold">Complete Writing Solution</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              All-in-One <span className="gradient-text">Writing Tool</span>
              <br />for Content Teams
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              More than just a <strong>writing tool</strong> – a complete content creation platform. 
              Our <strong>AI writing tool</strong> includes 15+ features for research, writing, and optimization.
            </p>

            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => user ? navigate('/dashboard') : setShowAuthModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user ? 'Go to Dashboard' : 'Start Writing Free'}
              </motion.button>
              <motion.button
                onClick={() => navigate('/tools')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Tools
              </motion.button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Zap,
                title: 'AI-Powered Writing',
                description: 'Generate full articles with citations, images, and SEO optimization in seconds.',
                features: ['Article generation', 'Auto citations', 'Hero images', 'Social posts']
              },
              {
                icon: Target,
                title: 'SEO Tools Suite',
                description: '15+ professional tools for keyword research, competitor analysis, and optimization.',
                features: ['Keyword clustering', 'Competitor analysis', 'Readability checker', 'SERP preview']
              },
              {
                icon: TrendingUp,
                title: 'Content Analytics',
                description: 'Track performance, readability scores, and SEO metrics for every article.',
                features: ['Word count tracking', 'Reading time', 'SEO scoring', 'Performance metrics']
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="glass-strong rounded-2xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FileText className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">Ready to Transform Your Content?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Join 12,000+ content creators using SEOScribe to create high-ranking articles faster than ever.
            </p>
            <motion.button
              onClick={() => user ? navigate('/dashboard') : setShowAuthModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
