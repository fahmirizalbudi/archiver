import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import type { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Root path redirects based on auth status */}
      <Route 
        path="/" 
        element={session ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/login" replace />} 
      />

      {/* Login route - redirect if already logged in */}
      <Route 
        path="/auth/login" 
        element={!session ? <Login /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Protected dashboard route */}
      <Route 
        path="/dashboard" 
        element={session ? <Dashboard /> : <Navigate to="/auth/login" replace />} 
      />

      {/* Catch-all route redirects to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
