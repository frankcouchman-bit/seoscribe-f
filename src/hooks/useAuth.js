import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set, get) => ({
  user: null,
  plan: 'free',
  usage: {
    today: { generations: 0, tools: {} },
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
      // Check demo usage for non-authenticated users
      try {
        const demoUsage = await api.checkDemoUsage()
        set({ 
          loading: false, 
          user: null,
          plan: 'free',
          usage: {
            today: { generations: 0, tools: {} },
            month: { generations: 0 },
            demo: { 
              used: demoUsage.used || false, 
              canGenerate: !demoUsage.used 
            }
          }
        })
      } catch (error) {
        set({ 
          loading: false, 
          user: null,
          usage: {
            today: { generations: 0, tools: {} },
            month: { generations: 0 },
            demo: { used: false, canGenerate: true }
          }
        })
      }
      return
    }

    try {
      const profile = await api.getProfile()
      set({ 
        user: profile.user || { email: profile.email },
        plan: profile.plan || 'free',
        usage: profile.usage || {
          today: { generations: 0, tools: {} },
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
      // Refresh demo usage
      try {
        const demoUsage = await api.checkDemoUsage()
        set(state => ({
          usage: {
            ...state.usage,
            demo: {
              used: demoUsage.used || false,
              canGenerate: !demoUsage.used
            }
          }
        }))
      } catch (error) {
        console.error('Failed to refresh demo usage:', error)
      }
      return
    }

    // Refresh authenticated user usage
    try {
      const profile = await api.getProfile()
      set({ 
        user: profile.user || { email: profile.email },
        plan: profile.plan || 'free',
        usage: profile.usage || {
          today: { generations: 0, tools: {} },
          month: { generations: 0 },
          demo: { used: false, canGenerate: true }
        }
      })
    } catch (error) {
      console.error('Failed to refresh usage:', error)
    }
  },

  canGenerate: () => {
    const { plan, usage, user } = get()
    
    if (!user) {
      // Demo users
      return usage?.demo?.canGenerate !== false
    }
    
    // Authenticated users
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
      usage: { 
        today: { generations: 0, tools: {} }, 
        month: { generations: 0 },
        demo: { used: false, canGenerate: true }
      } 
    })
    window.location.href = '/'
  }
}))
