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
      
      localStorage.setItem('authToken', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      const profile = await api.getProfile()
      console.log('[AUTH] Profile loaded:', profile.email, 'Plan:', profile.plan)
      
      localStorage.setItem('userPlan', profile.plan || 'free')
      localStorage.setItem('userEmail', profile.email)
      
      get().initializeUsage()
      
      set({ 
        user: profile, 
        plan: profile.plan || 'free',
        usage: get().getLocalUsage(),
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
      
      localStorage.setItem('userPlan', profile.plan || 'free')
      localStorage.setItem('userEmail', profile.email)
      
      get().initializeUsage()
      
      set({ 
        user: profile, 
        plan: profile.plan || 'free',
        usage: get().getLocalUsage(),
        loading: false 
      })
    } catch (error) {
      console.error('[AUTH] checkAuth failed:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userPlan')
      localStorage.removeItem('userEmail')
      set({ user: null, plan: 'free', loading: false })
    }
  },

  initializeUsage: () => {
    const today = new Date().toISOString().split('T')[0]
    const storedDate = localStorage.getItem('usage_date')
    
    if (storedDate !== today) {
      console.log('[USAGE] New day detected, resetting quotas')
      localStorage.setItem('usage_date', today)
      localStorage.setItem('generations_today', '0')
      localStorage.setItem('tools_used_today', '0')
    }
  },

  getLocalUsage: () => {
    const today = new Date().toISOString().split('T')[0]
    const storedDate = localStorage.getItem('usage_date')
    
    if (storedDate !== today) {
      localStorage.setItem('usage_date', today)
      localStorage.setItem('generations_today', '0')
      localStorage.setItem('tools_used_today', '0')
      return { today: { generations: 0, tools: 0 }, thisMonth: { total: 0 } }
    }
    
    const monthlyTotal = parseInt(localStorage.getItem('monthly_generations') || '0')
    
    return {
      today: {
        generations: parseInt(localStorage.getItem('generations_today') || '0'),
        tools: parseInt(localStorage.getItem('tools_used_today') || '0')
      },
      thisMonth: {
        total: monthlyTotal
      }
    }
  },

  incrementGeneration: () => {
    const current = parseInt(localStorage.getItem('generations_today') || '0')
    const monthly = parseInt(localStorage.getItem('monthly_generations') || '0')
    const newCount = current + 1
    localStorage.setItem('generations_today', String(newCount))
    localStorage.setItem('monthly_generations', String(monthly + 1))
    console.log('[USAGE] Generation count:', newCount)
    
    set({ usage: get().getLocalUsage() })
  },

  incrementToolUsage: () => {
    const current = parseInt(localStorage.getItem('tools_used_today') || '0')
    const newCount = current + 1
    localStorage.setItem('tools_used_today', String(newCount))
    console.log('[USAGE] Tool usage count:', newCount)
    
    set({ usage: get().getLocalUsage() })
  },

  refreshUsage: async () => {
    try {
      const profile = await api.getProfile()
      
      if (profile.plan && profile.plan !== get().plan) {
        console.log('[USAGE] Plan updated from', get().plan, 'to', profile.plan)
        localStorage.setItem('userPlan', profile.plan)
        set({ plan: profile.plan })
      }
      
      set({ usage: get().getLocalUsage() })
    } catch (error) {
      console.error('[USAGE] refreshUsage failed:', error)
      set({ usage: get().getLocalUsage() })
    }
  },

  canGenerate: () => {
    const { user, plan } = get()
    const usage = get().getLocalUsage()
    
    console.log('[QUOTA] Checking generation quota:', {
      user: !!user,
      plan: plan,
      currentGenerations: usage.today.generations
    })
    
    // Demo user check - 1 MONTH LOCKOUT
    if (!user) {
      const demoUsed = localStorage.getItem('demo_used') === 'true'
      const demoDate = localStorage.getItem('demo_date')
      
      if (demoUsed && demoDate) {
        const demoDateTime = new Date(demoDate).getTime()
        const now = new Date().getTime()
        const thirtyDays = 30 * 24 * 60 * 60 * 1000
        
        // If less than 30 days have passed, demo is still locked
        if (now - demoDateTime < thirtyDays) {
          console.log('[QUOTA] Demo locked for', Math.ceil((thirtyDays - (now - demoDateTime)) / (24 * 60 * 60 * 1000)), 'more days')
          return false
        } else {
          // 30 days passed, reset demo
          localStorage.removeItem('demo_used')
          localStorage.removeItem('demo_date')
          return true
        }
      }
      
      return !demoUsed
    }

    // Logged in user check
    if (plan === 'pro' || plan === 'enterprise') {
      return usage.today.generations < 15
    } else {
      return usage.today.generations < 1
    }
  },

  canUseTool: () => {
    const { user, plan } = get()
    const usage = get().getLocalUsage()
    
    console.log('[QUOTA] Checking tool quota:', {
      user: !!user,
      plan: plan,
      currentTools: usage.today.tools
    })
    
    // Demo/free user check
    if (!user || plan === 'free') {
      return usage.today.tools < 1
    }

    // Pro/Enterprise check
    if (plan === 'pro' || plan === 'enterprise') {
      return usage.today.tools < 10
    }
    
    return false
  },

  getDemoTimeRemaining: () => {
    const demoUsed = localStorage.getItem('demo_used') === 'true'
    const demoDate = localStorage.getItem('demo_date')
    
    if (!demoUsed || !demoDate) return null
    
    const demoDateTime = new Date(demoDate).getTime()
    const now = new Date().getTime()
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    const timeRemaining = thirtyDays - (now - demoDateTime)
    
    if (timeRemaining <= 0) return null
    
    const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60 * 1000))
    return daysRemaining
  },

  signOut: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userPlan')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('usage_date')
    localStorage.removeItem('generations_today')
    localStorage.removeItem('tools_used_today')
    set({ user: null, plan: 'free', usage: null })
    window.location.href = '/'
  }
}))
