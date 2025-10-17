import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set, get) => ({
  user: null,
  plan: 'free',
  usage: {
    today: { generations: 0, tools: {} },
    month: { generations: 0 }
  },
  loading: true,

  setAuth: (token, refreshToken) => {
    if (token) {
      localStorage.setItem('authToken', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      set({ loading: false, user: null })
      return
    }

    try {
      const profile = await api.getProfile()
      set({ 
        user: profile.user || profile,
        plan: profile.plan || 'free',
        usage: profile.usage || {
          today: { generations: 0, tools: {} },
          month: { generations: 0 }
        },
        loading: false 
      })
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      set({ user: null, loading: false, plan: 'free' })
    }
  },

  fetchProfile: async () => {
    try {
      const profile = await api.getProfile()
      set({ 
        user: profile.user || profile,
        plan: profile.plan || 'free',
        usage: profile.usage || {
          today: { generations: 0, tools: {} },
          month: { generations: 0 }
        }
      })
      return profile
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  },

  refreshUsage: async () => {
    const profile = await get().fetchProfile()
    return profile
  },

  canGenerate: () => {
    const { plan, usage } = get()
    const limit = plan === 'pro' ? 15 : 1
    return (usage?.today?.generations || 0) < limit
  },

  canUseTool: (toolName) => {
    const { plan, usage } = get()
    const limit = plan === 'pro' ? 10 : 1
    const used = usage?.today?.tools?.[toolName] || 0
    return used < limit
  },

  signOut: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    set({ 
      user: null, 
      plan: 'free', 
      usage: { today: { generations: 0, tools: {} }, month: { generations: 0 } } 
    })
    window.location.href = '/'
  }
}))
