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
      
      // Store plan in localStorage for immediate access
      localStorage.setItem('userPlan', profile.plan || 'free')
      localStorage.setItem('userEmail', profile.email)
      
      // Initialize usage tracking
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
      
      // Store plan in localStorage
      localStorage.setItem('userPlan', profile.plan || 'free')
      localStorage.setItem('userEmail', profile.email)
      
      // Initialize usage tracking
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

  // Initialize usage tracking in localStorage
  initializeUsage: () => {
    const today = new Date().toISOString().split('T')[0]
    const storedDate = localStorage.getItem('usage_date')
    
    // Reset if new day
    if (storedDate !== today) {
      console.log('[USAGE] New day detected, resetting quotas')
      localStorage.setItem('usage_date', today)
      localStorage.setItem('generations_today', '0')
      localStorage.setItem('tools_used_today', '0')
      localStorage.removeItem('demo_used')
      localStorage.removeItem('demo_date')
    }
  },

  // Get usage from localStorage
  getLocalUsage: () => {
    const today = new Date().toISOString().split('T')[0]
    const storedDate = localStorage.getItem('usage_date')
    
    // Reset if different day
    if (storedDate !== today) {
      localStorage.setItem('usage_date', today)
      localStorage.setItem('generations_today', '0')
      localStorage.setItem('tools_used_today', '0')
      return { today: { generations: 0, tools: 0 } }
    }
    
    return {
      today: {
        generations: parseInt(localStorage.getItem('generations_today') || '0'),
        tools: parseInt(localStorage.getItem('tools_used_today') || '0')
      }
    }
  },

  // Increment generation count
  incrementGeneration: () => {
    const current = parseInt(localStorage.getItem('generations_today') || '0')
    const newCount = current + 1
    localStorage.setItem('generations_today', String(newCount))
    console.log('[USAGE] Generation count:', newCount)
    
    set({ usage: get().getLocalUsage() })
  },

  // Increment tool usage count
  incrementToolUsage: () => {
    const current = parseInt(localStorage.getItem('tools_used_today') || '0')
    const newCount = current + 1
    localStorage.setItem('tools_used_today', String(newCount))
    console.log('[USAGE] Tool usage count:', newCount)
    
    set({ usage: get().getLocalUsage() })
  },

  refreshUsage: async () => {
    try {
      // Try to get profile from backend
      const profile = await api.getProfile()
      
      // Update plan if changed (e.g., after Stripe upgrade)
      if (profile.plan && profile.plan !== get().plan) {
        console.log('[USAGE] Plan updated from', get().plan, 'to', profile.plan)
        localStorage.setItem('userPlan', profile.plan)
        set({ plan: profile.plan })
      }
      
      // Always use localStorage for usage tracking
      set({ usage: get().getLocalUsage() })
    } catch (error) {
      console.error('[USAGE] refreshUsage failed:', error)
      // Still update from localStorage
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
