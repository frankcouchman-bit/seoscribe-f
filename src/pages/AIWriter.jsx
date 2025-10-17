import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Star, Zap } from 'lucide-react'

export default function AIWriter() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold">Top Rated AI Writer in 2025</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              The Most Powerful <span className="gradient-text">AI Writer</span>
              <br />for SEO Content
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Our <strong>AI writer</strong> generates rank-ready articles with citations, images, and 
              social posts. The best <strong>AI writing tool</strong> for content that drives traffic.
            </p>

            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Try Free AI Writer Now
              </div>
            </motion.button>
          </motion.div>

          <div className="glass-strong rounded-2xl p-10">
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
        </div>
      </div>
    </>
  )
}
