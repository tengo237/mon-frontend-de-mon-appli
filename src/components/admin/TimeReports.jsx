import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Clock, TrendingUp, Users, Calendar, Download, Filter } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

// Données simulées
const mockEmployees = [
  { id: '1', nom: 'Dupont', prenom: 'Jean' },
  { id: '2', nom: 'Martin', prenom: 'Marie' },
  { id: '3', nom: 'Bernard', prenom: 'Pierre' }
]

const timeReports = [
  {
    id: '1',
    userId: '1',
    date: '2024-01-08',
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
    id: '2',
    userId: '2',
    date: '2024-01-08',
    heureDebutJournee: '08:30',
    heureFinJournee: '17:00',
    pauses: [
      { debutPause: '12:30', finPause: '13:30' }
    ],
    dureeTotaleTravail: 7.5,
    dureeTotalePause: 1
  },
  {
    id: '3',
    userId: '1',
    date: '2024-01-09',
    heureDebutJournee: '09:15',
    heureFinJournee: '18:00',
    pauses: [
      { debutPause: '12:15', finPause: '13:15' },
      { debutPause: '16:00', finPause: '16:10' }
    ],
    dureeTotaleTravail: 7.5,
    dureeTotalePause: 1.17
  },
  {
    id: '4',
    userId: '3',
    date: '2024-01-08',
    heureDebutJournee: '10:00',
    heureFinJournee: '18:30',
    pauses: [
      { debutPause: '13:00', finPause: '14:00' }
    ],
    dureeTotaleTravail: 7.5,
    dureeTotalePause: 1
  }
]

// Données pour les graphiques
const weeklyData = [
  { day: 'Lun', hours: 22.25, target: 24 },
  { day: 'Mar', hours: 23.5, target: 24 },
  { day: 'Mer', hours: 21.75, target: 24 },
  { day: 'Jeu', hours: 24, target: 24 },
  { day: 'Ven', hours: 22.5, target: 24 },
  { day: 'Sam', hours: 8, target: 8 },
  { day: 'Dim', hours: 0, target: 0 }
]

const monthlyTrend = [
  { week: 'S1', hours: 156 },
  { week: 'S2', hours: 162 },
  { week: 'S3', hours: 148 },
  { week: 'S4', hours: 171 }
]

export default function TimeReports() {
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const getEmployeeName = (employeeId) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId)
    return employee ? `${employee.prenom} ${employee.nom}` : 'Inconnu'
  }

  const getFilteredReports = () => {
    if (selectedEmployee === 'all') {
      return timeReports
    }
    return timeReports.filter(report => report.userId === selectedEmployee)
  }

  const calculateStats = () => {
    const reports = getFilteredReports()
    const totalHours = reports.reduce((sum, report) => sum + report.dureeTotaleTravail, 0)
    const totalBreakHours = reports.reduce((sum, report) => sum + report.dureeTotalePause, 0)
    const avgHoursPerDay = reports.length > 0 ? totalHours / reports.length : 0
    const uniqueEmployees = new Set(reports.map(r => r.userId)).size

    return {
      totalHours: totalHours.toFixed(1),
      totalBreakHours: totalBreakHours.toFixed(1),
      avgHoursPerDay: avgHoursPerDay.toFixed(1),
      uniqueEmployees,
      totalDays: reports.length
    }
  }

  const stats = calculateStats()

  const exportReports = () => {
    // Simulation d'export - en production, cela générerait un fichier CSV/Excel
    const csvContent = [
      'Employé,Date,Début,Fin,Heures travaillées,Heures de pause',
      ...getFilteredReports().map(report => 
        `${getEmployeeName(report.userId)},${report.date},${report.heureDebutJournee},${report.heureFinJournee},${report.dureeTotaleTravail},${report.dureeTotalePause}`
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rapport-temps.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports de temps</h1>
          <p className="text-gray-600 mt-2">Analysez les heures de travail de votre équipe</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {mockEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.prenom} {employee.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReports}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures totales</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              Sur {stats.totalDays} jours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne/jour</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.avgHoursPerDay}h</div>
            <p className="text-xs text-muted-foreground">
              Par employé
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pauses totales</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalBreakHours}h</div>
            <p className="text-xs text-muted-foreground">
              Temps de pause
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés actifs</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.uniqueEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Cette période
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Heures hebdomadaires</CardTitle>
            <CardDescription>Heures travaillées vs objectifs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" name="Heures réelles" />
                <Bar dataKey="target" fill="#e5e7eb" name="Objectif" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendance mensuelle</CardTitle>
            <CardDescription>Évolution des heures par semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par employé</CardTitle>
          <CardDescription>Résumé des heures travaillées par employé</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEmployees.map((employee) => {
              const employeeReports = timeReports.filter(r => r.userId === employee.id)
              const totalHours = employeeReports.reduce((sum, r) => sum + r.dureeTotaleTravail, 0)
              const avgHours = employeeReports.length > 0 ? totalHours / employeeReports.length : 0
              const targetHours = employeeReports.length * 8 // 8h par jour
              const performance = targetHours > 0 ? (totalHours / targetHours) * 100 : 0

              return (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {employee.prenom[0]}{employee.nom[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{employee.prenom} {employee.nom}</h3>
                      <p className="text-sm text-gray-500">
                        {totalHours.toFixed(1)}h total • {avgHours.toFixed(1)}h/jour
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32">
                      <Progress value={Math.min(performance, 100)} className="h-2" />
                    </div>
                    <Badge variant={performance >= 90 ? 'default' : performance >= 75 ? 'secondary' : 'destructive'}>
                      {performance.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports détaillés</CardTitle>
          <CardDescription>Pointages quotidiens des employés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Pauses</TableHead>
                <TableHead>Heures travaillées</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredReports().map((report) => {
                const performance = (report.dureeTotaleTravail / 8) * 100
                return (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {getEmployeeName(report.userId)}
                    </TableCell>
                    <TableCell>
                      {new Date(report.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{report.heureDebutJournee}</TableCell>
                    <TableCell>{report.heureFinJournee}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {report.pauses.map((pause, index) => (
                          <div key={index}>
                            {pause.debutPause} - {pause.finPause}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{report.dureeTotaleTravail}h</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={performance >= 90 ? 'default' : performance >= 75 ? 'secondary' : 'destructive'}>
                        {performance.toFixed(0)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

