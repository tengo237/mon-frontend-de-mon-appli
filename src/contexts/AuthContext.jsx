import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Simulation de données utilisateurs (en production, cela viendrait d'une API)
  const mockUsers = [
    {
      id: '1',
      email: 'admin@planningpro.com',
      motDePasse: 'admin123',
      nom: 'Administrateur',
      prenom: 'Principal',
      role: 'administrateur',
      statut: 'actif'
    },
    {
      id: '2',
      email: 'employe@planningpro.com',
      motDePasse: 'employe123',
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'employe',
      statut: 'actif'
    }
  ]

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('planningpro_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (email, motDePasse) => {
    try {
      // Simulation d'une authentification
      const foundUser = mockUsers.find(u => u.email === email && u.motDePasse === motDePasse)
      
      if (foundUser && foundUser.statut === 'actif') {
        const userWithoutPassword = { ...foundUser }
        delete userWithoutPassword.motDePasse
        
        setUser(userWithoutPassword)
        setIsAuthenticated(true)
        localStorage.setItem('planningpro_user', JSON.stringify(userWithoutPassword))
        return { success: true }
      } else {
        return { success: false, error: 'Identifiants invalides ou compte inactif' }
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('planningpro_user')
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

