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
      // Demo user - check IP usage
      try {
        const demoData = await api.checkDemoUsage()
        console.log('🔍 Demo usage check:', demoData)
        set({ 
          loading: false, 
          user: null,
          plan: 'free',
          usage: {
            today: { generations: 0 },
            month: { generations: 0 },
            demo: { 
              used: demoData.used || false, 
              canGenerate: demoData.canGenerate !== false
            }
          }
        })
      } catch (error) {
        console.error('Demo check failed:', error)
        set({ 
          loading: false, 
          user: null,
          usage: {
            today: { generations: 0 },
            month: { generations: 0 },
            demo: { used: false, canGenerate: true }
          }
        })
      }
      return
    }

    // Authenticated user
    try {
      const profile = await api.getProfile()
      console.log('👤 Profile loaded:', profile)
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
      // Refresh demo
      try {
        const demoData = await api.checkDemoUsage()
        console.log('🔄 Demo refreshed:', demoData)
        set(state => ({
          usage: {
            ...state.usage,
            demo: {
              used: demoData.used || false,
              canGenerate: demoData.canGenerate !== false
            }
          }
        }))
      } catch (error) {
        console.error('Demo refresh failed:', error)
      }
      return
    }

    // Refresh authenticated user
    try {
      const profile = await api.getProfile()
      console.log('🔄 Profile refreshed:', profile)
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
      // Demo users
      const can = usage?.demo?.canGenerate !== false && !usage?.demo?.used
      console.log('🎯 Can demo generate:', can, usage?.demo)
      return can
    }
    
    // Authenticated users
    const limit = plan === 'pro' ? 15 : 1
    const used = usage?.today?.generations || 0
    const can = used < limit
    console.log(`🎯 Can generate: ${can} (${used}/${limit})`)
    return can
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
