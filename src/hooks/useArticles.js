import { create } from 'zustand'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import { useAuth } from './useAuth'

export const useArticles = create((set, get) => ({
  articles: [],
  currentArticle: null,
  loading: false,
  generating: false,

  setCurrentArticle: (article) => {
    set({ currentArticle: article })
  },

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
      const response = await api.generateArticle({
        topic,
        website_url: websiteUrl,
        tone: 'professional',
        target_word_count: 3000,
        generate_social: true,
        research: true
      })
      
      // CRITICAL: Extract usage from response and update auth state
      if (response.usage) {
        console.log('📊 Updating usage from response:', response.usage)
        useAuth.setState({ usage: response.usage })
      }
      
      set({ 
        currentArticle: response, 
        generating: false 
      })
      
      toast.success('✨ Article generated!')
      
      // Refresh articles list
      setTimeout(() => {
        get().fetchArticles()
      }, 500)
      
      return response
    } catch (error) {
      set({ generating: false })
      
      const message = error.message || 'Generation failed'
      
      if (message.includes('Quota exceeded') || 
          message.includes('limit reached') || 
          message.includes('Daily limit')) {
        toast.error('❌ Daily limit reached!', { duration: 5000 })
      } else if (message.includes('Demo limit')) {
        toast.error('❌ Demo used! Sign up for daily articles.', { duration: 5000 })
      } else {
        toast.error(message)
      }
      
      throw error
    }
  },

  saveArticle: async (article) => {
    try {
      const saved = await api.saveArticle({
        title: article.title,
        data: article,
        word_count: article.word_count,
        reading_time_minutes: article.reading_time_minutes
      })
      toast.success('💾 Article saved!')
      get().fetchArticles()
      return saved
    } catch (error) {
      toast.error('Failed to save: ' + error.message)
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
