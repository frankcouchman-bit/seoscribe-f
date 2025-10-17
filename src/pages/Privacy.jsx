import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black">Privacy Policy</h1>
          </div>
          <p className="text-white/70">Last updated: January 2025</p>
        </motion.div>

        <motion.div
          className="glass-strong rounded-2xl p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-white/80 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Email address for account creation and authentication</li>
              <li>Generated articles and content you create</li>
              <li>Usage data including API calls and tool usage</li>
              <li>Payment information processed securely through Stripe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-white/80 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and manage subscriptions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Storage</h2>
            <p className="text-white/80">
              Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and in transit. 
              We retain your data for as long as your account is active or as needed to provide services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
            <p className="text-white/80 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Supabase for authentication and database</li>
              <li>Stripe for payment processing</li>
              <li>OpenRouter & Anthropic for AI content generation</li>
              <li>Cloudflare Workers for hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-white/80 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
            <p className="text-white/80">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:support@seoscribe.pro" className="text-purple-400 hover:underline">
                support@seoscribe.pro
              </a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
