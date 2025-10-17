import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | SEOScribe</title>
        <meta name="description" content="SEOScribe terms of service - Rules and guidelines for using our platform." />
        <link rel="canonical" href="https://seoscribe.pro/terms" />
      </Helmet>

      <div className="min-h-screen pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black">Terms of Service</h1>
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
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/80">
                By accessing and using SEOScribe, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-white/80">
                SEOScribe provides AI-powered content generation tools for creating SEO-optimized articles. 
                The service includes article generation, SEO analysis tools, and content optimization features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-white/80 mb-4">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Notify us of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Subscription & Payment</h2>
              <p className="text-white/80 mb-4">
                Paid subscriptions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>Pro plan: $24/month, billed monthly</li>
                <li>Auto-renewal unless cancelled</li>
                <li>No refunds for partial months</li>
                <li>Cancel anytime through your account settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Usage Limits</h2>
              <p className="text-white/80 mb-4">
                Service limits:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>Free: 1 article per day, 1 tool use per tool per day</li>
                <li>Pro: 15 articles per day, 10 tool uses per tool per day</li>
                <li>Limits reset at midnight UTC</li>
                <li>Abuse or excessive use may result in suspension</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Content Ownership</h2>
              <p className="text-white/80">
                You retain all rights to content you generate using SEOScribe. We do not claim ownership 
                of your generated content. You are responsible for ensuring your content complies with 
                applicable laws and does not infringe on third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Prohibited Uses</h2>
              <p className="text-white/80 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>Use the service for illegal purposes</li>
                <li>Generate harmful, offensive, or misleading content</li>
                <li>Attempt to bypass usage limits or security measures</li>
                <li>Resell or redistribute our service</li>
                <li>Reverse engineer or copy our technology</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
              <p className="text-white/80">
                We reserve the right to suspend or terminate your account if you violate these terms or 
                engage in fraudulent or abusive behavior.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
              <p className="text-white/80">
                Questions about these Terms? Contact us at:{' '}
                <a href="mailto:support@seoscribe.pro" className="text-purple-400 hover:underline">
                  support@seoscribe.pro
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  )
}
