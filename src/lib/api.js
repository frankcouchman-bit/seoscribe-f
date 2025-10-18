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
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      },
      mode: 'cors'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || error.message || 'Request failed')
    }

    return response.json()
  }

  // Auth methods
  async requestMagicLink(email) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ 
        email,
        redirect: window.location.origin + '/dashboard'
      })
    })
  }

  handleGoogleAuth() {
    window.location.href = `${this.baseURL}/auth/google?redirect=${encodeURIComponent(window.location.origin + '/dashboard')}`
  }

  async getProfile() {
    return this.request('/api/profile')
  }

  async checkDemoUsage() {
    return this.request('/api/demo-usage')
  }

  async generateArticle(data) {
    // CRITICAL: This returns { ...article, usage }
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

  async deleteArticle(id) {
    return this.request(`/api/articles/${id}`, {
      method: 'DELETE'
    })
  }
}

export const api = new APIClient()
