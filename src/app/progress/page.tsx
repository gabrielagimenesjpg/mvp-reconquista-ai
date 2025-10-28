'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Heart, 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  MessageCircle,
  CheckCircle,
  Star,
  Award,
  BarChart3,
  Clock
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { 
  Achievement, 
  DailyMessage, 
  EmotionalCheckin, 
  DailyTask,
  UserProgress 
} from '@/lib/types'

export default function ProgressHistory() {
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [messages, setMessages] = useState<DailyMessage[]>([])
  const [checkins, setCheckins] = useState<EmotionalCheckin[]>([])
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [activeTab, setActiveTab] = useState('achievements')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistoryData()
  }, [])

  const loadHistoryData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      // Carregar conquistas
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

      setAchievements(achievementsData || [])

      // Carregar mensagens
      const { data: messagesData } = await supabase
        .from('daily_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('day_number', { ascending: false })

      setMessages(messagesData || [])

      // Carregar check-ins
      const { data: checkinsData } = await supabase
        .from('emotional_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setCheckins(checkinsData || [])

      // Carregar tarefas
      const { data: tasksData } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('day_number', { ascending: false })

      setTasks(tasksData || [])

      // Carregar progresso
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProgress(progressData)

    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCompletedTasks = () => tasks.filter(task => task.completed)
  const getCompletedMessages = () => messages.filter(message => message.completed)
  
  const getStreakData = () => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const dayCheckins = checkins.filter(checkin => {
        const checkinDate = new Date(checkin.created_at)
        return checkinDate.toDateString() === date.toDateString()
      })
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.created_at)
        return taskDate.toDateString() === date.toDateString() && task.completed
      })
      
      last7Days.push({
        date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        checkins: dayCheckins.length,
        tasks: dayTasks.length,
        active: dayCheckins.length > 0 || dayTasks.length > 0
      })
    }
    
    return last7Days
  }

  const getMoodDistribution = () => {
    const moodCounts = checkins.reduce((acc, checkin) => {
      acc[checkin.mood] = (acc[checkin.mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: (count / checkins.length) * 100
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMoodEmoji = (mood: string) => {
    const emojis = {
      'muito_triste': '😢',
      'triste': '😔',
      'neutro': '😐',
      'bem': '😊',
      'muito_bem': '😄'
    }
    return emojis[mood as keyof typeof emojis] || '😐'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-rose-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-rose-500" />
                <span className="text-2xl font-bold text-gray-900">Histórico & Progresso</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-full">
              <Star className="h-5 w-5" />
              <span className="font-semibold">Nível {progress?.level}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span className="font-semibold text-gray-900">Conquistas</span>
            </div>
            <div className="text-3xl font-bold text-yellow-500">{achievements.length}</div>
            <p className="text-sm text-gray-500">Total desbloqueadas</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <MessageCircle className="h-6 w-6 text-blue-500" />
              <span className="font-semibold text-gray-900">Mensagens</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">{getCompletedMessages().length}</div>
            <p className="text-sm text-gray-500">Lidas de {messages.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="font-semibold text-gray-900">Tarefas</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{getCompletedTasks().length}</div>
            <p className="text-sm text-gray-500">Concluídas de {tasks.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-6 w-6 text-purple-500" />
              <span className="font-semibold text-gray-900">Check-ins</span>
            </div>
            <div className="text-3xl font-bold text-purple-500">{checkins.length}</div>
            <p className="text-sm text-gray-500">Registros emocionais</p>
          </div>
        </div>

        {/* Activity Streak */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 text-rose-500 mr-2" />
            Atividade dos Últimos 7 Dias
          </h3>
          
          <div className="grid grid-cols-7 gap-4">
            {getStreakData().map((day, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                  day.active 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {day.tasks + day.checkins}
                </div>
                <p className="text-xs text-gray-500">{day.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'achievements', label: 'Conquistas', icon: Trophy },
                { id: 'messages', label: 'Mensagens', icon: MessageCircle },
                { id: 'checkins', label: 'Check-ins', icon: TrendingUp },
                { id: 'tasks', label: 'Tarefas', icon: CheckCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-rose-500 text-rose-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-4">
                {achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                        <p className="text-gray-600 text-sm">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDate(achievement.earned_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma conquista ainda. Complete tarefas para desbloquear!</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className={`p-4 rounded-xl border-2 ${
                      message.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">Dia {message.day_number}</span>
                          <span className="text-sm text-gray-500">• {message.phase}</span>
                        </div>
                        {message.completed && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Lida</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma mensagem ainda.</p>
                  </div>
                )}
              </div>
            )}

            {/* Check-ins Tab */}
            {activeTab === 'checkins' && (
              <div className="space-y-4">
                {checkins.length > 0 ? (
                  <>
                    {/* Mood Distribution */}
                    <div className="bg-purple-50 p-4 rounded-xl mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">Distribuição de Humor</h4>
                      <div className="space-y-2">
                        {getMoodDistribution().map((item) => (
                          <div key={item.mood} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getMoodEmoji(item.mood)}</span>
                              <span className="text-sm text-gray-700 capitalize">
                                {item.mood.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-8">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Check-ins List */}
                    {checkins.map((checkin) => (
                      <div key={checkin.id} className="p-4 bg-purple-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getMoodEmoji(checkin.mood)}</span>
                            <span className="font-semibold text-gray-900 capitalize">
                              {checkin.mood.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatDate(checkin.created_at)}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Energia: </span>
                            <span className="font-semibold">{checkin.energy_level}/10</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Confiança: </span>
                            <span className="font-semibold">{checkin.confidence_level}/10</span>
                          </div>
                        </div>
                        {checkin.notes && (
                          <p className="text-sm text-gray-700 italic">"{checkin.notes}"</p>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum check-in ainda. Comece registrando como você se sente!</p>
                  </div>
                )}
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task.id} className={`p-4 rounded-xl border-2 ${
                      task.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">Dia {task.day_number}</span>
                          <span className="text-sm text-gray-500">• {task.phase}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-yellow-600">
                            +{task.points_reward} pts
                          </span>
                          {task.completed && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Concluída</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <h4 className={`font-semibold mb-1 ${
                        task.completed ? 'text-green-700' : 'text-gray-900'
                      }`}>
                        {task.task_title}
                      </h4>
                      <p className={`text-sm ${
                        task.completed ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {task.task_description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatDate(task.created_at)}
                        {task.completed_at && (
                          <span className="ml-2">
                            • Concluída em {formatDate(task.completed_at)}
                          </span>
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma tarefa ainda.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}