import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

export default function ArticleWriter() {
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
            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              Professional <span className="gradient-text">Article Writer</span>
              <br />Software for SEO
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              The most advanced <strong>article writer</strong> that creates complete, SEO-optimized 
              content. Our <strong>article writing software</strong> helps teams publish faster.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
