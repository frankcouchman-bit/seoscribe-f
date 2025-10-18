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
      const article = await api.generateArticle({ 
        topic: topic,
        keyword: topic,
        website_url: websiteUrl 
      })
      
      article.expansion_count = 0
      
      console.log('[ARTICLES] Article generated:', article)
      
      set({ currentArticle: article, generating: false })
      
      // Increment generation count for logged-in users
      const { incrementGeneration, user } = useAuth.getState()
      if (user) {
        incrementGeneration()
        console.log('[ARTICLES] Generation count incremented')
      }
      
      toast.success('✨ Article generated!')
      return article
    } catch (error) {
      set({ generating: false })
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
      if (article.expansion_count === undefined) {
        article.expansion_count = 0
      }
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
  },

  clearCurrentArticle: () => {
    set({ currentArticle: null })
  }
}))
