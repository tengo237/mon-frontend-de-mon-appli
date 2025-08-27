import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '../../contexts/AuthContext'
import { CheckSquare, Clock, AlertCircle, MessageSquare, Calendar, User } from 'lucide-react'

// Données simulées des tâches assignées à l'employé connecté
const initialTasks = [
  {
    id: '1',
    titre: 'Développer la page d\'accueil',
    description: 'Créer une page d\'accueil moderne et responsive pour le site web de l\'entreprise. Utiliser React et TailwindCSS.',
    statut: 'en cours',
    dateCreation: '2024-01-05',
    dateEcheance: '2024-01-15',
    progression: 75,
    commentaires: [
      { 
        id: '1',
        userId: 'current_user', 
        texte: 'Travail en cours, 75% terminé. Le design est validé.', 
        date: '2024-01-08T14:30:00' 
      }
    ]
  },
  {
    id: '2',
    titre: 'Tests unitaires',
    description: 'Écrire les tests unitaires pour les modules principaux de l\'application',
    statut: 'non achevée',
    dateCreation: '2024-01-03',
    dateEcheance: '2024-01-08',
    progression: 30,
    commentaires: []
  },
  {
    id: '3',
    titre: 'Documentation API',
    description: 'Rédiger la documentation complète de l\'API REST',
    statut: 'terminée',
    dateCreation: '2024-01-01',
    dateEcheance: '2024-01-10',
    progression: 100,
    commentaires: [
      { 
        id: '2',
        userId: 'current_user', 
        texte: 'Documentation terminée et validée par l\'équipe.', 
        date: '2024-01-09T16:00:00' 
      }
    ]
  }
]

export default function EmployeeTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, statut: newStatus } : task
    ))
  }

  const addComment = (taskId, comment) => {
    const newCommentObj = {
      id: Date.now().toString(),
      userId: 'current_user',
      texte: comment,
      date: new Date().toISOString()
    }

    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, commentaires: [...task.commentaires, newCommentObj] }
        : task
    ))
  }

  const handleAddComment = () => {
    if (newComment.trim() && selectedTask) {
      addComment(selectedTask.id, newComment.trim())
      setNewComment('')
    }
  }

  const getFilteredTasks = () => {
    if (statusFilter === 'all') return tasks
    return tasks.filter(task => task.statut === statusFilter)
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

  const getPriorityColor = (dateEcheance, statut) => {
    if (statut === 'terminée') return 'border-green-200'
    
    const today = new Date()
    const deadline = new Date(dateEcheance)
    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    
    if (daysUntilDeadline < 0) return 'border-red-500 bg-red-50'
    if (daysUntilDeadline <= 2) return 'border-orange-500 bg-orange-50'
    if (daysUntilDeadline <= 5) return 'border-yellow-500 bg-yellow-50'
    return 'border-gray-200'
  }

  const filteredTasks = getFilteredTasks()
  const completedTasks = tasks.filter(task => task.statut === 'terminée').length
  const inProgressTasks = tasks.filter(task => task.statut === 'en cours').length
  const overdueTasks = tasks.filter(task => 
    new Date(task.dateEcheance) < new Date() && task.statut !== 'terminée'
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes tâches</h1>
          <p className="text-gray-600 mt-2">Gérez vos tâches assignées</p>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les tâches</SelectItem>
            <SelectItem value="en cours">En cours</SelectItem>
            <SelectItem value="terminée">Terminées</SelectItem>
            <SelectItem value="non achevée">En retard</SelectItem>
          </SelectContent>
        </Select>
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
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En retard</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <Card 
            key={task.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${getPriorityColor(task.dateEcheance, task.statut)}`}
            onClick={() => setSelectedTask(task)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{task.titre}</CardTitle>
                <Badge className={getStatusColor(task.statut)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(task.statut)}
                    <span className="text-xs">{task.statut}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {task.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Progression</span>
                  <span className="font-medium">{task.progression}%</span>
                </div>
                <Progress value={task.progression} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Échéance</span>
                  </div>
                  <span className={`font-medium ${
                    new Date(task.dateEcheance) < new Date() && task.statut !== 'terminée' 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {new Date(task.dateEcheance).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>Commentaires</span>
                  </div>
                  <span className="font-medium">{task.commentaires.length}</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Select
                  value={task.statut}
                  onValueChange={(value) => updateTaskStatus(task.id, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en cours">En cours</SelectItem>
                    <SelectItem value="terminée">Terminée</SelectItem>
                    <SelectItem value="non achevée">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche trouvée</h3>
            <p className="text-gray-500">
              {statusFilter === 'all' 
                ? 'Vous n\'avez aucune tâche assignée pour le moment.'
                : `Aucune tâche avec le statut "${statusFilter}".`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTask.titre}</span>
                <Badge className={getStatusColor(selectedTask.statut)}>
                  {selectedTask.statut}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Créée le {new Date(selectedTask.dateCreation).toLocaleDateString('fr-FR')} • 
                Échéance: {new Date(selectedTask.dateEcheance).toLocaleDateString('fr-FR')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedTask.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Progression</h4>
                <div className="flex items-center space-x-3">
                  <Progress value={selectedTask.progression} className="flex-1" />
                  <span className="text-sm font-medium">{selectedTask.progression}%</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Changer le statut</h4>
                <Select
                  value={selectedTask.statut}
                  onValueChange={(value) => {
                    updateTaskStatus(selectedTask.id, value)
                    setSelectedTask({...selectedTask, statut: value})
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en cours">En cours</SelectItem>
                    <SelectItem value="terminée">Terminée</SelectItem>
                    <SelectItem value="non achevée">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Commentaires ({selectedTask.commentaires.length})</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                  {selectedTask.commentaires.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">
                            {comment.userId === 'current_user' ? 'Vous' : 'Administrateur'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.date).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 ml-6">{comment.texte}</p>
                    </div>
                  ))}
                  
                  {selectedTask.commentaires.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucun commentaire pour cette tâche.
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ajouter un commentaire
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

