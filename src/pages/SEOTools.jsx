import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet'
import { useState } from 'react'
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Target, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle 
} from 'lucide-react'
import HeadlineAnalyzer from '../components/tools/HeadlineAnalyzer'
import ReadabilityChecker from '../components/tools/ReadabilityChecker'
import SERPPreview from '../components/tools/SERPPreview'
import PlagiarismChecker from '../components/tools/PlagiarismChecker'
import CompetitorAnalysis from '../components/tools/CompetitorAnalysis'
import KeywordCluster from '../components/tools/KeywordCluster'
import ContentBrief from '../components/tools/ContentBrief'
import MetaGenerator from '../components/tools/MetaGenerator'
import { useAuth } from '../hooks/useAuth'

export default function SEOTools() {
  const [activeTool, setActiveTool] = useState('headline')
  const { plan } = useAuth()

  const tools = [
    { id: 'headline', name: 'Headline Analyzer', icon: Sparkles, component: HeadlineAnalyzer },
    { id: 'readability', name: 'Readability Checker', icon: BookOpen, component: ReadabilityChecker },
    { id: 'serp', name: 'SERP Preview', icon: Search, component: SERPPreview },
    { id: 'plagiarism', name: 'Plagiarism Checker', icon: CheckCircle, component: PlagiarismChecker },
    { id: 'competitors', name: 'Competitor Analysis', icon: TrendingUp, component: CompetitorAnalysis },
    { id: 'keywords', name: 'Keyword Clustering', icon: Target, component: KeywordCluster },
    { id: 'brief', name: 'Content Brief', icon: FileText, component: ContentBrief },
    { id: 'meta', name: 'Meta Description', icon: MessageSquare, component: MetaGenerator }
  ]

  const ActiveComponent = tools.find(t => t.id === activeTool)?.component

  return (
    <>
      <Helmet>
        <title>SEO Tools - Free SEO Analysis & Optimization | SEOScribe</title>
        <meta name="description" content="Free SEO tools including headline analyzer, readability checker, SERP preview, plagiarism checker, and more. Optimize your content for search engines." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black mb-4">
              SEO Tools Suite
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Professional SEO tools to optimize your content. 
              <strong className="text-purple-400">
                {plan === 'pro' ? ' 10 uses per tool/day' : ' 1 use per tool/day'}
              </strong>
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* SIDEBAR - TOOL SELECTOR */}
            <div className="lg:col-span-1">
              <div className="glass-strong rounded-2xl p-4 sticky top-24">
                <h2 className="font-bold mb-4 px-2">Select Tool</h2>
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <motion.button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                        activeTool === tool.id
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-500'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <tool.icon className="w-5 h-5" />
                      <span className="font-semibold text-sm">{tool.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* MAIN CONTENT - ACTIVE TOOL */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {ActiveComponent && <ActiveComponent />}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
