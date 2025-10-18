import { create } from 'zustand'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import { useAuth } from './useAuth'

export const useArticles = create((set, get) => ({
  articles: [],
  currentArticle: null,
  generating: false,
  loading: false,

  generateArticle: async (topic, websiteUrl) => {
    set({ generating: true })
    try {
      // Send BOTH topic and keyword to ensure backend compatibility
      const article = await api.generateArticle({ 
        topic: topic,           // Backend expects 'topic'
        keyword: topic,          // Also send as 'keyword' for compatibility
        website_url: websiteUrl 
      })
      
      set({ currentArticle: article, generating: false })
      
      // CRITICAL: Refresh usage immediately after generation
      const { refreshUsage } = useAuth.getState()
      await refreshUsage()
      
      toast.success('✨ Article generated!')
      return article
    } catch (error) {
      set({ generating: false })
      
      // Also refresh on error (in case quota was used)
      const { refreshUsage } = useAuth.getState()
      await refreshUsage()
      
      toast.error(error.message || 'Generation failed')
      throw error
    }
  },

  fetchArticles: async () => {
    set({ loading: true })
    try {
      const articles = await api.getArticles()
      set({ articles, loading: false })
    } catch (error) {
      console.error('Fetch articles failed:', error)
      set({ loading: false })
    }
  },

  loadArticle: async (id) => {
    try {
      const article = await api.getArticle(id)
      set({ currentArticle: article })
      return article
    } catch (error) {
      console.error('Load article failed:', error)
      throw error
    }
  },

  saveArticle: async (article) => {
    try {
      if (article.id) {
        await api.updateArticle(article.id, article)
        toast.success('Article updated!')
      } else {
        const saved = await api.saveArticle(article)
        set({ currentArticle: saved })
        toast.success('Article saved!')
      }
      get().fetchArticles()
    } catch (error) {
      toast.error(error.message || 'Save failed')
      throw error
    }
  },

  deleteArticle: async (id) => {
    try {
      await api.deleteArticle(id)
      set(state => ({
        articles: state.articles.filter(a => a.id !== id)
      }))
      toast.success('Article deleted')
    } catch (error) {
      toast.error(error.message || 'Delete failed')
      throw error
    }
  },

  setCurrentArticle: (article) => {
    set({ currentArticle: article })
  }
}))
