import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log('[AUTH CALLBACK] Processing authentication...')
        
        // Get token from URL hash or query params
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash || window.location.search)
        
        const token = params.get('access_token') || params.get('token')
        const refreshToken = params.get('refresh_token')
        
        console.log('[AUTH CALLBACK] Token found:', !!token)
        
        if (!token) {
          console.error('[AUTH CALLBACK] No token found in URL')
          setError('No authentication token found')
          return
        }

        // Set auth with token
        await setAuth(token, refreshToken)
        
        console.log('[AUTH CALLBACK] Auth successful, redirecting to dashboard...')
        
        // Small delay to ensure state is set
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
        
      } catch (error) {
        console.error('[AUTH CALLBACK] Authentication failed:', error)
        setError(error.message || 'Authentication failed')
      }
    }

    handleAuth()
  }, [setAuth, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-2">Signing you in...</h2>
        <p className="text-white/60">Please wait while we complete your authentication</p>
      </div>
    </div>
  )
}
