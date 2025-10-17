import { motion } from 'framer-motion'
import { BookOpen, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Blog() {
  // Placeholder blog posts - you'll add real ones later
  const posts = [
    {
      id: 1,
      title: 'How to Write SEO Content That Actually Ranks in 2025',
      excerpt: 'Learn the latest SEO writing strategies that help your content rank higher on Google and drive organic traffic.',
      date: '2025-01-15',
      category: 'SEO Strategy',
      readTime: '8 min read',
      slug: 'how-to-write-seo-content-2025'
    },
    {
      id: 2,
      title: 'AI Writing Tools vs Human Writers: The Complete Comparison',
      excerpt: 'Discover the pros and cons of AI writing tools compared to human writers and when to use each.',
      date: '2025-01-10',
      category: 'AI Writing',
      readTime: '6 min read',
      slug: 'ai-writing-tools-vs-human-writers'
    },
    {
      id: 3,
      title: '15 Content Writing Tips for Beginners',
      excerpt: 'Master the fundamentals of content writing with these proven tips that work for any niche or industry.',
      date: '2025-01-05',
      category: 'Writing Tips',
      readTime: '10 min read',
      slug: 'content-writing-tips-beginners'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Blog - SEO & Content Writing Tips | SEOScribe</title>
        <meta name="description" content="Learn about SEO, content writing, and AI writing tools. Expert tips and strategies for creating content that ranks." />
        <link rel="canonical" href="https://seoscribe.pro/blog" />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold">SEO & Writing Resources</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Expert insights on SEO, content writing, and AI writing tools to help you create better content.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                className="glass rounded-2xl overflow-hidden hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/30" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm text-white/60">
                    <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-400 text-xs font-bold">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                  <p className="text-white/70 mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">{post.readTime}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-bold"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Coming Soon Message */}
          <motion.div
            className="mt-16 glass-strong rounded-2xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">More Content Coming Soon!</h2>
            <p className="text-white/70">
              We're working on publishing comprehensive guides about SEO, content writing, and AI tools.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
