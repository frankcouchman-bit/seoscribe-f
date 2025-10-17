import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Zap, Target, TrendingUp } from 'lucide-react'

export default function WritingTool() {
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
            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              All-in-One <span className="gradient-text">Writing Tool</span>
              <br />for Content Teams
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              More than just a <strong>writing tool</strong> – a complete content creation platform. 
              Our <strong>AI writing tool</strong> includes 15+ features for research, writing, and optimization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Zap,
                title: 'AI-Powered Writing',
                description: 'Generate full articles with citations, images, and SEO optimization in seconds.',
              },
              {
                icon: Target,
                title: 'SEO Tools Suite',
                description: '15+ professional tools for keyword research, competitor analysis, and optimization.',
              },
              {
                icon: TrendingUp,
                title: 'Content Analytics',
                description: 'Track performance, readability scores, and SEO metrics for every article.',
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
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
