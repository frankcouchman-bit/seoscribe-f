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
        redirect: window.location.origin
      })
    })
  }

  handleGoogleAuth() {
    window.location.href = `${this.baseURL}/auth/google?redirect=${encodeURIComponent(window.location.origin)}`
  }

  async getProfile() {
    return this.request('/api/profile')
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

  async analyzeCompetitors(keyword) {
    return this.request('/api/tools/competitor-analysis', {
      method: 'POST',
      body: JSON.stringify({ keyword })
    })
  }

  async clusterKeywords(topic, text) {
    return this.request('/api/tools/keywords', {
      method: 'POST',
      body: JSON.stringify({ topic, text })
    })
  }

  async generateBrief(keyword) {
    return this.request('/api/tools/content-brief', {
      method: 'POST',
      body: JSON.stringify({ keyword })
    })
  }

  async generateMeta(content) {
    return this.request('/api/tools/meta-description', {
      method: 'POST',
      body: JSON.stringify({ content })
    })
  }
}

export const api = new APIClient()
