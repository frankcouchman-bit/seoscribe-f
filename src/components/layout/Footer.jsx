import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/5 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-white">SEOScribe</span>
            </div>
            <p className="text-white/60 text-sm">
              Best AI writer and article writer for creating SEO-optimized content.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Product</h3>
            <div className="space-y-2">
              <Link to="/ai-writer" className="block text-white/70 hover:text-white transition-colors text-sm">
                AI Writer
              </Link>
              <Link to="/article-writer" className="block text-white/70 hover:text-white transition-colors text-sm">
                Article Writer
              </Link>
              <Link to="/writing-tool" className="block text-white/70 hover:text-white transition-colors text-sm">
                Writing Tool
              </Link>
              <Link to="/tools" className="block text-white/70 hover:text-white transition-colors text-sm">
                SEO Tools
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <div className="space-y-2">
              <a href="#pricing" className="block text-white/70 hover:text-white transition-colors text-sm">
                Pricing
              </a>
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <p className="text-white/70 text-sm">support@seoscribe.pro</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>© 2025 SEOScribe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
