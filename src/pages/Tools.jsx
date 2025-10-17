import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import HeadlineAnalyzer from '../components/tools/HeadlineAnalyzer'
import ReadabilityChecker from '../components/tools/ReadabilityChecker'
import SERPPreview from '../components/tools/SERPPreview'
import PlagiarismChecker from '../components/tools/PlagiarismChecker'
import CompetitorAnalysis from '../components/tools/CompetitorAnalysis'
import KeywordCluster from '../components/tools/KeywordCluster'
import ContentBrief from '../components/tools/ContentBrief'
import MetaGenerator from '../components/tools/MetaGenerator'

export default function Tools() {
  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black">SEO & Writing Tools</h1>
              <p className="text-white/70">Professional tools for content optimization</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <HeadlineAnalyzer />
          <ReadabilityChecker />
          <SERPPreview />
          <PlagiarismChecker />
          <CompetitorAnalysis />
          <KeywordCluster />
          <ContentBrief />
          <MetaGenerator />
        </div>
      </div>
    </div>
  )
}
