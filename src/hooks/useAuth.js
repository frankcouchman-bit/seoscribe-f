import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set, get) => ({
  user: null,
  plan: 'free',
  usage: null,
  loading: true,

  setAuth: async (token, refreshToken) => {
    try {
      console.log('[AUTH] Setting auth with token')
      
      // Store tokens
      localStorage.setItem('authToken', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      // Fetch profile
      const profile = await api.getProfile()
      console.log('[AUTH] Profile loaded:', profile.email)
      
      set({ 
        user: profile, 
        plan: profile.plan || 'free',
        usage: profile.usage,
        loading: false 
      })
      
      return profile
    } catch (error) {
      console.error('[AUTH] setAuth failed:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      set({ user: null, plan: 'free', loading: false })
      throw error
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      set({ user: null, plan: 'free', loading: false })
      return
    }

    try {
      const profile = await api.getProfile()
      set({ 
        user: profile, 
        plan: profile.plan || 'free',
        usage: profile.usage,
        loading: false 
      })
    } catch (error) {
      console.error('[AUTH] checkAuth failed:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      set({ user: null, plan: 'free', loading: false })
    }
  },

  refreshUsage: async () => {
    try {
      const profile = await api.getProfile()
      set({ usage: profile.usage })
    } catch (error) {
      console.error('[AUTH] refreshUsage failed:', error)
    }
  },

  canGenerate: () => {
    const { user, usage, plan } = get()
    
    // Demo user check
    if (!user) {
      const demoUsed = localStorage.getItem('demo_used') === 'true'
      const demoDate = localStorage.getItem('demo_date')
      const today = new Date().toISOString().split('T')[0]
      
      if (demoDate !== today) {
        localStorage.removeItem('demo_used')
        localStorage.removeItem('demo_date')
        return true
      }
      
      return !demoUsed
    }

    // Logged in user check
    if (plan === 'pro') {
      return (usage?.today?.generations || 0) < 15
    } else if (plan === 'enterprise') {
      return true
    } else {
      return (usage?.today?.generations || 0) < 1
    }
  },

  signOut: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, plan: 'free', usage: null })
    window.location.href = '/'
  }
}))
