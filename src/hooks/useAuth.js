import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set, get) => ({
  user: null,
  plan: 'free',
  usage: {
    today: { generations: 0 },
    month: { generations: 0 },
    demo: { used: false, canGenerate: true }
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
      // Demo user - check localStorage first
      const demoUsed = localStorage.getItem('demo_used') === 'true'
      
      set({ 
        loading: false, 
        user: null,
        plan: 'free',
        usage: {
          today: { generations: demoUsed ? 1 : 0 },
          month: { generations: 0 },
          demo: { 
            used: demoUsed, 
            canGenerate: !demoUsed
          }
        }
      })
      return
    }

    // Authenticated user
    try {
      const profile = await api.getProfile()
      set({ 
        user: profile.user || { email: profile.email },
        plan: profile.plan || 'free',
        usage: profile.usage || {
          today: { generations: 0 },
          month: { generations: 0 },
          demo: { used: false, canGenerate: true }
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

  refreshUsage: async () => {
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      // Demo user - check localStorage
      const demoUsed = localStorage.getItem('demo_used') === 'true'
      set(state => ({
        usage: {
          ...state.usage,
          demo: {
            used: demoUsed,
            canGenerate: !demoUsed
          }
        }
      }))
      return
    }

    // Authenticated user
    try {
      const profile = await api.getProfile()
      set({ 
        user: profile.user || { email: profile.email },
        plan: profile.plan || 'free',
        usage: profile.usage || {
          today: { generations: 0 },
          month: { generations: 0 },
          demo: { used: false, canGenerate: true }
        }
      })
    } catch (error) {
      console.error('Profile refresh failed:', error)
    }
  },

  canGenerate: () => {
    const { plan, usage, user } = get()
    
    if (!user) {
      // Demo: check localStorage
      const demoUsed = localStorage.getItem('demo_used') === 'true'
      return !demoUsed && !usage?.demo?.used
    }
    
    // Authenticated: check daily limit
    const limit = plan === 'pro' ? 15 : 1
    const used = usage?.today?.generations || 0
    return used < limit
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
      usage: { 
        today: { generations: 0 }, 
        month: { generations: 0 },
        demo: { used: false, canGenerate: true }
      } 
    })
    window.location.href = '/'
  }
}))
