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
import { Plus, Send, MessageSquare, Users, Megaphone, Eye, Reply } from 'lucide-react'

// Données simulées
const mockEmployees = [
  { id: '1', nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@entreprise.com' },
  { id: '2', nom: 'Martin', prenom: 'Marie', email: 'marie.martin@entreprise.com' },
  { id: '3', nom: 'Bernard', prenom: 'Pierre', email: 'pierre.bernard@entreprise.com' }
]

const initialMessages = [
  {
    id: '1',
    expediteurId: 'admin',
    destinataireId: '1',
    sujet: 'Nouvelle tâche assignée',
    contenu: 'Bonjour Jean, une nouvelle tâche vous a été assignée. Merci de consulter votre tableau de bord.',
    dateEnvoi: '2024-01-08T10:30:00',
    lu: true,
    type: 'individuel'
  },
  {
    id: '2',
    expediteurId: '1',
    destinataireId: 'admin',
    sujet: 'Question sur la tâche',
    contenu: 'Bonjour, j\'ai une question concernant la tâche qui m\'a été assignée. Pouvez-vous me donner plus de détails ?',
    dateEnvoi: '2024-01-08T14:15:00',
    lu: false,
    type: 'individuel'
  },
  {
    id: '3',
    expediteurId: 'admin',
    destinataireId: null,
    sujet: 'Réunion équipe - Lundi 15 janvier',
    contenu: 'Bonjour à tous, n\'oubliez pas la réunion d\'équipe prévue lundi 15 janvier à 10h00. Le lien de visioconférence vous sera envoyé séparément.',
    dateEnvoi: '2024-01-10T09:00:00',
    lu: true,
    type: 'annonce'
  }
]

export default function MessagingAdmin() {
  const [messages, setMessages] = useState(initialMessages)
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('received') // 'received', 'sent', 'announcements'
  const [formData, setFormData] = useState({
    type: 'individuel',
    destinataires: [],
    sujet: '',
    contenu: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newMessage = {
      id: Date.now().toString(),
      expediteurId: 'admin',
      destinataireId: formData.type === 'annonce' ? null : formData.destinataires[0],
      sujet: formData.sujet,
      contenu: formData.contenu,
      dateEnvoi: new Date().toISOString(),
      lu: false,
      type: formData.type
    }
    
    setMessages([...messages, newMessage])
    resetForm()
    setIsComposeDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      type: 'individuel',
      destinataires: [],
      sujet: '',
      contenu: ''
    })
  }

  const handleRecipientChange = (employeeId, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        destinataires: [...formData.destinataires, employeeId]
      })
    } else {
      setFormData({
        ...formData,
        destinataires: formData.destinataires.filter(id => id !== employeeId)
      })
    }
  }

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, lu: true } : msg
    ))
  }

  const getEmployeeName = (employeeId) => {
    if (employeeId === 'admin') return 'Administrateur'
    const employee = mockEmployees.find(emp => emp.id === employeeId)
    return employee ? `${employee.prenom} ${employee.nom}` : 'Inconnu'
  }

  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'received':
        return messages.filter(msg => msg.destinataireId === 'admin')
      case 'sent':
        return messages.filter(msg => msg.expediteurId === 'admin' && msg.type === 'individuel')
      case 'announcements':
        return messages.filter(msg => msg.type === 'annonce')
      default:
        return messages
    }
  }

  const unreadCount = messages.filter(msg => msg.destinataireId === 'admin' && !msg.lu).length
  const sentCount = messages.filter(msg => msg.expediteurId === 'admin' && msg.type === 'individuel').length
  const announcementCount = messages.filter(msg => msg.type === 'annonce').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messagerie interne</h1>
          <p className="text-gray-600 mt-2">Communiquez avec votre équipe</p>
        </div>
        
        <Dialog open={isComposeDialogOpen} onOpenChange={(open) => {
          setIsComposeDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Composer un message</DialogTitle>
              <DialogDescription>
                Envoyez un message à un employé ou créez une annonce générale.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de message</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value, destinataires: []})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individuel">Message individuel</SelectItem>
                    <SelectItem value="annonce">Annonce générale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.type === 'individuel' && (
                <div className="space-y-2">
                  <Label>Destinataire</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {mockEmployees.map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`recipient-${employee.id}`}
                          checked={formData.destinataires.includes(employee.id)}
                          onCheckedChange={(checked) => handleRecipientChange(employee.id, checked)}
                        />
                        <Label htmlFor={`recipient-${employee.id}`} className="text-sm">
                          {employee.prenom} {employee.nom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="sujet">Sujet</Label>
                <Input
                  id="sujet"
                  value={formData.sujet}
                  onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contenu">Message</Label>
                <Textarea
                  id="contenu"
                  value={formData.contenu}
                  onChange={(e) => setFormData({...formData, contenu: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
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
            <CardTitle className="text-sm font-medium">Messages reçus</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {messages.filter(msg => msg.destinataireId === 'admin').length}
            </div>
            {unreadCount > 0 && (
              <p className="text-xs text-red-600 mt-1">{unreadCount} non lus</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages envoyés</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annonces</CardTitle>
            <Megaphone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{announcementCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Message Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-4">
            <Button
              variant={activeTab === 'received' ? 'default' : 'outline'}
              onClick={() => setActiveTab('received')}
              className="relative"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages reçus
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'sent' ? 'default' : 'outline'}
              onClick={() => setActiveTab('sent')}
            >
              <Send className="h-4 w-4 mr-2" />
              Messages envoyés
            </Button>
            <Button
              variant={activeTab === 'announcements' ? 'default' : 'outline'}
              onClick={() => setActiveTab('announcements')}
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Annonces
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {activeTab === 'received' ? 'Expéditeur' : 
                   activeTab === 'sent' ? 'Destinataire' : 'Annonce'}
                </TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredMessages().map((message) => (
                <TableRow key={message.id} className={!message.lu && message.destinataireId === 'admin' ? 'bg-blue-50' : ''}>
                  <TableCell>
                    <div className="font-medium">
                      {activeTab === 'announcements' ? 'Tous les employés' : 
                       getEmployeeName(activeTab === 'received' ? message.expediteurId : message.destinataireId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{message.sujet}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {message.contenu}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(message.dateEnvoi).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {activeTab === 'received' ? (
                      <Badge variant={message.lu ? 'secondary' : 'default'}>
                        {message.lu ? 'Lu' : 'Non lu'}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Envoyé</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMessage(message)
                          if (!message.lu && message.destinataireId === 'admin') {
                            markAsRead(message.id)
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {activeTab === 'received' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              type: 'individuel',
                              destinataires: [message.expediteurId],
                              sujet: `Re: ${message.sujet}`,
                              contenu: ''
                            })
                            setIsComposeDialogOpen(true)
                          }}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message Details Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedMessage.sujet}</DialogTitle>
              <DialogDescription>
                {selectedMessage.type === 'annonce' ? 'Annonce générale' : 
                 `De: ${getEmployeeName(selectedMessage.expediteurId)} - ${new Date(selectedMessage.dateEnvoi).toLocaleString('fr-FR')}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.contenu}</p>
                </div>
              </div>
              
              {selectedMessage.type !== 'annonce' && (
                <div>
                  <Label className="text-sm font-medium">
                    {selectedMessage.expediteurId === 'admin' ? 'Destinataire' : 'Expéditeur'}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {getEmployeeName(selectedMessage.expediteurId === 'admin' ? selectedMessage.destinataireId : selectedMessage.expediteurId)}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                {selectedMessage.destinataireId === 'admin' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        type: 'individuel',
                        destinataires: [selectedMessage.expediteurId],
                        sujet: `Re: ${selectedMessage.sujet}`,
                        contenu: ''
                      })
                      setSelectedMessage(null)
                      setIsComposeDialogOpen(true)
                    }}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Répondre
                  </Button>
                )}
                <Button onClick={() => setSelectedMessage(null)}>
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

