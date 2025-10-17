import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set) => ({
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
      set({ loading: false })
      return
    }

    try {
      const profile = await api.getProfile()
      set({ 
        user: profile.user,
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
      set({ user: null, loading: false })
    }
  },

  fetchProfile: async () => {
    try {
      const profile = await api.getProfile()
      set({ 
        user: profile.user,
        plan: profile.plan || 'free',
        usage: profile.usage || {
          today: { generations: 0, tools: {} },
          month: { generations: 0 }
        }
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  },

  signOut: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, plan: 'free', usage: { today: { generations: 0, tools: {} }, month: { generations: 0 } } })
    window.location.href = '/'
  }
}))
