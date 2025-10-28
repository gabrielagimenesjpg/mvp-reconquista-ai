'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Heart, 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  MessageCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/lib/types'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatIA() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadUserProfile()
    initializeChat()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile(profileData)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: 'Olá! Eu sou sua assistente de reconquista. Estou aqui para te ajudar com conselhos emocionais, estratégias de comunicação e apoio durante sua jornada. Como posso te ajudar hoje?',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulação de resposta da IA baseada no perfil e contexto
    // Em produção, substituir por chamada real para API da OpenAI
    
    const responses = {
      // Respostas baseadas em palavras-chave
      'triste': [
        'Entendo que você está se sentindo triste. É completamente normal sentir isso durante um processo de reconquista. Lembre-se de que essa fase de distanciamento é importante para seu crescimento pessoal.',
        'A tristeza faz parte do processo. Use esse sentimento como motivação para se tornar uma versão melhor de si mesmo. Que tal fazer algo que te traga alegria hoje?'
      ],
      'ansioso': [
        'A ansiedade é comum quando queremos muito que algo dê certo. Respire fundo e lembre-se: você está seguindo um plano estruturado. Confie no processo.',
        'Quando a ansiedade bater, foque no presente. O que você pode fazer hoje para se sentir melhor? Pequenas ações geram grandes resultados.'
      ],
      'dúvida': [
        'É normal ter dúvidas. Isso mostra que você está refletindo sobre suas ações. Conte-me mais sobre o que está te deixando inseguro.',
        'Dúvidas fazem parte da jornada. O importante é não deixar que elas te paralisem. Vamos conversar sobre o que está te preocupando.'
      ],
      'contato': [
        'Sobre fazer contato: lembre-se da fase em que você está. Se estiver no Distanciamento, foque em si mesmo. Se já estiver na Reaproximação, um contato sutil pode ser apropriado.',
        'Antes de fazer contato, pergunte-se: qual é meu objetivo? Estou fazendo isso por carência ou por estratégia? A intenção faz toda a diferença.'
      ],
      'mensagem': [
        'Para mensagens eficazes, seja autêntico mas estratégico. Evite parecer carente ou desesperado. Que tipo de mensagem você está pensando em enviar?',
        'Lembre-se: menos é mais. Uma mensagem simples e interessante é melhor que um texto longo e explicativo.'
      ],
      'ex': [
        'Falar sobre seu ex é natural. Que aspecto específico você gostaria de discutir? Comportamento dele, como interpretar sinais, ou estratégias de aproximação?',
        'Cada pessoa é única. Com base no que você me contou sobre o perfil dele, posso dar conselhos mais personalizados.'
      ]
    }

    // Análise simples de palavras-chave
    const lowerMessage = userMessage.toLowerCase()
    let selectedResponses: string[] = []

    for (const [keyword, keywordResponses] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        selectedResponses = keywordResponses
        break
      }
    }

    // Respostas genéricas se não encontrar palavra-chave específica
    if (selectedResponses.length === 0) {
      selectedResponses = [
        'Entendo sua situação. Pode me contar mais detalhes para que eu possa te ajudar melhor?',
        'Interessante. Como você se sente em relação a isso? Vamos explorar juntos as melhores estratégias.',
        'Cada situação é única. Me conte mais sobre o contexto para que eu possa dar conselhos mais específicos.',
        'Estou aqui para te apoiar. Que aspecto específico você gostaria de trabalhar hoje?'
      ]
    }

    // Personalização baseada no perfil
    let response = selectedResponses[Math.floor(Math.random() * selectedResponses.length)]
    
    if (profile) {
      // Adicionar contexto baseado no perfil
      if (profile.target_gender === 'homem' && lowerMessage.includes('ele')) {
        response += ' Lembre-se de que homens geralmente respondem bem a demonstrações de independência e valor próprio.'
      } else if (profile.target_gender === 'mulher' && lowerMessage.includes('ela')) {
        response += ' Mulheres costumam valorizar consistência e demonstrações genuínas de crescimento pessoal.'
      }

      if (profile.ex_type === 'possessivo' && (lowerMessage.includes('ciúme') || lowerMessage.includes('possessivo'))) {
        response += ' Com pessoas possessivas, é importante demonstrar que você mudou e que pode oferecer segurança emocional.'
      }
    }

    return response
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Simular delay de digitação da IA
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const aiResponse = await generateAIResponse(userMessage.content)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erro ao gerar resposta:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Pode tentar novamente?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const quickQuestions = [
    'Como devo interpretar o silêncio dele?',
    'É hora de fazer contato?',
    'Estou sendo muito ansiosa?',
    'Como mostrar que mudei?',
    'Que mensagem enviar?',
    'Como lidar com a saudade?'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">Assistente IA</span>
                  <p className="text-sm text-gray-500">Sempre online para te ajudar</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-rose-500' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-gray-800 shadow-lg'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-rose-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                Perguntas frequentes:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="text-xs bg-white hover:bg-rose-50 text-gray-700 px-3 py-2 rounded-full border border-gray-200 hover:border-rose-300 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="w-full resize-none border-0 focus:outline-none text-gray-800 placeholder-gray-500 max-h-32"
                  rows={1}
                  style={{ minHeight: '24px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  inputMessage.trim() && !isLoading
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}