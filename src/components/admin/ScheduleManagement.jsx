import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Calendar, Clock, Users } from 'lucide-react'

// Données simulées
const mockEmployees = [
  { id: '1', nom: 'Dupont', prenom: 'Jean' },
  { id: '2', nom: 'Martin', prenom: 'Marie' },
  { id: '3', nom: 'Bernard', prenom: 'Pierre' }
]

const initialSchedules = [
  {
    id: '1',
    type: 'hebdomadaire',
    periodeDebut: '2024-01-08',
    periodeFin: '2024-01-14',
    details: [
      {
        userId: '1',
        date: '2024-01-08',
        heureDebut: '09:00',
        heureFin: '17:00',
        description: 'Journée complète - Développement'
      },
      {
        userId: '1',
        date: '2024-01-09',
        heureDebut: '09:00',
        heureFin: '17:00',
        description: 'Journée complète - Développement'
      },
      {
        userId: '2',
        date: '2024-01-08',
        heureDebut: '10:00',
        heureFin: '18:00',
        description: 'Journée complète - Design'
      }
    ]
  },
  {
    id: '2',
    type: 'mensuel',
    periodeDebut: '2024-01-01',
    periodeFin: '2024-01-31',
    details: [
      {
        userId: '3',
        date: '2024-01-15',
        heureDebut: '08:00',
        heureFin: '16:00',
        description: 'Formation - Documentation'
      }
    ]
  }
]

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState(initialSchedules)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' ou 'calendar'
  const [formData, setFormData] = useState({
    type: 'hebdomadaire',
    periodeDebut: '',
    periodeFin: '',
    selectedEmployee: '',
    heureDebut: '09:00',
    heureFin: '17:00',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newSchedule = {
      id: Date.now().toString(),
      type: formData.type,
      periodeDebut: formData.periodeDebut,
      periodeFin: formData.periodeFin,
      details: []
    }
    
    // Générer les détails selon le type de planning
    if (formData.type === 'hebdomadaire') {
      const startDate = new Date(formData.periodeDebut)
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)
        
        if (formData.selectedEmployee) {
          newSchedule.details.push({
            userId: formData.selectedEmployee,
            date: currentDate.toISOString().split('T')[0],
            heureDebut: formData.heureDebut,
            heureFin: formData.heureFin,
            description: formData.description
          })
        }
      }
    } else {
      // Planning mensuel - ajouter une entrée spécifique
      if (formData.selectedEmployee) {
        newSchedule.details.push({
          userId: formData.selectedEmployee,
          date: formData.periodeDebut,
          heureDebut: formData.heureDebut,
          heureFin: formData.heureFin,
          description: formData.description
        })
      }
    }
    
    setSchedules([...schedules, newSchedule])
    setFormData({
      type: 'hebdomadaire',
      periodeDebut: '',
      periodeFin: '',
      selectedEmployee: '',
      heureDebut: '09:00',
      heureFin: '17:00',
      description: ''
    })
    setIsAddDialogOpen(false)
  }

  const deleteSchedule = (scheduleId) => {
    setSchedules(schedules.filter(schedule => schedule.id !== scheduleId))
  }

  const getEmployeeName = (employeeId) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId)
    return employee ? `${employee.prenom} ${employee.nom}` : 'Inconnu'
  }

  const calculateTotalHours = (schedule) => {
    return schedule.details.reduce((total, detail) => {
      const start = new Date(`2000-01-01T${detail.heureDebut}`)
      const end = new Date(`2000-01-01T${detail.heureFin}`)
      const hours = (end - start) / (1000 * 60 * 60)
      return total + hours
    }, 0)
  }

  const getWeekView = () => {
    const currentWeek = schedules.find(s => s.type === 'hebdomadaire')
    if (!currentWeek) return null

    const weekData = {}
    daysOfWeek.forEach(day => {
      weekData[day] = []
    })

    currentWeek.details.forEach(detail => {
      const date = new Date(detail.date)
      const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]
      if (weekData[dayName]) {
        weekData[dayName].push(detail)
      }
    })

    return weekData
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du planning</h1>
          <p className="text-gray-600 mt-2">Créez et gérez les plannings de votre équipe</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">Vue liste</SelectItem>
              <SelectItem value="calendar">Vue calendrier</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un planning
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau planning</DialogTitle>
                <DialogDescription>
                  Définissez les horaires de travail pour vos employés.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de planning</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                      <SelectItem value="mensuel">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodeDebut">Date de début</Label>
                    <Input
                      id="periodeDebut"
                      type="date"
                      value={formData.periodeDebut}
                      onChange={(e) => setFormData({...formData, periodeDebut: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodeFin">Date de fin</Label>
                    <Input
                      id="periodeFin"
                      type="date"
                      value={formData.periodeFin}
                      onChange={(e) => setFormData({...formData, periodeFin: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="selectedEmployee">Employé</Label>
                  <Select value={formData.selectedEmployee} onValueChange={(value) => setFormData({...formData, selectedEmployee: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.prenom} {employee.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heureDebut">Heure de début</Label>
                    <Input
                      id="heureDebut"
                      type="time"
                      value={formData.heureDebut}
                      onChange={(e) => setFormData({...formData, heureDebut: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureFin">Heure de fin</Label>
                    <Input
                      id="heureFin"
                      type="time"
                      value={formData.heureFin}
                      onChange={(e) => setFormData({...formData, heureFin: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Ex: Journée complète - Développement"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Créer le planning
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plannings actifs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures planifiées</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {schedules.reduce((total, schedule) => total + calculateTotalHours(schedule), 0)}h
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés planifiés</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(schedules.flatMap(s => s.details.map(d => d.userId))).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>Liste des plannings</CardTitle>
            <CardDescription>Gérez tous vos plannings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Employés</TableHead>
                  <TableHead>Heures totales</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <Badge variant={schedule.type === 'hebdomadaire' ? 'default' : 'secondary'}>
                        {schedule.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(schedule.periodeDebut).toLocaleDateString('fr-FR')} - {' '}
                      {new Date(schedule.periodeFin).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {[...new Set(schedule.details.map(d => d.userId))].map(userId => (
                          <Badge key={userId} variant="outline" className="text-xs">
                            {getEmployeeName(userId)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{calculateTotalHours(schedule)}h</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSchedule(schedule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSchedule(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Vue calendrier hebdomadaire</CardTitle>
            <CardDescription>Planning de la semaine en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {daysOfWeek.map((day) => {
                const weekData = getWeekView()
                const daySchedules = weekData ? weekData[day] || [] : []
                
                return (
                  <div key={day} className="border rounded-lg p-3">
                    <h3 className="font-medium text-sm mb-2">{day}</h3>
                    <div className="space-y-2">
                      {daySchedules.map((schedule, index) => (
                        <div key={index} className="bg-blue-50 p-2 rounded text-xs">
                          <div className="font-medium">{getEmployeeName(schedule.userId)}</div>
                          <div className="text-gray-600">
                            {schedule.heureDebut} - {schedule.heureFin}
                          </div>
                          <div className="text-gray-500 truncate">
                            {schedule.description}
                          </div>
                        </div>
                      ))}
                      {daySchedules.length === 0 && (
                        <div className="text-gray-400 text-xs">Aucun planning</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Details Dialog */}
      {selectedSchedule && (
        <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Détails du planning {selectedSchedule.type}</DialogTitle>
              <DialogDescription>
                Période : {new Date(selectedSchedule.periodeDebut).toLocaleDateString('fr-FR')} - {' '}
                {new Date(selectedSchedule.periodeFin).toLocaleDateString('fr-FR')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Horaires</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSchedule.details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{getEmployeeName(detail.userId)}</TableCell>
                        <TableCell>
                          {new Date(detail.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {detail.heureDebut} - {detail.heureFin}
                        </TableCell>
                        <TableCell>{detail.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-600">
                  Total : {calculateTotalHours(selectedSchedule)} heures
                </span>
                <Button onClick={() => setSelectedSchedule(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

