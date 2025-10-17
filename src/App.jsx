import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { useAuth } from './hooks/useAuth'

import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Tools from './pages/Tools'
import Article from './pages/Article'
import AIWriter from './pages/AIWriter'
import ArticleWriter from './pages/ArticleWriter'
import WritingTool from './pages/WritingTool'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Success from './pages/Success'
import Blog from './pages/Blog'
import NotFound from './pages/NotFound'

function AuthCallbackHandler() {
  const { setAuth } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hash = new URLSearchParams(window.location.hash.replace('#', ''))
    
    const accessToken = params.get('access_token') || hash.get('access_token')
    const refreshToken = params.get('refresh_token') || hash.get('refresh_token')

    if (accessToken) {
      setAuth(accessToken, refreshToken)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [location, setAuth])

  return null
}

function App() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthCallbackHandler />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/article/new" element={<Article />} />
            <Route path="/ai-writer" element={<AIWriter />} />
            <Route path="/article-writer" element={<ArticleWriter />} />
            <Route path="/writing-tool" element={<WritingTool />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/success" element={<Success />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
