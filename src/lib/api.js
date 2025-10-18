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

  async updateProfile(data) {
    return this.request('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  async checkDemoUsage() {
    return this.request('/api/demo-usage')
  }

  async createCheckoutSession(successUrl, cancelUrl) {
    return this.request('/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ 
        successUrl: successUrl || `${window.location.origin}/success`,
        cancelUrl: cancelUrl || window.location.origin
      })
    })
  }

  async createPortalSession(returnUrl) {
    return this.request('/api/stripe/portal', {
      method: 'POST',
      body: JSON.stringify({ 
        returnUrl: returnUrl || window.location.origin
      })
    })
  }

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

  async analyzeHeadline(headline) {
    return this.request('/api/tools/headline-analyzer', {
      method: 'POST',
      body: JSON.stringify({ headline })
    })
  }

  async checkReadability(text) {
    return this.request('/api/tools/readability', {
      method: 'POST',
      body: JSON.stringify({ text })
    })
  }

  async generateSERPPreview(data) {
    return this.request('/api/tools/serp-preview', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async checkPlagiarism(text) {
    return this.request('/api/tools/plagiarism', {
      method: 'POST',
      body: JSON.stringify({ text })
    })
  }

  async analyzeCompetitors(keyword, region) {
    return this.request('/api/tools/competitor-analysis', {
      method: 'POST',
      body: JSON.stringify({ keyword, region })
    })
  }

  async clusterKeywords(topic, text) {
    return this.request('/api/tools/keywords', {
      method: 'POST',
      body: JSON.stringify({ topic, text })
    })
  }

  async generateBrief(keyword, region) {
    return this.request('/api/tools/content-brief', {
      method: 'POST',
      body: JSON.stringify({ keyword, region })
    })
  }

  async generateMeta(content) {
    return this.request('/api/tools/meta-description', {
      method: 'POST',
      body: JSON.stringify({ content })
    })
  }

  async getAIAssistance(prompt, context, keyword) {
    return this.request('/api/ai-assistant', {
      method: 'POST',
      body: JSON.stringify({ prompt, context, keyword })
    })
  }
}

export const api = new APIClient()
