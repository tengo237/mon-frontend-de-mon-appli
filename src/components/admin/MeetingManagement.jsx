import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Video, Send, Copy, Eye, Trash2, Calendar, Users, Link as LinkIcon } from 'lucide-react'

// Données simulées
const mockEmployees = [
  { id: '1', nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@entreprise.com' },
  { id: '2', nom: 'Martin', prenom: 'Marie', email: 'marie.martin@entreprise.com' },
  { id: '3', nom: 'Bernard', prenom: 'Pierre', email: 'pierre.bernard@entreprise.com' }
]

const initialMeetings = [
  {
    id: '1',
    titre: 'Réunion équipe développement',
    description: 'Point hebdomadaire sur l\'avancement des projets',
    dateHeure: '2024-01-15T10:00',
    participants: ['1', '2'],
    organisateurId: 'admin',
    lienVisioconference: 'https://meet.example.com/dev-team-weekly',
    statut: 'programmée',
    historiqueMessages: [
      {
        id: '1',
        contenu: 'Réunion programmée pour lundi 15 janvier à 10h00',
        dateEnvoi: '2024-01-10T14:30',
        envoye: true
      }
    ]
  },
  {
    id: '2',
    titre: 'Formation sécurité',
    description: 'Session de formation obligatoire sur la sécurité informatique',
    dateHeure: '2024-01-20T14:00',
    participants: ['1', '2', '3'],
    organisateurId: 'admin',
    lienVisioconference: 'https://meet.example.com/security-training',
    statut: 'programmée',
    historiqueMessages: []
  }
]

export default function MeetingManagement() {
  const [meetings, setMeetings] = useState(initialMeetings)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateHeure: '',
    participants: []
  })
  const [linkGenerated, setLinkGenerated] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newMeeting = {
      id: Date.now().toString(),
      ...formData,
      organisateurId: 'admin',
      lienVisioconference: generatedLink || generateMeetingLink(),
      statut: 'programmée',
      historiqueMessages: []
    }
    
    setMeetings([...meetings, newMeeting])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      dateHeure: '',
      participants: []
    })
    setLinkGenerated(false)
    setGeneratedLink('')
  }

  const generateMeetingLink = () => {
    // Simulation de génération de lien via API externe
    const meetingId = Math.random().toString(36).substring(2, 15)
    const link = `https://meet.planningpro.com/room/${meetingId}`
    setGeneratedLink(link)
    setLinkGenerated(true)
    return link
  }

  const handleParticipantChange = (employeeId, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        participants: [...formData.participants, employeeId]
      })
    } else {
      setFormData({
        ...formData,
        participants: formData.participants.filter(id => id !== employeeId)
      })
    }
  }

  const sendMeetingLink = (meetingId) => {
    const meeting = meetings.find(m => m.id === meetingId)
    if (!meeting) return

    // Simulation d'envoi de lien
    const newMessage = {
      id: Date.now().toString(),
      contenu: `Lien de réunion : ${meeting.lienVisioconference}`,
      dateEnvoi: new Date().toISOString(),
      envoye: true
    }

    setMeetings(meetings.map(m => 
      m.id === meetingId 
        ? { ...m, historiqueMessages: [...m.historiqueMessages, newMessage] }
        : m
    ))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Ici on pourrait ajouter une notification toast
  }

  const deleteMeeting = (meetingId) => {
    setMeetings(meetings.filter(m => m.id !== meetingId))
  }

  const getEmployeeName = (employeeId) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId)
    return employee ? `${employee.prenom} ${employee.nom}` : 'Inconnu'
  }

  const getEmployeeEmail = (employeeId) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId)
    return employee ? employee.email : ''
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

  const upcomingMeetings = meetings.filter(m => new Date(m.dateHeure) > new Date())
  const pastMeetings = meetings.filter(m => new Date(m.dateHeure) <= new Date())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des réunions</h1>
          <p className="text-gray-600 mt-2">Organisez et gérez vos visioconférences</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Programmer une réunion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Programmer une nouvelle réunion</DialogTitle>
              <DialogDescription>
                Créez une réunion et générez un lien de visioconférence.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre de la réunion</Label>
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateHeure">Date et heure</Label>
                <Input
                  id="dateHeure"
                  type="datetime-local"
                  value={formData.dateHeure}
                  onChange={(e) => setFormData({...formData, dateHeure: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Participants</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mockEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`participant-${employee.id}`}
                        checked={formData.participants.includes(employee.id)}
                        onCheckedChange={(checked) => handleParticipantChange(employee.id, checked)}
                      />
                      <Label htmlFor={`participant-${employee.id}`} className="text-sm">
                        {employee.prenom} {employee.nom} ({employee.email})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Lien de visioconférence</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateMeetingLink}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Générer le lien
                  </Button>
                </div>
                {linkGenerated && (
                  <Alert>
                    <LinkIcon className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono">{generatedLink}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedLink)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Programmer la réunion
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
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
            <CardTitle className="text-sm font-medium">Total réunions</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetings.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants uniques</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(meetings.flatMap(m => m.participants)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Réunions à venir</CardTitle>
          <CardDescription>Prochaines réunions programmées</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date et heure</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{meeting.titre}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {meeting.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(meeting.dateHeure).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {meeting.participants.slice(0, 2).map(participantId => (
                        <Badge key={participantId} variant="secondary" className="text-xs">
                          {getEmployeeName(participantId)}
                        </Badge>
                      ))}
                      {meeting.participants.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{meeting.participants.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(meeting.statut)}>
                      {meeting.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(meeting.lienVisioconference)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendMeetingLink(meeting.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMeeting(meeting)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMeeting(meeting.id)}
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

      {/* Meeting History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des réunions</CardTitle>
          <CardDescription>Réunions passées et archivées</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Messages envoyés</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>
                    <div className="font-medium">{meeting.titre}</div>
                  </TableCell>
                  <TableCell>
                    {new Date(meeting.dateHeure).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{meeting.participants.length} participants</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{meeting.historiqueMessages.length} messages</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Meeting Details Dialog */}
      {selectedMeeting && (
        <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedMeeting.titre}</DialogTitle>
              <DialogDescription>
                {new Date(selectedMeeting.dateHeure).toLocaleString('fr-FR')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600 mt-1">{selectedMeeting.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Lien de visioconférence</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={selectedMeeting.lienVisioconference}
                    readOnly
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedMeeting.lienVisioconference)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Participants ({selectedMeeting.participants.length})</Label>
                <div className="mt-2 space-y-1">
                  {selectedMeeting.participants.map(participantId => (
                    <div key={participantId} className="text-sm">
                      {getEmployeeName(participantId)} ({getEmployeeEmail(participantId)})
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Historique des messages</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {selectedMeeting.historiqueMessages.length > 0 ? (
                    selectedMeeting.historiqueMessages.map((message) => (
                      <div key={message.id} className="bg-gray-50 p-2 rounded text-sm">
                        <div className="flex justify-between items-start">
                          <span>{message.contenu}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.dateEnvoi).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Aucun message envoyé.</p>
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

