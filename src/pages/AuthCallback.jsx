import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [debugInfo, setDebugInfo] = useState([])

  const addDebug = (msg) => {
    console.log('[AUTH CALLBACK]', msg)
    setDebugInfo(prev => [...prev, msg])
  }

  useEffect(() => {
    const processAuth = async () => {
      addDebug('Starting auth callback processing...')
      addDebug(`Full URL: ${window.location.href}`)
      addDebug(`Search params: ${window.location.search}`)
      addDebug(`Hash: ${window.location.hash}`)

      // Try to get tokens from URL query params
      let accessToken = searchParams.get('access_token')
      let refreshToken = searchParams.get('refresh_token')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      // Also check hash (some OAuth providers use hash instead of query)
      if (!accessToken && window.location.hash) {
        addDebug('Checking hash for tokens...')
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        accessToken = hashParams.get('access_token')
        refreshToken = hashParams.get('refresh_token')
      }

      addDebug(`Access token found: ${accessToken ? 'YES' : 'NO'}`)
      addDebug(`Refresh token found: ${refreshToken ? 'YES' : 'NO'}`)
      addDebug(`Error found: ${error ? error : 'NO'}`)

      // Handle error
      if (error) {
        addDebug(`Auth error: ${error} - ${errorDescription}`)
        toast.error(`Sign in failed: ${errorDescription || error}`)
        setTimeout(() => navigate('/'), 2000)
        return
      }

      // Handle success
      if (accessToken) {
        addDebug('Access token present, storing...')
        
        try {
          // Store tokens in localStorage first
          localStorage.setItem('authToken', accessToken)
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
          }
          addDebug('Tokens stored in localStorage')

          // Call setAuth to fetch profile
          addDebug('Calling setAuth...')
          await setAuth(accessToken, refreshToken)
          addDebug('setAuth completed successfully')
          
          toast.success('✅ Signed in successfully!')
          
          // Navigate to dashboard
          addDebug('Navigating to dashboard...')
          navigate('/dashboard', { replace: true })
          
        } catch (err) {
          addDebug(`Error during auth: ${err.message}`)
          console.error('Auth error:', err)
          toast.error('Failed to complete sign in')
          setTimeout(() => navigate('/'), 2000)
        }
      } else {
        addDebug('No access token found in URL')
        toast.error('No authentication token received')
        setTimeout(() => navigate('/'), 2000)
      }
    }

    processAuth()
  }, [searchParams, navigate, setAuth, location])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-white/80 mb-2">Signing you in...</p>
          <p className="text-sm text-white/50">Please wait while we complete authentication</p>
        </div>

        {/* DEBUG INFO - Remove this in production */}
        <div className="glass-strong rounded-xl p-4 max-h-96 overflow-auto">
          <h3 className="text-sm font-bold mb-2 text-purple-400">Debug Info:</h3>
          <div className="space-y-1 text-xs font-mono">
            {debugInfo.map((info, i) => (
              <div key={i} className="text-white/60">{info}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
