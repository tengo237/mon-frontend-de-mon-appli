import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '../../contexts/AuthContext'
import { Plus, Send, MessageSquare, Inbox, Megaphone, Reply, Eye } from 'lucide-react'

// Données simulées des messages pour l'employé connecté
const initialMessages = [
  {
    id: '1',
    expediteurId: 'admin',
    expediteurNom: 'Administrateur',
    destinataireId: 'current_user',
    sujet: 'Nouvelle tâche assignée',
    contenu: 'Bonjour Jean, une nouvelle tâche vous a été assignée concernant le développement de la page d\'accueil. Merci de consulter votre tableau de bord pour plus de détails.',
    dateEnvoi: '2024-01-08T10:30:00',
    lu: false,
    type: 'individuel'
  },
  {
    id: '2',
    expediteurId: 'admin',
    expediteurNom: 'Administrateur',
    destinataireId: null,
    sujet: 'Réunion équipe - Lundi 15 janvier',
    contenu: 'Bonjour à tous, n\'oubliez pas la réunion d\'équipe prévue lundi 15 janvier à 10h00. Le lien de visioconférence vous sera envoyé séparément. À l\'ordre du jour : point sur les projets en cours et planification de la semaine.',
    dateEnvoi: '2024-01-10T09:00:00',
    lu: true,
    type: 'annonce'
  },
  {
    id: '3',
    expediteurId: 'admin',
    expediteurNom: 'Administrateur',
    destinataireId: 'current_user',
    sujet: 'Validation des heures de travail',
    contenu: 'Merci de vérifier et valider vos heures de travail pour la semaine dernière dans votre interface de pointage.',
    dateEnvoi: '2024-01-05T16:45:00',
    lu: true,
    type: 'individuel'
  }
]

const sentMessages = [
  {
    id: '4',
    expediteurId: 'current_user',
    expediteurNom: 'Jean Dupont',
    destinataireId: 'admin',
    destinataireNom: 'Administrateur',
    sujet: 'Question sur la tâche assignée',
    contenu: 'Bonjour, j\'ai une question concernant la tâche de développement de la page d\'accueil. Pouvez-vous me préciser les spécifications techniques requises ? Merci.',
    dateEnvoi: '2024-01-08T14:15:00',
    lu: false,
    type: 'individuel'
  }
]

export default function EmployeeMessaging() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(initialMessages)
  const [sent, setSent] = useState(sentMessages)
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('received') // 'received', 'sent', 'announcements'
  const [formData, setFormData] = useState({
    sujet: '',
    contenu: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newMessage = {
      id: Date.now().toString(),
      expediteurId: 'current_user',
      expediteurNom: `${user?.prenom} ${user?.nom}`,
      destinataireId: 'admin',
      destinataireNom: 'Administrateur',
      sujet: formData.sujet,
      contenu: formData.contenu,
      dateEnvoi: new Date().toISOString(),
      lu: false,
      type: 'individuel'
    }
    
    setSent([newMessage, ...sent])
    resetForm()
    setIsComposeDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      sujet: '',
      contenu: ''
    })
  }

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, lu: true } : msg
    ))
  }

  const replyToMessage = (originalMessage) => {
    setFormData({
      sujet: `Re: ${originalMessage.sujet}`,
      contenu: `\n\n--- Message original ---\nDe: ${originalMessage.expediteurNom}\nDate: ${new Date(originalMessage.dateEnvoi).toLocaleString('fr-FR')}\nSujet: ${originalMessage.sujet}\n\n${originalMessage.contenu}`
    })
    setSelectedMessage(null)
    setIsComposeDialogOpen(true)
  }

  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'received':
        return messages.filter(msg => msg.type === 'individuel')
      case 'sent':
        return sent
      case 'announcements':
        return messages.filter(msg => msg.type === 'annonce')
      default:
        return messages
    }
  }

  const unreadCount = messages.filter(msg => msg.type === 'individuel' && !msg.lu).length
  const sentCount = sent.length
  const announcementCount = messages.filter(msg => msg.type === 'annonce').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ma messagerie</h1>
          <p className="text-gray-600 mt-2">Communiquez avec l'administration</p>
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
                Envoyez un message à l'administration.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destinataire">Destinataire</Label>
                <Input
                  id="destinataire"
                  value="Administrateur"
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
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
                  rows={6}
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
            <Inbox className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {messages.filter(msg => msg.type === 'individuel').length}
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
              <Inbox className="h-4 w-4 mr-2" />
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
          <div className="space-y-4">
            {getFilteredMessages().map((message) => (
              <div 
                key={message.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  !message.lu && message.destinataireId === 'current_user' ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
                onClick={() => {
                  setSelectedMessage(message)
                  if (!message.lu && message.destinataireId === 'current_user') {
                    markAsRead(message.id)
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{message.sujet}</h3>
                      {!message.lu && message.destinataireId === 'current_user' && (
                        <Badge variant="destructive" className="text-xs">
                          Non lu
                        </Badge>
                      )}
                      {message.type === 'annonce' && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                          Annonce
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2">{message.contenu}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {activeTab === 'sent' ? 'À: ' : 'De: '}
                        {activeTab === 'sent' 
                          ? (message.destinataireNom || 'Administrateur')
                          : (message.expediteurNom || 'Administrateur')
                        }
                      </span>
                      <span>
                        {new Date(message.dateEnvoi).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {activeTab === 'received' && (
                      <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {getFilteredMessages().length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'received' && 'Aucun message reçu'}
                  {activeTab === 'sent' && 'Aucun message envoyé'}
                  {activeTab === 'announcements' && 'Aucune annonce'}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'received' && 'Vous n\'avez reçu aucun message personnel.'}
                  {activeTab === 'sent' && 'Vous n\'avez envoyé aucun message.'}
                  {activeTab === 'announcements' && 'Aucune annonce générale n\'a été publiée.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Details Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedMessage.sujet}</span>
                <div className="flex space-x-2">
                  {selectedMessage.type === 'annonce' && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Annonce
                    </Badge>
                  )}
                  {!selectedMessage.lu && selectedMessage.destinataireId === 'current_user' && (
                    <Badge variant="destructive">Non lu</Badge>
                  )}
                </div>
              </DialogTitle>
              <DialogDescription>
                {selectedMessage.type === 'annonce' ? 'Annonce générale' : 
                 `${activeTab === 'sent' ? 'À' : 'De'}: ${
                   activeTab === 'sent' 
                     ? (selectedMessage.destinataireNom || 'Administrateur')
                     : (selectedMessage.expediteurNom || 'Administrateur')
                 } • ${new Date(selectedMessage.dateEnvoi).toLocaleString('fr-FR')}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.contenu}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                {activeTab === 'received' && selectedMessage.type !== 'annonce' && (
                  <Button
                    variant="outline"
                    onClick={() => replyToMessage(selectedMessage)}
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

