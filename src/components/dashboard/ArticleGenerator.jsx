import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Sparkles, AlertCircle, Lock, UserPlus, Clock } from 'lucide-react'
import { useArticles } from '../../hooks/useArticles'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AuthModal from '../auth/AuthModal'
import { api } from '../../lib/api'

const TEMPLATES = [
  { id: 'default', name: 'Standard Article', icon: '📝', description: 'Comprehensive long-form content' },
  { id: 'listicle', name: 'Listicle', icon: '📋', description: 'Top 10, Best 20 list format' },
  { id: 'how-to-guide', name: 'How-To Guide', icon: '📚', description: 'Step-by-step instructions' },
  { id: 'product-review', name: 'Product Review', icon: '⭐', description: 'Detailed analysis with pros/cons' },
  { id: 'comparison-post', name: 'Comparison', icon: '⚖️', description: 'X vs Y side-by-side' },
  { id: 'ultimate-guide', name: 'Ultimate Guide', icon: '📖', description: 'In-depth 3000+ word guide' },
]

export default function ArticleGenerator() {
  const [topic, setTopic] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [showTemplates, setShowTemplates] = useState(false)
  const [headlines, setHeadlines] = useState([])
  const [selectedHeadline, setSelectedHeadline] = useState('')
  const [showHeadlines, setShowHeadlines] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const { generateArticle, generating } = useArticles()
  const { canGenerate, plan, incrementGeneration, user, usage, getDemoTimeRemaining } = useAuth()
  const navigate = useNavigate()

  const isDemoUser = !user
  const demoUsed = isDemoUser && localStorage.getItem('demo_used') === 'true'
  const demoTimeRemaining = getDemoTimeRemaining()
  const canCreate = canGenerate()
  const currentGenerations = usage?.today?.generations || 0
  const maxGenerations = (plan === 'pro' || plan === 'enterprise') ? 15 : 1

  useEffect(() => {
    const interval = setInterval(() => {
      const { getLocalUsage } = useAuth.getState()
      useAuth.setState({ usage: getLocalUsage() })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const generateHeadlines = () => {
    if (!topic.trim()) {
      toast.error('Enter a topic first')
      return
    }

    const baseTopics = [
      `${topic}: The Complete Guide for 2025`,
      `Everything You Need to Know About ${topic}`,
      `${topic}: Ultimate Beginner's Guide`,
      `How to Master ${topic} in 2025`,
      `${topic}: Expert Tips and Strategies`
    ]
    
    setHeadlines(baseTopics)
    setShowHeadlines(true)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    
    if (isDemoUser) {
      if (demoUsed) {
        setShowAuthModal(true)
        return
      }
    }
    
    if (!canCreate) {
      if (isDemoUser) {
        setShowAuthModal(true)
      } else {
        toast.error('Daily limit reached!')
      }
      return
    }
    
    try {
      const finalTopic = selectedHeadline || topic
      
      if (selectedTemplate !== 'default') {
        const response = await api.generateFromTemplate({
          template_id: selectedTemplate,
          topic: finalTopic,
          website_url: websiteUrl
        })
        
        response.expansion_count = 0
        useArticles.setState({ currentArticle: response })
        
        if (isDemoUser) {
          const today = new Date().toISOString()
          localStorage.setItem('demo_used', 'true')
          localStorage.setItem('demo_date', today)
        } else {
          incrementGeneration()
        }
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        navigate('/article/new')
      } else {
        await generateArticle(finalTopic, websiteUrl)
        
        if (isDemoUser) {
          const today = new Date().toISOString()
          localStorage.setItem('demo_used', 'true')
          localStorage.setItem('demo_date', today)
        }
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        navigate('/article/new')
      }
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }
