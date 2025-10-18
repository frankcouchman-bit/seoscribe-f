import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Article from './pages/Article'
import Pricing from './pages/Pricing'
import SEOTools from './pages/SEOTools'
import WritingTool from './pages/WritingTool'
import ArticlesList from './pages/ArticlesList'
import AuthCallback from './pages/AuthCallback'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { toast } from 'react-hot-toast'

function AuthHandler() {
  const { setAuth } = useAuth()

  useEffect(() => {
    const handleAuth = async () => {
      // Check for tokens in hash (OAuth redirect)
      const hash = window.location.hash
      if (hash && hash.includes('access_token=')) {
        console.log('[AUTH HANDLER] Tokens detected in hash')
        
        // Parse hash
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        
        if (accessToken) {
          console.log('[AUTH HANDLER] Processing authentication...')
          
          try {
            // Store tokens
            localStorage.setItem('authToken', accessToken)
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken)
            }
            
            // Set auth state
            await setAuth(accessToken, refreshToken)
            
            // Clear hash
            window.history.replaceState(null, '', window.location.pathname)
            
            // Show success and redirect
            toast.success('✅ Signed in successfully!')
            window.location.href = '/dashboard'
            
          } catch (error) {
            console.error('[AUTH HANDLER] Auth failed:', error)
            toast.error('Sign in failed. Please try again.')
          }
        }
      }
    }

    handleAuth()
  }, [setAuth])

  return null
}

export default function App() {
  const { checkAuth, loading } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1533] to-[#0a0e27]">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Router>
      <AuthHandler />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1533] to-[#0a0e27] text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/writing-tool" element={<WritingTool />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/articles" element={
            <ProtectedRoute>
              <ArticlesList />
            </ProtectedRoute>
          } />
          
          <Route path="/article/:id" element={
            <ProtectedRoute>
              <Article />
            </ProtectedRoute>
          } />
          
          <Route path="/article/new" element={
            <ProtectedRoute>
              <Article />
            </ProtectedRoute>
          } />
          
          <Route path="/seo-tools" element={
            <ProtectedRoute>
              <SEOTools />
            </ProtectedRoute>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }
          }}
        />
      </div>
    </Router>
  )
}
