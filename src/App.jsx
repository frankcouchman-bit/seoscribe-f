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
