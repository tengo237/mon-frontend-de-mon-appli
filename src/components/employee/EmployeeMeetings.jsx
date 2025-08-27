import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// Données simulées des réunions pour l'employé connecté
const mockMeetings = [
  {
    id: '1',
    titre: 'Réunion équipe développement',
    description: 'Point hebdomadaire sur l\'avancement des projets en cours',
    dateHeure: '2024-01-15T10:00:00',
    duree: 60,
    organisateur: 'Administrateur',
    participants: ['Jean Dupont', 'Marie Martin'],
    lienVisioconference: 'https://meet.planningpro.com/dev-team-weekly',
    statut: 'programmée',
    rappelEnvoye: true
  },
  {
    id: '2',
    titre: 'Formation sécurité informatique',
    description: 'Session de formation obligatoire sur les bonnes pratiques de sécurité',
    dateHeure: '2024-01-20T14:00:00',
    duree: 120,
    organisateur: 'Administrateur',
    participants: ['Jean Dupont', 'Marie Martin', 'Pierre Bernard'],
    lienVisioconference: 'https://meet.planningpro.com/security-training',
    statut: 'programmée',
    rappelEnvoye: false
  },
  {
    id: '3',
    titre: 'Réunion client - Projet Alpha',
    description: 'Présentation des maquettes et validation des spécifications',
    dateHeure: '2024-01-12T09:00:00',
    duree: 90,
    organisateur: 'Administrateur',
    participants: ['Jean Dupont', 'Marie Martin'],
    lienVisioconference: 'https://meet.planningpro.com/client-alpha',
    statut: 'terminée',
    rappelEnvoye: true
  }
]

const mockMessages = [
  {
    id: '1',
    meetingId: '1',
    sujet: 'Réunion équipe développement - Lundi 15 janvier',
    contenu: 'Bonjour, n\'oubliez pas la réunion d\'équipe prévue lundi 15 janvier à 10h00. Lien de visioconférence: https://meet.planningpro.com/dev-team-weekly',
    dateEnvoi: '2024-01-10T09:00:00',
    lu: false
  },
  {
    id: '2',
    meetingId: '2',
    sujet: 'Formation sécurité - 20 janvier',
    contenu: 'Formation obligatoire sur la sécurité informatique le 20 janvier à 14h00. Merci de confirmer votre présence.',
    dateEnvoi: '2024-01-08T16:00:00',
    lu: true
  }
]

