import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set, get) => ({
  user: null,
  plan: 'free',
  usage: null,
  loading: true,

  setAuth: async (token, refreshToken) => {
    console.log('setAuth called with token:', token ? 'present' : 'missing')
    
    localStorage.setItem('authToken', token)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
    
    // Fetch user profile immediately
    try {
      const profile = await api.getProfile()
      console.log('Profile fetched:', profile)
      
      set({ 
        user: profile, 
        plan: profile.plan || 'free',
        usage: profile.usage,
        loading: false 
      })
      
      return profile
    } catch (error) {
      console.error('Failed to fetch profile after setAuth:', error)
      set({ loading: false })
      throw error
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('authToken')
    console.log('checkAuth called, token:', token ? 'present' : 'missing')
    
    if (!token) {
      set({ user: null, plan: 'free', loading: false })
      return
    }

    try {
      const profile = await api.getProfile()
      console.log('Profile loaded:', profile)
      
      set({ 
        user: profile, 
        plan: profile.plan || 'free',
        usage: profile.usage,
        loading: false 
      })
    } catch (error) {
      console.error('Auth check failed:', error)
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
      console.error('Usage refresh failed:', error)
    }
  },

  canGenerate: () => {
    const { user, usage } = get()
    
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
    const plan = get().plan
    if (plan === 'pro') {
      return (usage?.today?.generations || 0) < 15
    } else if (plan === 'enterprise') {
      return true // unlimited
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
