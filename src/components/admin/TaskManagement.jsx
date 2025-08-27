import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Edit, Trash2, Search, CheckSquare, Clock, AlertCircle, MessageSquare } from 'lucide-react'

// Données simulées
const mockEmployees = [
  { id: '1', nom: 'Dupont', prenom: 'Jean' },
  { id: '2', nom: 'Martin', prenom: 'Marie' },
  { id: '3', nom: 'Bernard', prenom: 'Pierre' }
]

const initialTasks = [
  {
    id: '1',
    titre: 'Développer la page d\'accueil',
    description: 'Créer une page d\'accueil moderne et responsive pour le site web',
    assigneA: ['1', '2'],
    statut: 'en cours',
    dateCreation: '2024-01-05',
    dateEcheance: '2024-01-15',
    commentaires: [
      { userId: '1', texte: 'Travail en cours, 50% terminé', date: '2024-01-08' },
      { userId: '2', texte: 'Design validé, passage au développement', date: '2024-01-07' }
    ]
  },
  {
    id: '2',
    titre: 'Rédiger la documentation API',
    description: 'Documenter toutes les endpoints de l\'API REST',
    assigneA: ['3'],
    statut: 'terminée',
    dateCreation: '2024-01-01',
    dateEcheance: '2024-01-10',
    commentaires: [
      { userId: '3', texte: 'Documentation complète et validée', date: '2024-01-09' }
    ]
  },
  {
    id: '3',
    titre: 'Tests unitaires',
    description: 'Écrire les tests unitaires pour les modules principaux',
    assigneA: ['1'],
    statut: 'non achevée',
    dateCreation: '2024-01-03',
    dateEcheance: '2024-01-08',
    commentaires: []
  }
]

export default function TaskManagement() {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    assigneA: [],
    dateEcheance: ''
  })

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newTask = {
      id: Date.now().toString(),
      ...formData,
      statut: 'en cours',
      dateCreation: new Date().toISOString().split('T')[0],
      commentaires: []
    }
    
    setTasks([...tasks, newTask])
    setFormData({
      titre: '',
      description: '',
      assigneA: [],
      dateEcheance: ''
    })
    setIsAddDialogOpen(false)
  }

  const handleAssigneeChange = (employeeId, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        assigneA: [...formData.assigneA, employeeId]
      })
    } else {
      setFormData({
        ...formData,
        assigneA: formData.assigneA.filter(id => id !== employeeId)
      })
    }
  }

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, statut: newStatus } : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const getEmployeeName = (employeeId) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId)
    return employee ? `${employee.prenom} ${employee.nom}` : 'Inconnu'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'terminée': return 'bg-green-100 text-green-800'
      case 'en cours': return 'bg-blue-100 text-blue-800'
      case 'non achevée': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'terminée': return <CheckSquare className="h-4 w-4" />
      case 'en cours': return <Clock className="h-4 w-4" />
      case 'non achevée': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des tâches</h1>
          <p className="text-gray-600 mt-2">Créez, assignez et suivez les tâches de votre équipe</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer une tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle tâche.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre de la tâche</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Assigner à</Label>
                <div className="space-y-2">
                  {mockEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`employee-${employee.id}`}
                        checked={formData.assigneA.includes(employee.id)}
                        onCheckedChange={(checked) => handleAssigneeChange(employee.id, checked)}
                      />
                      <Label htmlFor={`employee-${employee.id}`}>
                        {employee.prenom} {employee.nom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateEcheance">Date d'échéance</Label>
                <Input
                  id="dateEcheance"
                  type="date"
                  value={formData.dateEcheance}
                  onChange={(e) => setFormData({...formData, dateEcheance: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Créer la tâche
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total tâches</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(task => task.statut === 'terminée').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(task => task.statut === 'en cours').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En retard</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(task => task.statut === 'non achevée').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Liste des tâches</CardTitle>
              <CardDescription>Gérez et suivez l'avancement des tâches</CardDescription>
            </div>
            <div className="flex space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en cours">En cours</SelectItem>
                  <SelectItem value="terminée">Terminées</SelectItem>
                  <SelectItem value="non achevée">En retard</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une tâche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Assigné à</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Commentaires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.titre}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {task.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.assigneA.map(employeeId => (
                        <Badge key={employeeId} variant="secondary" className="text-xs">
                          {getEmployeeName(employeeId)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.statut)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(task.statut)}
                        <span>{task.statut}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(task.dateCreation).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <span className={new Date(task.dateEcheance) < new Date() && task.statut !== 'terminée' ? 'text-red-600 font-medium' : ''}>
                      {new Date(task.dateEcheance).toLocaleDateString('fr-FR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{task.commentaires.length}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Select
                        value={task.statut}
                        onValueChange={(value) => updateTaskStatus(task.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en cours">En cours</SelectItem>
                          <SelectItem value="terminée">Terminée</SelectItem>
                          <SelectItem value="non achevée">En retard</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTask(task)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
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

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedTask.titre}</DialogTitle>
              <DialogDescription>{selectedTask.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Assigné à</Label>
                  <div className="mt-1">
                    {selectedTask.assigneA.map(employeeId => (
                      <Badge key={employeeId} variant="secondary" className="mr-1">
                        {getEmployeeName(employeeId)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Statut</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedTask.statut)}>
                      {selectedTask.statut}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Commentaires ({selectedTask.commentaires.length})</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {selectedTask.commentaires.length > 0 ? (
                    selectedTask.commentaires.map((comment, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">
                            {getEmployeeName(comment.userId)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.texte}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Aucun commentaire pour cette tâche.</p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