export default function EmployeeMeetings() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('upcoming') // 'upcoming', 'past', 'messages'

  const joinMeeting = (meetingLink) => {
    window.open(meetingLink, '_blank')
  }

  const markMessageAsRead = (messageId) => {
    // En production, cela mettrait à jour l'état du message via l'API
    console.log('Message marqué comme lu:', messageId)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'programmée': return 'bg-blue-100 text-blue-800'
      case 'en cours': return 'bg-green-100 text-green-800'
      case 'terminée': return 'bg-gray-100 text-gray-800'
      case 'annulée': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTimeUntilMeeting = (dateTime) => {
    const now = new Date()
    const meetingTime = new Date(dateTime)
    const diffMs = meetingTime - now
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMs < 0) return 'Passée'
    if (diffMins < 60) return `Dans ${diffMins} min`
    if (diffHours < 24) return `Dans ${diffHours}h ${diffMins % 60}min`
    return `Dans ${diffDays} jour(s)`
  }

  const isUpcoming = (dateTime) => {
    return new Date(dateTime) > new Date()
  }

  const upcomingMeetings = mockMeetings.filter(meeting => isUpcoming(meeting.dateHeure))
  const pastMeetings = mockMeetings.filter(meeting => !isUpcoming(meeting.dateHeure))
  const unreadMessages = mockMessages.filter(msg => !msg.lu)

  const nextMeeting = upcomingMeetings
    .sort((a, b) => new Date(a.dateHeure) - new Date(b.dateHeure))[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes réunions</h1>
        <p className="text-gray-600 mt-2">Consultez vos réunions et participez aux visioconférences</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réunions à venir</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingMeetings.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages non lus</CardTitle>
            <Bell className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadMessages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total réunions</CardTitle>
            <Video className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockMeetings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Next Meeting Alert */}
      {nextMeeting && (
        <Alert className="border-blue-200 bg-blue-50">
          <Video className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Prochaine réunion:</strong> {nextMeeting.titre} • {' '}
                {new Date(nextMeeting.dateHeure).toLocaleString('fr-FR')} • {' '}
                <span className="text-blue-600 font-medium">
                  {getTimeUntilMeeting(nextMeeting.dateHeure)}
                </span>
              </div>
              <Button 
                size="sm" 
                onClick={() => joinMeeting(nextMeeting.lienVisioconference)}
                className="ml-4"
              >
                <Video className="h-4 w-4 mr-2" />
                Rejoindre
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-4">
            <Button
              variant={selectedTab === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setSelectedTab('upcoming')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              À venir ({upcomingMeetings.length})
            </Button>
            <Button
              variant={selectedTab === 'past' ? 'default' : 'outline'}
              onClick={() => setSelectedTab('past')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Passées ({pastMeetings.length})
            </Button>
            <Button
              variant={selectedTab === 'messages' ? 'default' : 'outline'}
              onClick={() => setSelectedTab('messages')}
              className="relative"
            >
              <Bell className="h-4 w-4 mr-2" />
              Messages ({mockMessages.length})
              {unreadMessages.length > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {unreadMessages.length}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{meeting.titre}</h3>
                        <Badge className={getStatusColor(meeting.statut)}>
                          {meeting.statut}
                        </Badge>
                        <Badge variant="outline" className="text-blue-600">
                          {getTimeUntilMeeting(meeting.dateHeure)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{meeting.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(meeting.dateHeure).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(meeting.dateHeure).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} ({meeting.duree} min)
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {meeting.participants.length} participant(s)
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <Button 
                        onClick={() => joinMeeting(meeting.lienVisioconference)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Rejoindre
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(meeting.lienVisioconference)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Copier le lien
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingMeetings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réunion à venir</h3>
                  <p className="text-gray-500">Vous n'avez aucune réunion programmée pour le moment.</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'past' && (
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <div key={meeting.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-700">{meeting.titre}</h3>
                        <Badge className={getStatusColor(meeting.statut)}>
                          {meeting.statut}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{meeting.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(meeting.dateHeure).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(meeting.dateHeure).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} ({meeting.duree} min)
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {meeting.participants.length} participant(s)
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Terminée
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {pastMeetings.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réunion passée</h3>
                  <p className="text-gray-500">L'historique de vos réunions apparaîtra ici.</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'messages' && (
            <div className="space-y-4">
              {mockMessages.map((message) => {
                const meeting = mockMeetings.find(m => m.id === message.meetingId)
                return (
                  <div 
                    key={message.id} 
                    className={`border rounded-lg p-4 ${!message.lu ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{message.sujet}</h3>
                          {!message.lu && (
                            <Badge variant="destructive" className="text-xs">
                              Non lu
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{message.contenu}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>
                            Reçu le {new Date(message.dateEnvoi).toLocaleString('fr-FR')}
                          </span>
                          {meeting && (
                            <span>
                              Réunion: {new Date(meeting.dateHeure).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        {meeting && isUpcoming(meeting.dateHeure) && (
                          <Button 
                            size="sm"
                            onClick={() => joinMeeting(meeting.lienVisioconference)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Rejoindre
                          </Button>
                        )}
                        {!message.lu && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markMessageAsRead(message.id)}
                          >
                            Marquer comme lu
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {mockMessages.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
                  <p className="text-gray-500">Vous n'avez reçu aucun message concernant les réunions.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

