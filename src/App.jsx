import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

// Pages
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'

// Context pour l'authentification
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Composant de protection des routes
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'administrateur' ? '/admin' : '/employee'} replace />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="administrateur">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee/*" 
              element={
                <ProtectedRoute requiredRole="employe">
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

