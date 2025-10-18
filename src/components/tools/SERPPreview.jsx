import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function SERPPreview() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchSERP = async () => {
    if (!keyword.trim()) {
      toast.error('Enter a keyword to search')
      return
    }

    setLoading(true)
    try {
      const data = await api.getSERPResults(keyword)
      setResults(data)
      toast.success('SERP data loaded!')
    } catch (error) {
      toast.error(error.message || 'Failed to fetch SERP data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">SERP Preview & Analysis</h2>
          <p className="text-white/60">See real Google search results and analyze competition</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Search Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., best AI writing tools 2025"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            onKeyPress={(e) => e.key === 'Enter' && fetchSERP()}
          />
        </div>

        <motion.button
          onClick={fetchSERP}
          disabled={loading || !keyword.trim()}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="button"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Fetching Live Data...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Get Real SERP Data
            </>
          )}
        </motion.button>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {results.stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">{results.stats.total_results || 'N/A'}</div>
                <div className="text-sm text-white/60">Total Results</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">{results.stats.time || 'N/A'}</div>
                <div className="text-sm text-white/60">Search Time</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">{results.organic?.length || 0}</div>
                <div className="text-sm text-white/60">Organic Results</div>
              </div>
            </div>
          )}

          {results.organic && results.organic.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Top 10 Organic Results:</h3>
              <div className="space-y-4">
                {results.organic.slice(0, 10).map((result, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-purple-400">#{i + 1}</span>
                          <a 
                            href={result.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-lg font-semibold hover:underline"
                          >
                            {result.title}
                          </a>
                          <ExternalLink className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="text-sm text-green-400 mb-2">{result.link}</div>
                        <div className="text-sm text-white/70">{result.snippet}</div>
                        {result.sitelinks && result.sitelinks.length > 0 && (
                          <div className="mt-2 text-xs text-white/50">
                            + {result.sitelinks.length} sitelinks
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.relatedSearches && results.relatedSearches.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Related Searches:</h3>
              <div className="flex flex-wrap gap-2">
                {results.relatedSearches.map((search, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-purple-500/20 rounded-full text-sm cursor-pointer hover:bg-purple-500/30 transition-colors"
                    onClick={() => {
                      setKeyword(search.query)
                      toast.success('Keyword updated!')
                    }}
                  >
                    {search.query}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.peopleAlsoAsk && results.peopleAlsoAsk.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">People Also Ask:</h3>
              <div className="space-y-3">
                {results.peopleAlsoAsk.map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-lg">
                    <div className="font-semibold mb-2">{item.question}</div>
                    <div className="text-sm text-white/70">{item.snippet}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!results && !loading && (
        <div className="mt-8 text-center text-white/50">
          Enter a keyword and click "Get Real SERP Data" to see live Google results
        </div>
      )}
    </div>
  )
}
