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
        console.log('[AUTH CALLBACK] Starting auth process')
        console.log('[AUTH CALLBACK] Full URL:', window.location.href)
        
        let token = null
        let refreshToken = null
        
        // Check URL hash first (most common for OAuth)
        const hash = window.location.hash.substring(1)
        if (hash) {
          console.log('[AUTH CALLBACK] Hash found:', hash)
          const hashParams = new URLSearchParams(hash)
          token = hashParams.get('access_token') || hashParams.get('token')
          refreshToken = hashParams.get('refresh_token')
        }
        
        // Check query params if no token in hash
        if (!token) {
          const searchParams = new URLSearchParams(window.location.search)
          token = searchParams.get('access_token') || searchParams.get('token')
          refreshToken = searchParams.get('refresh_token')
          console.log('[AUTH CALLBACK] Checked query params, token found:', !!token)
        }
        
        if (!token) {
          console.error('[AUTH CALLBACK] No token found in URL')
          throw new Error('No authentication token received. Please try signing in again.')
        }

        console.log('[AUTH CALLBACK] Token found, setting auth...')
        await setAuth(token, refreshToken)
        
        console.log('[AUTH CALLBACK] Auth successful, redirecting...')
        
        // Wait a moment for state to settle
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 500)
        
      } catch (err) {
        console.error('[AUTH CALLBACK] Error:', err)
        setError(err.message || 'Authentication failed')
      }
    }

    handleAuth()
  }, [setAuth, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
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
        <p className="text-white/60">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
