'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  type: 'single' | 'multiple';
}

const questions: Question[] = [
  {
    id: 'relationship_type',
    question: 'Qual era o tipo do seu relacionamento?',
    type: 'single',
    options: [
      { value: 'namoro_serio', label: 'Namoro sério (mais de 6 meses)' },
      { value: 'namoro_casual', label: 'Namoro casual (menos de 6 meses)' },
      { value: 'relacionamento_longo', label: 'Relacionamento longo (mais de 2 anos)' },
      { value: 'ficante', label: 'Ficante/Crush' },
      { value: 'casamento', label: 'Casamento/União estável' }
    ]
  },
  {
    id: 'breakup_reason',
    question: 'Qual foi o principal motivo do término?',
    type: 'single',
    options: [
      { value: 'brigas_frequentes', label: 'Brigas frequentes' },
      { value: 'distancia', label: 'Distância/Mudança' },
      { value: 'falta_tempo', label: 'Falta de tempo para o relacionamento' },
      { value: 'terceira_pessoa', label: 'Envolvimento com terceira pessoa' },
      { value: 'diferencias', label: 'Diferenças de objetivos/valores' },
      { value: 'rotina', label: 'Relacionamento ficou monótono' },
      { value: 'pressao_familia', label: 'Pressão da família/amigos' },
      { value: 'nao_sei', label: 'Não sei exatamente' }
    ]
  },
  {
    id: 'ex_personality',
    question: 'Como você descreveria a personalidade do seu ex/crush?',
    type: 'multiple',
    options: [
      { value: 'introvertido', label: 'Introvertido(a)' },
      { value: 'extrovertido', label: 'Extrovertido(a)' },
      { value: 'romantico', label: 'Romântico(a)' },
      { value: 'pratico', label: 'Prático(a)' },
      { value: 'emotivo', label: 'Emotivo(a)' },
      { value: 'racional', label: 'Racional' },
      { value: 'independente', label: 'Independente' },
      { value: 'carinhoso', label: 'Carinhoso(a)' }
    ]
  },
  {
    id: 'current_contact',
    question: 'Qual é o status atual do contato entre vocês?',
    type: 'single',
    options: [
      { value: 'sem_contato', label: 'Sem nenhum contato' },
      { value: 'contato_esporadico', label: 'Contato esporádico (mensagens raras)' },
      { value: 'amigos', label: 'Ainda somos amigos' },
      { value: 'bloqueado', label: 'Me bloqueou/bloqueei' },
      { value: 'redes_sociais', label: 'Só seguimos nas redes sociais' }
    ]
  },
  {
    id: 'time_since_breakup',
    question: 'Há quanto tempo vocês terminaram?',
    type: 'single',
    options: [
      { value: 'menos_1_mes', label: 'Menos de 1 mês' },
      { value: '1_3_meses', label: '1 a 3 meses' },
      { value: '3_6_meses', label: '3 a 6 meses' },
      { value: '6_12_meses', label: '6 meses a 1 ano' },
      { value: 'mais_1_ano', label: 'Mais de 1 ano' }
    ]
  }
];

export default function ProfileTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está logado
    const user = localStorage.getItem('reconquista_user');
    if (!user) {
      router.push('/auth');
    }
  }, [router]);

  const handleAnswer = (questionId: string, value: string, type: 'single' | 'multiple') => {
    if (type === 'single') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: [value]
      }));
    } else {
      setAnswers(prev => {
        const currentAnswers = prev[questionId] || [];
        const isSelected = currentAnswers.includes(value);
        
        if (isSelected) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter(answer => answer !== value)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, value]
          };
        }
      });
    }
  };

  const canProceed = () => {
    const currentQ = questions[currentQuestion];
    const currentAnswers = answers[currentQ.id] || [];
    return currentAnswers.length > 0;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsLoading(true);
    
    // Salvar respostas do perfil
    const profileData = {
      answers,
      completedAt: new Date().toISOString(),
      phase: 'distanciamento',
      progress: 0
    };
    
    localStorage.setItem('reconquista_profile', JSON.stringify(profileData));
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentAnswers = answers[currentQ.id] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-[#E91E63]" />
              <span className="text-2xl font-bold text-gray-900">Reconquista.AI</span>
            </Link>
            <div className="text-sm text-gray-600">
              Pergunta {currentQuestion + 1} de {questions.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso do teste</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#E91E63] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option) => {
              const isSelected = currentAnswers.includes(option.value);
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value, currentQ.type)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]'
                      : 'border-gray-200 hover:border-[#E91E63] hover:bg-pink-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#E91E63] bg-[#E91E63]' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {currentQ.type === 'multiple' && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Você pode selecionar múltiplas opções
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Anterior</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="flex items-center space-x-2 bg-[#E91E63] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#C2185B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
              <div className="w-16 h-16 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Analisando seu perfil...
              </h3>
              <p className="text-gray-600">
                Nossa IA está criando um plano personalizado para você
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}