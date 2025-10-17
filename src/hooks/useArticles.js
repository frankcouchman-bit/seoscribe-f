import { create } from 'zustand'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'

export const useArticles = create((set, get) => ({
  articles: [],
  currentArticle: null,
  loading: false,
  generating: false,

  fetchArticles: async () => {
    set({ loading: true })
    try {
      const articles = await api.getArticles()
      set({ articles, loading: false })
    } catch (error) {
      console.error('Failed to load articles:', error)
      set({ loading: false })
    }
  },

  generateArticle: async (topic, websiteUrl) => {
    set({ generating: true })
    try {
      const article = await api.generateArticle({
        topic,
        website_url: websiteUrl,
        tone: 'professional',
        generate_social: true,
        research: true
      })
      
      set({ currentArticle: article, generating: false })
      toast.success('✨ Article generated successfully!')
      
      // Refresh articles list
      get().fetchArticles()
      
      return article
    } catch (error) {
      set({ generating: false })
      
      // Check for quota errors
      if (error.message.includes('Quota exceeded') || error.message.includes('limit reached')) {
        toast.error('Daily limit reached! Upgrade to Pro for 15 articles/day.')
      } else if (error.message.includes('Sign in') || error.message.includes('Unauthorized')) {
        toast.error('Please sign in to generate articles')
      } else {
        toast.error(error.message || 'Generation failed')
      }
      
      throw error
    }
  },

  saveArticle: async (article) => {
    try {
      await api.saveArticle({
        title: article.title,
        data: article,
        word_count: article.word_count
      })
      toast.success('💾 Article saved!')
      get().fetchArticles()
    } catch (error) {
      toast.error('Failed to save')
      throw error
    }
  },

  deleteArticle: async (id) => {
    try {
      await api.deleteArticle(id)
      set(state => ({
        articles: state.articles.filter(a => a.id !== id)
      }))
      toast.success('🗑️ Deleted')
    } catch (error) {
      toast.error('Failed to delete')
    }
  },

  loadArticle: async (id) => {
    try {
      const article = await api.getArticle(id)
      set({ currentArticle: article })
      return article
    } catch (error) {
      toast.error('Failed to load article')
      throw error
    }
  }
}))
