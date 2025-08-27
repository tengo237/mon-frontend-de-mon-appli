import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '../../contexts/AuthContext'
import { Calendar, Clock, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

// Données simulées du planning de l'employé connecté
const mockScheduleData = [
  {
    date: '2024-01-08',
    heureDebut: '09:00',
    heureFin: '17:00',
    description: 'Journée complète - Développement',
    type: 'travail'
  },
  {
    date: '2024-01-09',
    heureDebut: '09:00',
    heureFin: '17:00',
    description: 'Journée complète - Développement',
    type: 'travail'
  },
  {
    date: '2024-01-10',
    heureDebut: '09:00',
    heureFin: '17:00',
    description: 'Journée complète - Développement',
    type: 'travail'
  },
  {
    date: '2024-01-11',
    heureDebut: '09:00',
    heureFin: '17:00',
    description: 'Journée complète - Développement',
    type: 'travail'
  },
  {
    date: '2024-01-12',
    heureDebut: '09:00',
    heureFin: '17:00',
    description: 'Journée complète - Développement',
    type: 'travail'
  },
  {
    date: '2024-01-15',
    heureDebut: '10:00',
    heureFin: '12:00',
    description: 'Formation - Sécurité informatique',
    type: 'formation'
  },
  {
    date: '2024-01-16',
    heureDebut: '14:00',
    heureFin: '16:00',
    description: 'Réunion équipe - Point mensuel',
    type: 'reunion'
  }
]

const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export default function EmployeeSchedule() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState('week') // 'week' ou 'month'
  const [currentDate, setCurrentDate] = useState(new Date())

  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Lundi comme premier jour
    return new Date(d.setDate(diff))
  }

  const getWeekDays = (startDate) => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getMonthDays = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = getWeekStart(firstDay)
    
    const days = []
    const current = new Date(startDate)
    
    while (current <= lastDay || days.length % 7 !== 0) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const getScheduleForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return mockScheduleData.filter(schedule => schedule.date === dateStr)
  }

  const calculateWeeklyHours = () => {
    const weekStart = getWeekStart(currentDate)
    const weekDays = getWeekDays(weekStart)
    
    let totalHours = 0
    weekDays.forEach(day => {
      const schedules = getScheduleForDate(day)
      schedules.forEach(schedule => {
        if (schedule.type === 'travail') {
          const start = new Date(`2000-01-01T${schedule.heureDebut}`)
          const end = new Date(`2000-01-01T${schedule.heureFin}`)
          const hours = (end - start) / (1000 * 60 * 60)
          totalHours += hours
        }
      })
    })
    
    return totalHours
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction * 7))
    setCurrentDate(newDate)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'travail': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'formation': return 'bg-green-100 text-green-800 border-green-200'
      case 'reunion': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'travail': return <Clock className="h-3 w-3" />
      case 'formation': return <CalendarDays className="h-3 w-3" />
      case 'reunion': return <Calendar className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const weeklyHours = calculateWeeklyHours()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon planning</h1>
          <p className="text-gray-600 mt-2">Consultez vos horaires de travail</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures cette semaine</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{weeklyHours}h</div>
            <p className="text-xs text-muted-foreground">
              Objectif: 40h
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jours travaillés</CardTitle>
            <CalendarDays className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getWeekDays(getWeekStart(currentDate)).filter(day => 
                getScheduleForDate(day).some(s => s.type === 'travail')
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {getWeekDays(getWeekStart(currentDate)).reduce((count, day) => 
                count + getScheduleForDate(day).filter(s => s.type !== 'travail').length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Formations, réunions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {viewMode === 'week' ? 'Vue semaine' : 'Vue mensuelle'}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[200px] text-center">
                {viewMode === 'week' 
                  ? `Semaine du ${getWeekStart(currentDate).toLocaleDateString('fr-FR')}`
                  : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                }
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => viewMode === 'week' ? navigateWeek(1) : navigateMonth(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'week' ? (
            // Vue semaine
            <div className="grid grid-cols-7 gap-4">
              {getWeekDays(getWeekStart(currentDate)).map((day, index) => {
                const schedules = getScheduleForDate(day)
                return (
                  <div key={index} className={`border rounded-lg p-3 min-h-[120px] ${
                    isToday(day) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}>
                    <div className="text-center mb-2">
                      <div className="text-xs text-gray-500">
                        {daysOfWeek[day.getDay()]}
                      </div>
                      <div className={`text-lg font-semibold ${
                        isToday(day) ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {day.getDate()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {schedules.map((schedule, scheduleIndex) => (
                        <div
                          key={scheduleIndex}
                          className={`text-xs p-2 rounded border ${getTypeColor(schedule.type)}`}
                        >
                          <div className="flex items-center mb-1">
                            {getTypeIcon(schedule.type)}
                            <span className="ml-1 font-medium">
                              {schedule.heureDebut} - {schedule.heureFin}
                            </span>
                          </div>
                          <div className="truncate" title={schedule.description}>
                            {schedule.description}
                          </div>
                        </div>
                      ))}
                      {schedules.length === 0 && (
                        <div className="text-xs text-gray-400 text-center py-2">
                          Pas d'horaire
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Vue mois
            <div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getMonthDays(currentDate).map((day, index) => {
                  const schedules = getScheduleForDate(day)
                  return (
                    <div
                      key={index}
                      className={`border rounded p-2 min-h-[80px] ${
                        isToday(day) ? 'bg-blue-50 border-blue-200' : 
                        isCurrentMonth(day) ? 'bg-white' : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(day) ? 'text-blue-600' : 
                        isCurrentMonth(day) ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {schedules.slice(0, 2).map((schedule, scheduleIndex) => (
                          <div
                            key={scheduleIndex}
                            className={`text-xs px-1 py-0.5 rounded ${getTypeColor(schedule.type)}`}
                          >
                            {schedule.heureDebut}
                          </div>
                        ))}
                        {schedules.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{schedules.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Details */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de la semaine</CardTitle>
          <CardDescription>
            Résumé de vos horaires pour la semaine du {getWeekStart(currentDate).toLocaleDateString('fr-FR')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getWeekDays(getWeekStart(currentDate)).map((day, index) => {
              const schedules = getScheduleForDate(day)
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isToday(day) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-sm font-medium">{day.getDate()}</span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {daysOfWeek[day.getDay()]} {day.getDate()} {monthNames[day.getMonth()]}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedules.length > 0 
                          ? `${schedules.length} événement(s)`
                          : 'Aucun horaire'
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {schedules.length > 0 ? (
                      <div className="space-y-1">
                        {schedules.map((schedule, scheduleIndex) => (
                          <div key={scheduleIndex} className="flex items-center space-x-2">
                            <Badge variant="outline" className={getTypeColor(schedule.type)}>
                              {schedule.heureDebut} - {schedule.heureFin}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {schedule.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Repos</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

