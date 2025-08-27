import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  Video,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Données simulées pour les statistiques
const statsData = {
  totalEmployees: 24,
  activeEmployees: 22,
  totalTasks: 156,
  completedTasks: 134,
  totalHours: 1840,
  averageHours: 38.5,
  upcomingMeetings: 8,
  unreadMessages: 12
}

const weeklyHoursData = [
  { day: 'Lun', hours: 185 },
  { day: 'Mar', hours: 192 },
  { day: 'Mer', hours: 178 },
  { day: 'Jeu', hours: 195 },
  { day: 'Ven', hours: 188 },
  { day: 'Sam', hours: 45 },
  { day: 'Dim', hours: 12 }
]

const taskStatusData = [
  { name: 'Terminées', value: 134, color: '#10b981' },
  { name: 'En cours', value: 18, color: '#f59e0b' },
  { name: 'En retard', value: 4, color: '#ef4444' }
]

const recentActivities = [
  { id: 1, type: 'task', message: 'Nouvelle tâche assignée à Jean Dupont', time: '2 min' },
  { id: 2, type: 'meeting', message: 'Réunion équipe marketing programmée', time: '15 min' },
  { id: 3, type: 'employee', message: 'Marie Martin a terminé sa tâche', time: '1h' },
  { id: 4, type: 'message', message: '3 nouveaux messages reçus', time: '2h' }
]

export default function AdminOverview() {
  const completionRate = Math.round((statsData.completedTasks / statsData.totalTasks) * 100)
  const employeeActiveRate = Math.round((statsData.activeEmployees / statsData.totalEmployees) * 100)

  return (
    <div className="space-y-6 h-[600px] mb-0 ml-0 ">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre entreprise</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalEmployees}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{statsData.activeEmployees} actifs</span>
              <Badge variant="secondary" className="text-xs">
                {employeeActiveRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalTasks}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{statsData.completedTasks} terminées</span>
              <Badge variant="secondary" className="text-xs">
                {completionRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalHours}h</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Moy. {statsData.averageHours}h/semaine</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réunions</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.upcomingMeetings}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>À venir cette semaine</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Heures hebdomadaires</CardTitle>
            <CardDescription>Répartition des heures travaillées par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>État des tâches</CardTitle>
            <CardDescription>Répartition du statut des tâches</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières actions dans l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'task' && <CheckSquare className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'meeting' && <Video className="h-4 w-4 text-green-500" />}
                    {activity.type === 'employee' && <Users className="h-4 w-4 text-purple-500" />}
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes et notifications</CardTitle>
            <CardDescription>Points d'attention importants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">4 tâches en retard</p>
                  <p className="text-xs text-yellow-600">Nécessitent une attention immédiate</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">{statsData.unreadMessages} messages non lus</p>
                  <p className="text-xs text-blue-600">Dans la messagerie interne</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Productivité en hausse</p>
                  <p className="text-xs text-green-600">+12% par rapport au mois dernier</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

