import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  X,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { askIslamicQuestion } from '../services/chatbotService.js'

// Composant pour afficher un message
function ChatMessage({ message, isBot, timestamp, isLoading }) {
  return (
    <div className={`flex gap-3 mb-4 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isBot 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-blue-100 text-blue-700'
      }`}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      {/* Message */}
      <div className={`flex-1 ${isBot ? 'mr-8' : 'ml-8'}`}>
        <div className={`rounded-lg p-3 ${
          isBot 
            ? 'bg-emerald-50 border border-emerald-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600">Recherche dans les sources islamiques...</span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed">
              {message.split('\n').map((line, index) => (
                <p key={index} className={index > 0 ? 'mt-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isBot ? 'text-left' : 'text-right'}`}>
          {timestamp}
        </div>
      </div>
    </div>
  )
}

// Composant principal du ChatBot
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "السلام عليكم ورحمة الله وبركاته\n\nJe suis votre assistant islamique spécialisé dans le Coran et la Sunna authentique. Je peux vous aider avec :\n\n• Questions sur les versets du Coran\n• Hadiths authentiques du Prophète (ﷺ)\n• Enseignements islamiques\n• Références et sources\n\nComment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Ajouter un message de chargement temporaire
      const loadingMessage = {
        id: Date.now() + 1,
        text: '',
        isBot: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isLoading: true
      }
      setMessages(prev => [...prev, loadingMessage])

      // Appeler le service IA
      const response = await askIslamicQuestion(inputMessage)
      
      // Remplacer le message de chargement par la réponse
      setMessages(prev => prev.slice(0, -1).concat({
        id: Date.now() + 2,
        text: response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }))
    } catch (error) {
      console.error('Erreur lors de la requête:', error)
      
      // Remplacer le message de chargement par un message d'erreur
      setMessages(prev => prev.slice(0, -1).concat({
        id: Date.now() + 3,
        text: "Je m'excuse, une erreur s'est produite. Veuillez réessayer votre question. En attendant, je vous encourage à consulter directement le Coran et les hadiths authentiques dans l'application.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Gérer l'appui sur Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Questions suggérées
  const suggestedQuestions = [
    "Que dit le Coran sur la patience ?",
    "Quels sont les piliers de l'Islam ?",
    "Comment faire les ablutions selon la Sunna ?",
    "Que dit le Prophète (ﷺ) sur la charité ?"
  ]

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        {/* Badge de notification */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          IA
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <Card className="w-full h-full shadow-2xl border-2 border-emerald-200 flex flex-col">
        {/* En-tête */}
        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Assistant Islamique</CardTitle>
                <CardDescription className="text-emerald-100 text-sm">
                  Coran & Sunna authentique
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 w-8 h-8"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Zone de messages */}
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.text}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                    isLoading={message.isLoading}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Questions suggérées */}
              {messages.length === 1 && (
                <div className="p-4 border-t bg-gray-50 flex-shrink-0">
                  <p className="text-sm text-gray-600 mb-2">Questions suggérées :</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-xs px-2 py-1 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50 cursor-pointer"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Zone de saisie */}
              <div className="p-4 border-t flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question sur l'Islam..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    size="icon"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {/* Disclaimer */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Basé sur le Coran et la Sunna authentique • Vérifiez toujours avec des savants
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}

export default ChatBot

