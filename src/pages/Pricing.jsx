import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import AuthModal from '../components/auth/AuthModal'

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, plan } = useAuth()

  const handleUpgrade = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    try {
      const { url } = await api.createCheckoutSession(
        window.location.origin + '/dashboard',
        window.location.origin + '/pricing'
      )
      window.location.href = url
    } catch (error) {
      toast.error(error.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const { url } = await api.createPortalSession(window.location.origin + '/pricing')
      window.location.href = url
    } catch (error) {
      toast.error(error.message || 'Failed to open billing portal')
      setLoading(false)
    }
  }

  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out SEOScribe',
      features: [
        '1 article per day',
        '3000+ words per article',
        '1 use per SEO tool/day',
        'Basic templates',
        'Markdown export',
        'Community support'
      ],
      cta: 'Get Started Free',
      popular: false,
      current: plan === 'free'
    },
    {
      name: 'Pro',
      icon: Zap,
      price: { monthly: 29, yearly: 290 },
      description: 'For serious content creators',
      features: [
        '15 articles per day',
        '3000-4000 words per article',
        '10 uses per SEO tool/day',
        'All 6 premium templates',
        'Article expansion feature',
        'Export to PDF, DOCX, HTML',
        'WordPress integration',
        'Priority support',
        'Remove watermark',
        'Advanced SEO scoring'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      current: plan === 'pro'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 99, yearly: 990 },
      description: 'For teams and agencies',
      features: [
        'Unlimited articles',
        'Unlimited SEO tools',
        'All premium features',
        'Team collaboration',
        'API access',
        'Custom templates',
        'White label option',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee'
      ],
      cta: 'Contact Sales',
      popular: false,
      current: plan === 'enterprise'
    }
  ]

  return (
    <>
      <div className="min-h-screen pt-20 pb-16">
        {/* HEADER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Choose the plan that's right for you. All plans include core features.
            </p>

            {/* BILLING TOGGLE */}
            <div className="inline-flex items-center gap-3 p-1 bg-white/10 rounded-lg border border-white/20">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
                type="button"
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
                type="button"
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Save 17%
                </span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* PRICING CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((planItem, i) => (
              <motion.div
                key={planItem.name}
                className={`glass-strong rounded-2xl p-8 relative ${
                  planItem.popular ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/20' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: planItem.current ? 1 : 1.02 }}
              >
                {planItem.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                {planItem.current && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-green-500 rounded-full text-sm font-bold">
                    Current Plan
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    planItem.popular
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-white/10'
                  }`}>
                    <planItem.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{planItem.name}</h3>
                </div>

                <p className="text-white/60 mb-6">{planItem.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">
                      ${planItem.price[billingCycle]}
                    </span>
                    {planItem.price.monthly > 0 && (
                      <span className="text-white/60">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && planItem.price.monthly > 0 && (
                    <div className="text-sm text-white/50 mt-1">
                      ${(planItem.price.yearly / 12).toFixed(2)}/month billed annually
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {planItem.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  onClick={() => {
                    if (planItem.name === 'Enterprise') {
                      window.location.href = 'mailto:sales@seoscribe.pro'
                    } else if (planItem.name === 'Free') {
                      if (!user) {
                        setShowAuthModal(true)
                      }
                    } else if (planItem.current && user) {
                      handleManageBilling()
                    } else if (user) {
                      handleUpgrade()
                    } else {
                      setShowAuthModal(true)
                    }
                  }}
                  disabled={loading || (planItem.current && planItem.name !== 'Pro')}
                  className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    planItem.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : planItem.current
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  whileHover={{ scale: (loading || planItem.current) ? 1 : 1.05 }}
                  whileTap={{ scale: (loading || planItem.current) ? 1 : 0.95 }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : planItem.current && planItem.name !== 'Pro' ? (
                    <>
                      <Check className="w-5 h-5" />
                      Current Plan
                    </>
                  ) : planItem.current && planItem.name === 'Pro' ? (
                    'Manage Billing'
                  ) : (
                    <>
                      {planItem.cta}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately."
              },
              {
                q: "What happens if I exceed my daily limit?",
                a: "On the Free plan, you'll need to wait until the next day or upgrade to Pro. Pro users get 15 articles/day. Enterprise has unlimited usage."
              },
              {
                q: "Is there a refund policy?",
                a: "Yes, we offer a 14-day money-back guarantee on all paid plans. No questions asked."
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely! Cancel anytime from your dashboard. Your access continues until the end of your billing period."
              },
              {
                q: "Do you offer discounts for annual plans?",
                a: "Yes! Annual plans save you 17% compared to paying monthly. That's over 2 months free."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and digital wallets through Stripe."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                className="glass-strong rounded-xl p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <h3 className="text-xl font-bold mb-2">{faq.q}</h3>
                <p className="text-white/70">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="glass-strong rounded-3xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-4xl font-black mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Our team is here to help. Get in touch with us.
            </p>
            <a href="mailto:support@seoscribe.pro">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
            </a>
          </motion.div>
        </section>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
