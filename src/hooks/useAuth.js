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
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    
    if (!token) {
      // Demo user - check 30 day expiry
      const demoUsed = localStorage.getItem('demo_used') === 'true'
      const demoDate = localStorage.getItem('demo_date')
      
      let isLocked = false
      if (demoUsed && demoDate) {
        const daysPassed = Math.floor((Date.now() - new Date(demoDate).getTime()) / 86400000)
        isLocked = daysPassed < 30 // Locked for 30 days
        
        // If 30+ days passed, clear the lock
        if (!isLocked) {
          localStorage.removeItem('demo_used')
          localStorage.removeItem('demo_date')
        }
      } else if (demoUsed) {
        isLocked = true
      }
      
      set({ 
        loading: false, 
        user: null,
        plan: 'free',
        usage: {
          today: { generations: 0 },
          month: { generations: 0 },
          demo: { 
            used: isLocked, 
            canGenerate: !isLocked
          }
        }
      })
      return
    }

    // Signed in user - check daily reset
    try {
      const profile = await api.getProfile()
      const lastDate = localStorage.getItem('last_generation_date')
      
      let usage = profile.usage || {
        today: { generations: 0 },
        month: { generations: 0 },
        demo: { used: false, canGenerate: true }
      }
      
      // Reset counter if new day
      if (lastDate && lastDate !== today) {
        usage = {
          ...usage,
          today: { generations: 0 }
        }
        localStorage.setItem('generation_count', '0')
      }
      
      // Use localStorage count if available (for immediate UI updates)
      const localCount = parseInt(localStorage.getItem('generation_count') || '0', 10)
      if (localCount > 0) {
        usage = {
          ...usage,
          today: { ...usage.today, generations: localCount }
        }
      }
      
      set({ 
        user: profile.user || { email: profile.email },
        plan: profile.plan || 'free',
        usage: usage,
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
    const today = new Date().toISOString().split('T')[0]
    
    if (!token) {
      // Demo user - check if 30 days passed
      const demoUsed = localStorage.getItem('demo_used') === 'true'
      const demoDate = localStorage.getItem('demo_date')
      
      let isLocked = false
      if (demoUsed && demoDate) {
        const daysPassed = Math.floor((Date.now() - new Date(demoDate).getTime()) / 86400000)
        isLocked = daysPassed < 30
        
        if (!isLocked) {
          localStorage.removeItem('demo_used')
          localStorage.removeItem('demo_date')
        }
      } else if (demoUsed) {
        isLocked = true
      }
      
      set(state => ({
        usage: {
          ...state.usage,
          demo: {
            used: isLocked,
            canGenerate: !isLocked
          }
        }
      }))
      return
    }

    // Signed in user
    try {
      const profile = await api.getProfile()
      const lastDate = localStorage.getItem('last_generation_date')
      
      let usage = profile.usage || {
        today: { generations: 0 },
        month: { generations: 0 },
        demo: { used: false, canGenerate: true }
      }
      
      // Reset if new day
      if (lastDate && lastDate !== today) {
        usage = {
          ...usage,
          today: { generations: 0 }
        }
        localStorage.setItem('generation_count', '0')
      }
      
      // Use localStorage count
      const localCount = parseInt(localStorage.getItem('generation_count') || '0', 10)
      if (localCount > 0) {
        usage = {
          ...usage,
          today: { ...usage.today, generations: localCount }
        }
      }
      
      set({ 
        user: profile.user || { email: profile.email },
        plan: profile.plan || 'free',
        usage: usage
      })
    } catch (error) {
      console.error('Profile refresh failed:', error)
    }
  },

  canGenerate: () => {
    const { plan, usage, user } = get()
    const today = new Date().toISOString().split('T')[0]
    
    if (!user) {
      // Demo user - check localStorage with date
      const demoUsed = localStorage.getItem('demo_used') === 'true'
      const demoDate = localStorage.getItem('demo_date')
      
      if (!demoUsed) return true
      
      if (demoDate) {
        const daysPassed = Math.floor((Date.now() - new Date(demoDate).getTime()) / 86400000)
        if (daysPassed >= 30) {
          // 30 days passed - reset
          localStorage.removeItem('demo_used')
          localStorage.removeItem('demo_date')
          return true
        }
      }
      
      return false
    }
    
    // Signed in user - check daily reset
    const lastDate = localStorage.getItem('last_generation_date')
    let count = usage?.today?.generations || 0
    
    // Reset if new day
    if (lastDate && lastDate !== today) {
      count = 0
      localStorage.setItem('generation_count', '0')
    } else {
      // Use localStorage count
      count = parseInt(localStorage.getItem('generation_count') || '0', 10)
    }
    
    const limit = plan === 'pro' ? 15 : 1
    return count < limit
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
    localStorage.removeItem('last_generation_date')
    localStorage.removeItem('generation_count')
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
