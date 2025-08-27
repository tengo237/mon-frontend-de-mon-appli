import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '../../contexts/AuthContext'
import { 
  CheckSquare, 
  Clock, 
  Video, 
  Calendar,
  Play,
  Pause,
  Square,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

// Données simulées pour l'employé connecté
const mockTasks = [
  {
    id: '1',
    titre: 'Développer la page d\'accueil',
    description: 'Créer une page d\'accueil moderne et responsive',
    statut: 'en cours',
    dateEcheance: '2024-01-15',
    progression: 75
  },
  {
    id: '2',
    titre: 'Tests unitaires',
    description: 'Écrire les tests unitaires pour les modules principaux',
    statut: 'non achevée',
    dateEcheance: '2024-01-08',
    progression: 30
  }
]

const mockMeetings = [
  {
    id: '1',
    titre: 'Réunion équipe développement',
    dateHeure: '2024-01-15T10:00',
    lien: 'https://meet.example.com/dev-team-weekly'
  }
]

const mockMessages = [
  {
    id: '1',
    expediteur: 'Administrateur',
    sujet: 'Nouvelle tâche assignée',
    dateEnvoi: '2024-01-08T10:30:00',
    lu: false
  }
]

export default function EmployeeOverview() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [workStatus, setWorkStatus] = useState('stopped') // 'working', 'break', 'stopped'
  const [workStartTime, setWorkStartTime] = useState(null)
  const [breakStartTime, setBreakStartTime] = useState(null)
  const [totalWorkTime, setTotalWorkTime] = useState(0)
  const [totalBreakTime, setTotalBreakTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const startWork = () => {
    setWorkStatus('working')
    setWorkStartTime(new Date())
  }

  const startBreak = () => {
    if (workStartTime) {
      const workDuration = (new Date() - workStartTime) / (1000 * 60 * 60)
      setTotalWorkTime(prev => prev + workDuration)
    }
    setWorkStatus('break')
    setBreakStartTime(new Date())
  }

  const endBreak = () => {
    if (breakStartTime) {
      const breakDuration = (new Date() - breakStartTime) / (1000 * 60 * 60)
      setTotalBreakTime(prev => prev + breakDuration)
    }
    setWorkStatus('working')
    setWorkStartTime(new Date())
  }

  const endWork = () => {
    if (workStartTime) {
      const workDuration = (new Date() - workStartTime) / (1000 * 60 * 60)
      setTotalWorkTime(prev => prev + workDuration)
    }
    setWorkStatus('stopped')
    setWorkStartTime(null)
    setBreakStartTime(null)
  }

  const formatTime = (hours) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800'
      case 'break': return 'bg-orange-100 text-orange-800'
      case 'stopped': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'working': return 'En cours de travail'
      case 'break': return 'En pause'
      case 'stopped': return 'Arrêté'
      default: return 'Arrêté'
    }
  }

  const tasksToComplete = mockTasks.filter(task => task.statut !== 'terminée')
  const overdueTasks = mockTasks.filter(task => 
    new Date(task.dateEcheance) < new Date() && task.statut !== 'terminée'
  )
  const unreadMessages = mockMessages.filter(msg => !msg.lu)
  const nextMeeting = mockMeetings.find(meeting => new Date(meeting.dateHeure) > new Date())

  return (
    <div className="space-y-6  h-[600px] mb-0 ml-0 ">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour, {user?.prenom} ! 👋
        </h1>
        <p className="text-green-100">
          {currentTime.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • {currentTime.toLocaleTimeString('fr-FR')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Statut</p>
                <Badge className={getStatusColor(workStatus)}>
                  {getStatusText(workStatus)}
                </Badge>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps travaillé</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatTime(totalWorkTime)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tâches à faire</p>
                <p className="text-lg font-bold text-gray-900">{tasksToComplete.length}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-lg font-bold text-gray-900">
                  {unreadMessages.length}
                  {unreadMessages.length > 0 && (
                    <span className="text-sm text-red-600 ml-1">non lus</span>
                  )}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Tracking Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Pointage rapide
          </CardTitle>
          <CardDescription>Gérez votre temps de travail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {workStatus === 'stopped' && (
              <Button onClick={startWork} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Début de journée
              </Button>
            )}
            
            {workStatus === 'working' && (
              <>
                <Button onClick={startBreak} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Début de pause
                </Button>
                <Button onClick={endWork} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Fin de journée
                </Button>
              </>
            )}
            
            {workStatus === 'break' && (
              <>
                <Button onClick={endBreak} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Fin de pause
                </Button>
                <Button onClick={endWork} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Fin de journée
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Temps travaillé aujourd'hui:</span>
              <span className="font-medium ml-2">{formatTime(totalWorkTime)}</span>
            </div>
            <div>
              <span className="text-gray-600">Temps de pause:</span>
              <span className="font-medium ml-2">{formatTime(totalBreakTime)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2" />
                Mes tâches du jour
              </span>
              <Badge variant="secondary">{tasksToComplete.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasksToComplete.slice(0, 3).map((task) => (
                <div key={task.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{task.titre}</h3>
                    <Badge variant={task.statut === 'en cours' ? 'default' : 'destructive'} className="text-xs">
                      {task.statut}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Échéance: {new Date(task.dateEcheance).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Progress value={task.progression} className="w-16 h-2" />
                      <span className="text-xs text-gray-500">{task.progression}%</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {tasksToComplete.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucune tâche en cours</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meeting & Alerts */}
        <div className="space-y-6">
          {/* Next Meeting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Prochaine réunion
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextMeeting ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">{nextMeeting.titre}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(nextMeeting.dateHeure).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <Button size="sm" className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Rejoindre la réunion
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Video className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucune réunion prévue</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueTasks.length > 0 && (
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        {overdueTasks.length} tâche(s) en retard
                      </p>
                      <p className="text-xs text-red-600">
                        Vérifiez vos échéances
                      </p>
                    </div>
                  </div>
                )}
                
                {unreadMessages.length > 0 && (
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        {unreadMessages.length} nouveau(x) message(s)
                      </p>
                      <p className="text-xs text-blue-600">
                        Consultez votre messagerie
                      </p>
                    </div>
                  </div>
                )}
                
                {overdueTasks.length === 0 && unreadMessages.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucune alerte</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

