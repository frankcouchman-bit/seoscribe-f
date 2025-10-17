import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import AuthModal from '../components/auth/AuthModal'

export default function ArticleWriter() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <Helmet>
        <title>Best Article Writer - AI Article Writing Software | SEOScribe</title>
        <meta name="description" content="Professional article writer software that generates SEO-optimized articles with citations and images. Try the best article writing tool free." />
        <link rel="canonical" href="https://seoscribe.pro/article-writer" />
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
              <span className="text-sm font-bold">Professional Article Writing</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              Professional <span className="gradient-text">Article Writer</span>
              <br />Software for SEO
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              The most advanced <strong>article writer</strong> that creates complete, SEO-optimized 
              content. Our <strong>article writing software</strong> helps teams publish faster.
            </p>

            <motion.button
              onClick={() => user ? navigate('/dashboard') : setShowAuthModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Writing Free
            </motion.button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: '1500+ Word Articles',
                description: 'Generate comprehensive, in-depth articles with FAQs and conclusions.',
                icon: FileText
              },
              {
                title: 'Hero Images Included',
                description: 'Every article comes with a custom-generated hero image for your topic.',
                icon: CheckCircle
              },
              {
                title: 'Internal Link Integration',
                description: 'Automatically scan your website and add relevant internal links.',
                icon: CheckCircle
              },
              {
                title: 'Social Media Drafts',
                description: 'Get Twitter, LinkedIn, and Facebook posts for every article.',
                icon: CheckCircle
              },
              {
                title: 'Citation & Sources',
                description: 'All articles include proper citations from authoritative sources.',
                icon: CheckCircle
              },
              {
                title: 'SEO Optimized',
                description: 'Proper headings, meta descriptions, and keyword optimization built-in.',
                icon: CheckCircle
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
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
            <h2 className="text-3xl font-black mb-4">Start Creating Better Articles Today</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Join content teams using professional article writing software to publish faster.
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
