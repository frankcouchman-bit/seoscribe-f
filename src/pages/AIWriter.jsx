import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Star, Zap, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import AuthModal from '../components/auth/AuthModal'

export default function AIWriter() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <Helmet>
        <title>Best AI Writer - Free AI Writing Tool for SEO | SEOScribe</title>
        <meta name="description" content="The best AI writer for creating SEO-optimized content. Free AI writing tool generates proven articles with citations and images. #1 rated AI writer." />
        <link rel="canonical" href="https://seoscribe.pro/ai-writer" />
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
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold">Top Rated AI Writer in 2025</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              The Most Powerful <span className="gradient-text">AI Writer</span>
              <br />for SEO Content
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Our <strong>AI writer</strong> generates rank-ready articles with citations, images, and 
              social posts. The best <strong>AI writing tool</strong> for content that drives traffic.
            </p>

            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => user ? navigate('/dashboard') : setShowAuthModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Try Free AI Writer Now
                </div>
              </motion.button>
            </div>
          </motion.div>

          <div className="glass-strong rounded-2xl p-10 mb-16">
            <h2 className="text-3xl font-black mb-6">What Makes This the Best AI Writer?</h2>
            <div className="prose prose-invert max-w-none text-white/80 leading-relaxed space-y-4">
              <p>
                An <strong>AI writer</strong> uses artificial intelligence to create content automatically. 
                But SEOScribe's <strong>AI writer</strong> goes beyond simple text generation – it creates 
                complete, SEO-optimized articles with citations, images, and social media posts.
              </p>
              <p>
                Unlike other <strong>AI writing tools</strong>, our <strong>AI writer</strong> analyzes 
                top-ranking content, generates authoritative citations, and creates custom images – all 
                in under 2 minutes.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Complete Content Packages',
                description: 'Get articles with citations, hero images, FAQs, internal links, and social media posts.',
                icon: CheckCircle
              },
              {
                title: 'SEO-Optimized by Default',
                description: 'Every article includes proper headings, meta descriptions, and keyword optimization.',
                icon: CheckCircle
              },
              {
                title: 'Real Research & Citations',
                description: 'Our AI analyzes top-ranking content and cites authoritative sources automatically.',
                icon: CheckCircle
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 glass-strong rounded-2xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black mb-4">Ready to Create Better Content?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of content creators using the best AI writer for SEO.
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
