import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar,
  TrendingUp,
  Coffee,
  CheckCircle
} from 'lucide-react'

// Données simulées des pointages précédents
const previousTimeEntries = [
  {
    date: '2024-01-05',
    heureDebutJournee: '09:00',
    heureFinJournee: '17:30',
    pauses: [
      { debutPause: '12:00', finPause: '13:00' },
      { debutPause: '15:30', finPause: '15:45' }
    ],
    dureeTotaleTravail: 7.25,
    dureeTotalePause: 1.25
  },
  {
    date: '2024-01-04',
    heureDebutJournee: '08:45',
    heureFinJournee: '17:15',
    pauses: [
      { debutPause: '12:30', finPause: '13:30' }
    ],
    dureeTotaleTravail: 7.5,
    dureeTotalePause: 1
  },
  {
    date: '2024-01-03',
    heureDebutJournee: '09:15',
    heureFinJournee: '18:00',
    pauses: [
      { debutPause: '12:15', finPause: '13:15' },
      { debutPause: '16:00', finPause: '16:10' }
    ],
    dureeTotaleTravail: 7.5,
    dureeTotalePause: 1.17
  }
]

export default function EmployeeTimeTracking() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [workStatus, setWorkStatus] = useState('stopped') // 'working', 'break', 'stopped'
  const [workStartTime, setWorkStartTime] = useState(null)
  const [breakStartTime, setBreakStartTime] = useState(null)
  const [currentWorkTime, setCurrentWorkTime] = useState(0)
  const [currentBreakTime, setCurrentBreakTime] = useState(0)
  const [todayBreaks, setTodayBreaks] = useState([])
  const [todayStartTime, setTodayStartTime] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      
      // Mettre à jour les temps en cours
      if (workStatus === 'working' && workStartTime) {
        const elapsed = (new Date() - workStartTime) / (1000 * 60 * 60)
        setCurrentWorkTime(elapsed)
      }
      
      if (workStatus === 'break' && breakStartTime) {
        const elapsed = (new Date() - breakStartTime) / (1000 * 60 * 60)
        setCurrentBreakTime(elapsed)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [workStatus, workStartTime, breakStartTime])

  const startWork = () => {
    const now = new Date()
    setWorkStatus('working')
    setWorkStartTime(now)
    if (!todayStartTime) {
      setTodayStartTime(now)
    }
  }

  const startBreak = () => {
    if (workStartTime) {
      const workDuration = (new Date() - workStartTime) / (1000 * 60 * 60)
      setCurrentWorkTime(prev => prev + workDuration)
    }
    
    const now = new Date()
    setWorkStatus('break')
    setBreakStartTime(now)
  }

  const endBreak = () => {
    if (breakStartTime) {
      const breakDuration = (new Date() - breakStartTime) / (1000 * 60 * 60)
      const newBreak = {
        debutPause: breakStartTime.toTimeString().slice(0, 5),
        finPause: new Date().toTimeString().slice(0, 5),
        duration: breakDuration
      }
      setTodayBreaks(prev => [...prev, newBreak])
      setCurrentBreakTime(prev => prev + breakDuration)
    }
    
    setWorkStatus('working')
    setWorkStartTime(new Date())
  }

  const endWork = () => {
    if (workStartTime) {
      const workDuration = (new Date() - workStartTime) / (1000 * 60 * 60)
      setCurrentWorkTime(prev => prev + workDuration)
    }
    
    // Créer l'entrée de temps pour aujourd'hui
    const todayEntry = {
      date: new Date().toISOString().split('T')[0],
      heureDebutJournee: todayStartTime?.toTimeString().slice(0, 5) || '00:00',
      heureFinJournee: new Date().toTimeString().slice(0, 5),
      pauses: todayBreaks,
      dureeTotaleTravail: currentWorkTime,
      dureeTotalePause: currentBreakTime
    }
    
    // En production, cela serait envoyé à l'API
    console.log('Rapport de temps envoyé:', todayEntry)
    
    // Reset pour le jour suivant
    setWorkStatus('stopped')
    setWorkStartTime(null)
    setBreakStartTime(null)
    setCurrentWorkTime(0)
    setCurrentBreakTime(0)
    setTodayBreaks([])
    setTodayStartTime(null)
  }

  const formatTime = (hours) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    const s = Math.floor(((hours - h) * 60 - m) * 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const formatDuration = (hours) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800 border-green-200'
      case 'break': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'stopped': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'working': return <Play className="h-4 w-4" />
      case 'break': return <Pause className="h-4 w-4" />
      case 'stopped': return <Square className="h-4 w-4" />
      default: return <Square className="h-4 w-4" />
    }
  }

  const totalWorkTime = currentWorkTime
  const totalBreakTime = currentBreakTime
  const targetHours = 8
  const progressPercentage = Math.min((totalWorkTime / targetHours) * 100, 100)

  const weeklyStats = {
    totalHours: previousTimeEntries.reduce((sum, entry) => sum + entry.dureeTotaleTravail, 0) + totalWorkTime,
    avgHours: previousTimeEntries.length > 0 
      ? (previousTimeEntries.reduce((sum, entry) => sum + entry.dureeTotaleTravail, 0) + totalWorkTime) / (previousTimeEntries.length + (totalWorkTime > 0 ? 1 : 0))
      : totalWorkTime,
    daysWorked: previousTimeEntries.length + (totalWorkTime > 0 ? 1 : 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pointage</h1>
        <p className="text-gray-600 mt-2">Gérez votre temps de travail quotidien</p>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="h-6 w-6 mr-2" />
              Statut actuel
            </span>
            <Badge className={`${getStatusColor(workStatus)} text-sm px-3 py-1`}>
              {getStatusIcon(workStatus)}
              <span className="ml-2">{getStatusText(workStatus)}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {formatTime(totalWorkTime)}
              </div>
              <div className="text-sm text-gray-600">Temps travaillé</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {formatTime(totalBreakTime)}
              </div>
              <div className="text-sm text-gray-600">Temps de pause</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentTime.toLocaleTimeString('fr-FR')}
              </div>
              <div className="text-sm text-gray-600">Heure actuelle</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Progression du jour
          </CardTitle>
          <CardDescription>
            Objectif: {targetHours}h • Réalisé: {formatDuration(totalWorkTime)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0h</span>
              <span className="font-medium">{progressPercentage.toFixed(0)}% complété</span>
              <span>{targetHours}h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Contrôles de pointage</CardTitle>
          <CardDescription>Gérez votre temps de travail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {workStatus === 'stopped' && (
              <Button 
                onClick={startWork} 
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Début de journée
              </Button>
            )}
            
            {workStatus === 'working' && (
              <>
                <Button 
                  onClick={startBreak} 
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  size="lg"
                >
                  <Pause className="h-5 w-5 mr-2" />
                  Début de pause
                </Button>
                <Button 
                  onClick={endWork} 
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                  size="lg"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Fin de journée
                </Button>
              </>
            )}
            
            {workStatus === 'break' && (
              <>
                <Button 
                  onClick={endBreak} 
                  className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Fin de pause
                </Button>
                <Button 
                  onClick={endWork} 
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                  size="lg"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Fin de journée
                </Button>
              </>
            )}
          </div>
          
          {todayStartTime && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Début de journée:</strong> {todayStartTime.toLocaleTimeString('fr-FR')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Breaks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Coffee className="h-5 w-5 mr-2" />
              Pauses d'aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayBreaks.map((breakItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <Coffee className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-sm font-medium">
                      Pause {index + 1}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {breakItem.debutPause} - {breakItem.finPause}
                    <span className="ml-2 text-orange-600 font-medium">
                      ({formatDuration(breakItem.duration)})
                    </span>
                  </div>
                </div>
              ))}
              
              {workStatus === 'break' && breakStartTime && (
                <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center">
                    <Pause className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-sm font-medium">Pause en cours</span>
                  </div>
                  <div className="text-sm text-orange-600 font-medium">
                    Depuis {breakStartTime.toLocaleTimeString('fr-FR')}
                  </div>
                </div>
              )}
              
              {todayBreaks.length === 0 && workStatus !== 'break' && (
                <div className="text-center py-4 text-gray-500">
                  <Coffee className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucune pause prise aujourd'hui</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Statistiques hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Total heures</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {formatDuration(weeklyStats.totalHours)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Moyenne/jour</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatDuration(weeklyStats.avgHours)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium">Jours travaillés</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {weeklyStats.daysWorked}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previous Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des pointages</CardTitle>
          <CardDescription>Vos derniers pointages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {previousTimeEntries.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {new Date(entry.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.heureDebutJournee} - {entry.heureFinJournee}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-blue-600">
                    {formatDuration(entry.dureeTotaleTravail)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.pauses.length} pause(s) • {formatDuration(entry.dureeTotalePause)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

