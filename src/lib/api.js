const API_URL = import.meta.env.VITE_API_URL || 'https://seoscribe.frank-couchman.workers.dev'

class APIClient {
  constructor() {
    this.baseURL = API_URL
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    console.log('API Request:', endpoint, options.method || 'GET')
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      },
      mode: 'cors'
    })

    console.log('API Response:', endpoint, response.status)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      console.error('API Error:', endpoint, error)
      throw new Error(error.error || error.message || 'Request failed')
    }

    return response.json()
  }

  // Auth
  async requestMagicLink(email) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        redirect: window.location.origin + '/auth/callback' 
      })
    })
  }

  handleGoogleAuth() {
    const redirectUrl = encodeURIComponent(window.location.origin + '/auth/callback')
    console.log('Redirecting to Google auth with callback:', redirectUrl)
    window.location.href = `${this.baseURL}/auth/google?redirect=${redirectUrl}`
  }

  async getProfile() {
    return this.request('/api/profile')
  }

  async updateProfile(data) {
    return this.request('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  // Stripe
  async createCheckoutSession(successUrl, cancelUrl) {
    return this.request('/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ successUrl, cancelUrl })
    })
  }

  async createPortalSession(returnUrl) {
    return this.request('/api/stripe/portal', {
      method: 'POST',
      body: JSON.stringify({ returnUrl })
    })
  }

  // Articles
  async generateArticle(data) {
    return this.request('/api/draft', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getArticles() {
    return this.request('/api/articles')
  }

  async getArticle(id) {
    return this.request(`/api/articles/${id}`)
  }

  async saveArticle(data) {
    return this.request('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateArticle(id, data) {
    return this.request(`/api/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  async deleteArticle(id) {
    return this.request(`/api/articles/${id}`, {
      method: 'DELETE'
    })
  }

  // Templates
  async getTemplates() {
    return this.request('/api/templates')
  }

  async generateFromTemplate(data) {
    return this.request('/api/templates/generate', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Expand
  async expandArticle(data) {
    return this.request('/api/expand', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

export const api = new APIClient()
