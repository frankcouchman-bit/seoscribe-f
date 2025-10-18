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
      get().initializeUsage()
      set({ user: null, plan: 'free', usage: get().getLocalUsage(), loading: false })
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
      get().initializeUsage()
      set({ user: null, plan: 'free', usage: get().getLocalUsage(), loading: false })
    }
  },

  initializeUsage: () => {
    const today = new Date().toISOString().split('T')[0]
    const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
    const storedDate = localStorage.getItem('usage_date')
    const storedMonth = localStorage.getItem('usage_month')
    
    // Reset daily if new day
    if (storedDate !== today) {
      console.log('[USAGE] New day detected, resetting daily quotas')
      localStorage.setItem('usage_date', today)
      localStorage.setItem('generations_today', '0')
      localStorage.setItem('tools_used_today', '0')
    }
    
    // Reset monthly if new month
    if (storedMonth !== currentMonth) {
      console.log('[USAGE] New month detected, resetting monthly count')
      localStorage.setItem('usage_month', currentMonth)
      localStorage.setItem('monthly_generations', '0')
    }
  },

  getLocalUsage: () => {
    const today = new Date().toISOString().split('T')[0]
    const currentMonth = new Date().toISOString().substring(0, 7)
    const storedDate = localStorage.getItem('usage_date')
    const storedMonth = localStorage.getItem('usage_month')
    
    // Auto-reset if different day
    if (storedDate !== today) {
      localStorage.setItem('usage_date', today)
      localStorage.setItem('generations_today', '0')
      localStorage.setItem('tools_used_today', '0')
    }
    
    // Auto-reset if different month
    if (storedMonth !== currentMonth) {
      localStorage.setItem('usage_month', currentMonth)
      localStorage.setItem('monthly_generations', '0')
    }
    
    const dailyGenerations = parseInt(localStorage.getItem('generations_today') || '0')
    const monthlyGenerations = parseInt(localStorage.getItem('monthly_generations') || '0')
    const toolsUsed = parseInt(localStorage.getItem('tools_used_today') || '0')
    
    return {
      today: {
        generations: dailyGenerations,
        tools: toolsUsed
      },
      thisMonth: {
        total: monthlyGenerations
      }
    }
  },

  incrementGeneration: () => {
    const currentDaily = parseInt(localStorage.getItem('generations_today') || '0')
    const currentMonthly = parseInt(localStorage.getItem('monthly_generations') || '0')
    
    const newDaily = currentDaily + 1
    const newMonthly = currentMonthly + 1
    
    localStorage.setItem('generations_today', String(newDaily))
    localStorage.setItem('monthly_generations', String(newMonthly))
    
    console.log('[USAGE] Incremented - Daily:', newDaily, 'Monthly:', newMonthly)
    
    // Force immediate update
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
        
        if (now - demoDateTime < thirtyDays) {
          console.log('[QUOTA] Demo locked for', Math.ceil((thirtyDays - (now - demoDateTime)) / (24 * 60 * 60 * 1000)), 'more days')
          return false
        } else {
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
    
    if (!user || plan === 'free') {
      return usage.today.tools < 1
    }

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
    localStorage.removeItem('usage_month')
    localStorage.removeItem('generations_today')
    localStorage.removeItem('tools_used_today')
    localStorage.removeItem('monthly_generations')
    set({ user: null, plan: 'free', usage: null })
    window.location.href = '/'
  }
}))
