import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '../contexts/AuthContext'
import { Building2, Users, Calendar, Video } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user } = useAuth()

  // Redirection si déjà connecté
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'administrateur' ? '/admin' : '/employee'} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, motDePasse)
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header avec logo et titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PlanningPro</h1>
          <p className="text-gray-600">Gestion du Planning et Visioconférence</p>
        </div>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
              <Users className="h-6 w-6 text-blue-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-600">Gestion Employés</p>
          </div>
          <div className="text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
              <Calendar className="h-6 w-6 text-green-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-600">Planning</p>
          </div>
          <div className="text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
              <Video className="h-6 w-6 text-purple-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-600">Visioconférence</p>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder à l'application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            {/* Comptes de démonstration */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3">Comptes de démonstration :</p>
              <div className="space-y-2 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>Administrateur :</strong><br />
                  admin@planningpro.com / admin123
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <strong>Employé :</strong><br />
                  employe@planningpro.com / employe123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

