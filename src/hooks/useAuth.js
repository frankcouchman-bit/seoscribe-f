import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set, get) => ({
  user: null,
  plan: 'free',
  usage: { today: { generations: 0 }, month: { generations: 0 } },
  loading: false,

  setAuth: (token, refreshToken) => {
    localStorage.setItem('authToken', token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    get().fetchProfile()
  },

  clearAuth: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    set({ 
      user: null, 
      plan: 'free', 
      usage: { today: { generations: 0 }, month: { generations: 0 } } 
    })
  },

  fetchProfile: async () => {
    try {
      const data = await api.getProfile()
      set({
        user: { email: data.email },
        plan: data.plan || 'free',
        usage: data.usage || { today: { generations: 0 }, month: { generations: 0 } }
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      get().fetchProfile()
    }
  }
}))
