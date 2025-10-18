import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  useEffect(() => {
    const processAuth = async () => {
      // Get tokens from URL
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      // Handle error
      if (error) {
        console.error('Auth error:', error, errorDescription)
        toast.error('Sign in failed. Please try again.')
        navigate('/')
        return
      }

      // Handle success
      if (accessToken) {
        console.log('Access token received, setting auth...')
        
        // Store tokens
        localStorage.setItem('authToken', accessToken)
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }

        // Update auth state
        await setAuth(accessToken, refreshToken)
        
        toast.success('Signed in successfully!')
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          navigate('/dashboard')
        }, 100)
      } else {
        console.error('No access token in callback')
        toast.error('Authentication failed')
        navigate('/')
      }
    }

    processAuth()
  }, [searchParams, navigate, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Signing you in...</p>
      </div>
    </div>
  )
}
