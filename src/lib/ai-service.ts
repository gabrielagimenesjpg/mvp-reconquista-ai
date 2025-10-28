import type { UserProfile, EmotionalCheckin, ReconquestPhase } from './types'

// Simulação de integração com IA (GPT-4)
// Em produção, substituir por chamada real para API da OpenAI
export async function generateDailyMessage(
  profile: UserProfile,
  dayNumber: number,
  phase: ReconquestPhase,
  recentCheckins: EmotionalCheckin[]
): Promise<string> {
  
  // Análise do perfil para personalização
  const isTargetingMale = profile.target_gender === 'homem'
  const isTargetingFemale = profile.target_gender === 'mulher'
  const userGender = profile.gender
  const relationshipType = profile.relationship_type
  const exType = profile.ex_type
  
  // Análise do estado emocional recente
  const recentMood = recentCheckins.length > 0 ? recentCheckins[0].mood : 'neutro'
  const recentConfidence = recentCheckins.length > 0 ? recentCheckins[0].confidence_level : 5

  // Gatilhos psicológicos específicos por fase
  const phaseStrategies = {
    'Distanciamento': {
      triggers: ['escassez', 'antecipação'],
      focus: 'Criar valor próprio e despertar curiosidade através da ausência'
    },
    'Reaproximação': {
      triggers: ['curiosidade', 'reciprocidade'],
      focus: 'Reestabelecer conexão de forma natural e estratégica'
    },
    'Atração': {
      triggers: ['prova_social', 'gatilho_emocional', 'escassez_exclusividade'],
      focus: 'Despertar desejo e interesse através de evolução pessoal'
    },
    'Reconexão': {
      triggers: ['coerencia', 'reciprocidade_emocional', 'autoridade_confianca'],
      focus: 'Consolidar reconquista com conversas profundas e compromisso'
    }
  }

  // Base de mensagens por fase e contexto com gatilhos psicológicos
  const messageTemplates = {
    'Distanciamento': {
      'homem': {
        'possessivo': [
          '🎯 **GATILHO: ESCASSEZ** - Hoje é dia de mostrar valor próprio. Homens possessivos respeitam quem tem independência. Poste algo sobre seus hobbies ou conquistas pessoais. Quando você se afasta, ele sente sua falta.',
          '🧠 **GATILHO: ANTECIPAÇÃO** - Foque em si mesmo hoje. Quando ele perceber que você está bem sem ele, a curiosidade vai despertar. Evite qualquer contato direto. Crie expectativa de reconexão.',
          '✨ **GATILHO: ESCASSEZ** - Dia de criar mistério. Apareça em lugares que vocês frequentavam, mas com outras pessoas. Deixe que alguém conte para ele. Sua ausência vale mais que sua presença agora.'
        ],
        'emocional': [
          '💭 **GATILHO: ANTECIPAÇÃO** - Homens emocionais valorizam autenticidade. Hoje, compartilhe algo genuíno sobre seu crescimento pessoal nas redes sociais. Crie expectativa sobre sua evolução.',
          '🎵 **GATILHO: ESCASSEZ** - É hora de despertar nostalgia positiva. Ouça aquela música que vocês curtiam e poste sobre "memórias que nos fazem crescer". Sua ausência emocional o fará refletir.',
          '🌱 **GATILHO: ANTECIPAÇÃO** - Foque em atividades que mostrem sua evolução emocional. Ele precisa ver que você está se tornando uma versão melhor de si mesma. Crie curiosidade sobre quem você está se tornando.'
        ],
        'indiferente': [
          '🔥 **GATILHO: ESCASSEZ** - Homens indiferentes são desafiados pela escassez. Hoje, seja vista com outras pessoas interessantes. Crie FOMO (fear of missing out). Sua indisponibilidade desperta interesse.',
          '📈 **GATILHO: ANTECIPAÇÃO** - Mostre que sua vida está incrível. Poste sobre experiências únicas que você está vivendo. Indiferença combate indiferença. Crie expectativa sobre suas conquistas.',
          '👑 **GATILHO: ESCASSEZ** - Dia de ser inalcançável. Responda mensagens com delay, esteja "ocupada" com coisas importantes. Desperte a competitividade dele através da sua escassez.'
        ]
      },
      'mulher': {
        'possessivo': [
          '💪 **GATILHO: ESCASSEZ** - Mulheres possessivas precisam ver que você está bem. Hoje, demonstre independência emocional através de atividades que te fazem feliz. Sua ausência cria valor.',
          '🌟 **GATILHO: ANTECIPAÇÃO** - Evite dar sinais de carência. Poste sobre suas conquistas e momentos de alegria. Ela precisa sentir que perdeu alguém valioso. Crie expectativa sobre sua evolução.',
          '😊 **GATILHO: ESCASSEZ** - Foque em construir sua própria felicidade. Quando ela perceber que você não precisa dela para ser feliz, vai repensar a decisão. Sua independência é atrativa.'
        ],
        'emocional': [
          '🎭 **GATILHO: ANTECIPAÇÃO** - Mulheres emocionais respondem à vulnerabilidade controlada. Compartilhe algo sobre seu crescimento pessoal, mas sem mencionar ela. Crie curiosidade sobre sua jornada.',
          '📚 **GATILHO: ESCASSEZ** - Hoje é dia de mostrar maturidade emocional. Poste sobre lições aprendidas e como você está se tornando uma pessoa melhor. Sua evolução cria valor.',
          '🧘 **GATILHO: ANTECIPAÇÃO** - Demonstre que você entende os próprios sentimentos. Ela precisa ver que você evoluiu emocionalmente desde o término. Crie expectativa sobre sua nova versão.'
        ],
        'indiferente': [
          '🎪 **GATILHO: ESCASSEZ** - Indiferença feminina é quebrada por valor social. Seja vista com pessoas interessantes, mostre que outros te valorizam. Sua popularidade desperta interesse.',
          '🏆 **GATILHO: ANTECIPAÇÃO** - Crie curiosidade através do sucesso. Compartilhe conquistas profissionais ou pessoais. Ela precisa ver o que está perdendo. Gere expectativa sobre suas conquistas.',
          '💎 **GATILHO: ESCASSEZ** - Dia de ser seletivo. Demonstre que você tem opções e está escolhendo com quem passar seu tempo. Isso desperta interesse através da escassez.'
        ]
      }
    },
    'Reaproximação': {
      'homem': {
        'possessivo': [
          '👀 **GATILHO: CURIOSIDADE** - Hora do primeiro contato indireto. Curta uma foto antiga dele ou responda um story de forma casual. Nada muito óbvio. Desperte curiosidade sobre suas intenções.',
          '💌 **GATILHO: RECIPROCIDADE** - Envie uma mensagem sobre algo que lembrou dele, mas sem romantismo. "Vi isso e lembrei de você" com algo engraçado ou interessante. Pequenas gentilezas reforçam conexão.',
          '🤝 **GATILHO: CURIOSIDADE** - Faça um comentário amigável em algo público dele. Mostre que não há ressentimentos, mas mantenha a distância emocional. Desperte interesse sobre sua mudança.'
        ],
        'emocional': [
          '💝 **GATILHO: RECIPROCIDADE** - Homens emocionais apreciam sinceridade. Envie uma mensagem reconhecendo algo bom do relacionamento de vocês, sem pressionar. Gentileza gera reciprocidade.',
          '📸 **GATILHO: CURIOSIDADE** - Compartilhe uma memória positiva de forma leve. "Lembrei daquele dia que..." mas termine com algo sobre como você está bem agora. Desperte nostalgia curiosa.',
          '🙏 **GATILHO: RECIPROCIDADE** - Demonstre maturidade emocional. Agradeça por algo que ele te ensinou, mostrando crescimento pessoal. Gratidão gera reciprocidade emocional.'
        ],
        'indiferente': [
          '🎭 **GATILHO: CURIOSIDADE** - Seja estratégica com homens indiferentes. Apareça brevemente na vida dele, desperte curiosidade, depois se afaste novamente. Mantenha o mistério.',
          '🔄 **GATILHO: RECIPROCIDADE** - Use o contato indireto. Peça algo emprestado através de um amigo em comum, ou apareça em um lugar que ele frequenta. Crie situações de reciprocidade.',
          '🎲 **GATILHO: CURIOSIDADE** - Crie situações "casuais" de encontro. Vá ao mesmo evento que ele, mas não demonstre que foi por causa dele. Desperte curiosidade sobre o "acaso".'
        ]
      },
      'mulher': {
        'possessivo': [
          '🌱 **GATILHO: RECIPROCIDADE** - Mulheres possessivas precisam sentir que você mudou. Demonstre crescimento através de pequenos gestos de maturidade. Mudança gera reciprocidade.',
          '🤲 **GATILHO: CURIOSIDADE** - Faça um contato respeitoso reconhecendo os erros do passado. Mostre que você entende a perspectiva dela. Desperte curiosidade sobre sua evolução.',
          '⏰ **GATILHO: RECIPROCIDADE** - Seja paciente. Envie mensagens espaçadas mostrando que você está bem, mas que valoriza a amizade de vocês. Paciência gera reciprocidade.'
        ],
        'emocional': [
          '❤️ **GATILHO: CURIOSIDADE** - Conecte-se emocionalmente de forma sutil. Pergunte como ela está passando por algo que você sabe que é importante para ela. Desperte curiosidade sobre seu cuidado.',
          '🌸 **GATILHO: RECIPROCIDADE** - Compartilhe algo vulnerável sobre seu crescimento pessoal. Mulheres emocionais valorizam autenticidade e evolução. Vulnerabilidade gera reciprocidade.',
          '💐 **GATILHO: CURIOSIDADE** - Demonstre empatia. Lembre de datas importantes para ela e envie uma mensagem carinhosa, mas sem pressionar. Desperte curiosidade sobre sua atenção.'
        ],
        'indiferente': [
          '🦋 **GATILHO: CURIOSIDADE** - Desperte curiosidade através de mudanças visíveis. Ela precisa perceber que você evoluiu significativamente. Transformação gera interesse.',
          '⚡ **GATILHO: RECIPROCIDADE** - Use contatos breves e interessantes. Compartilhe algo intrigante sobre sua vida nova, depois se afaste. Crie ciclos de reciprocidade.',
          '🌟 **GATILHO: CURIOSIDADE** - Crie valor social. Seja vista com pessoas que ela admira ou em situações que despertem seu interesse. Desperte curiosidade sobre sua popularidade.'
        ]
      }
    },
    'Atração': {
      'homem': {
        'possessivo': [
          '🎮 **GATILHO: ESCASSEZ/EXCLUSIVIDADE** - Intensifique a comunicação, mas mantenha o controle. Responda com entusiasmo, mas não imediatamente. Sua disponibilidade limitada aumenta seu valor.',
          '🎯 **GATILHO: PROVA SOCIAL** - Mostre que você tem uma vida interessante. Convide-o para algo casual, mas deixe claro que você tem outras opções. Outras pessoas te valorizam.',
          '🏆 **GATILHO: GATILHO EMOCIONAL** - Desperte o lado competitivo dele. Mencione sutilmente que outras pessoas demonstram interesse em você. Competição desperta emoções primitivas.'
        ],
        'emocional': [
          '💫 **GATILHO: GATILHO EMOCIONAL** - Aprofunde a conexão emocional. Compartilhe sonhos e planos futuros, criando uma visão de vocês juntos. Emoções positivas criam atração.',
          '🌊 **GATILHO: PROVA SOCIAL** - Seja vulnerável de forma controlada. Conte sobre seus medos e esperanças, criando intimidade emocional. Vulnerabilidade autêntica é atrativa.',
          '🧩 **GATILHO: ESCASSEZ/EXCLUSIVIDADE** - Demonstre como vocês se complementam. Relembre momentos especiais e como vocês eram bons juntos. Conexão única é escassa.'
        ],
        'indiferente': [
          '🎪 **GATILHO: ESCASSEZ/EXCLUSIVIDADE** - Mantenha-se interessante e imprevisível. Alterne entre proximidade e distância, criando tensão emocional. Imprevisibilidade gera interesse.',
          '🧠 **GATILHO: PROVA SOCIAL** - Desafie-o intelectualmente. Homens indiferentes são atraídos por mulheres que os fazem pensar. Inteligência é prova social.',
          '👑 **GATILHO: GATILHO EMOCIONAL** - Seja a melhor versão de si mesma. Mostre conquistas e crescimento que o façam questionar a decisão de te deixar ir. Evolução desperta emoções.'
        ]
      },
      'mulher': {
        'possessivo': [
          '🛡️ **GATILHO: COERÊNCIA** - Tranquilize os medos dela através de consistência. Seja previsível em suas demonstrações de interesse. Consistência gera confiança.',
          '🌱 **GATILHO: PROVA SOCIAL** - Mostre que você mudou os comportamentos que a incomodavam. Demonstre crescimento através de ações. Mudança real é prova social.',
          '🔒 **GATILHO: GATILHO EMOCIONAL** - Crie segurança emocional. Seja transparente sobre seus sentimentos e intenções. Segurança desperta emoções positivas.'
        ],
        'emocional': [
          '💖 **GATILHO: GATILHO EMOCIONAL** - Intensifique a conexão emocional. Compartilhe seus sentimentos de forma madura e respeitosa. Emoções autênticas criam atração.',
          '✨ **GATILHO: ESCASSEZ/EXCLUSIVIDADE** - Crie momentos especiais juntos. Planeje encontros que toquem o coração dela e recriem a magia do relacionamento. Momentos únicos são escassos.',
          '🎁 **GATILHO: PROVA SOCIAL** - Demonstre como você valoriza ela. Seja específico sobre o que você ama na personalidade e nos sonhos dela. Valorização é prova social.'
        ],
        'indiferente': [
          '📊 **GATILHO: PROVA SOCIAL** - Prove seu valor através de ações consistentes. Mulheres indiferentes precisam ver mudanças reais. Ações são prova social definitiva.',
          '⏳ **GATILHO: COERÊNCIA** - Seja paciente mas persistente. Demonstre que você está disposto a investir tempo e energia nela. Persistência coerente é atrativa.',
          '🎨 **GATILHO: ESCASSEZ/EXCLUSIVIDADE** - Crie experiências únicas. Surpreenda-a com gestos que mostrem o quanto você a conhece e valoriza. Experiências personalizadas são escassas.'
        ]
      }
    },
    'Reconexão': {
      'homem': {
        'possessivo': [
          '🎯 **GATILHO: AUTORIDADE/CONFIANÇA** - É hora de definir o relacionamento. Seja direto sobre seus sentimentos, mas dê espaço para ele processar. Liderança emocional demonstra autoridade.',
          '🤝 **GATILHO: COERÊNCIA** - Demonstre comprometimento através de ações. Mostre que você está pronto para um relacionamento sério. Ações coerentes geram confiança.',
          '🕊️ **GATILHO: RECIPROCIDADE EMOCIONAL** - Tranquilize os medos dele sobre possessividade. Demonstre que você valoriza a independência mútua. Equilíbrio emocional gera reciprocidade.'
        ],
        'emocional': [
          '💝 **GATILHO: RECIPROCIDADE EMOCIONAL** - Abra seu coração completamente. Homens emocionais precisam sentir a profundidade dos seus sentimentos. Vulnerabilidade gera reciprocidade.',
          '🏗️ **GATILHO: AUTORIDADE/CONFIANÇA** - Crie um futuro juntos. Conversem sobre planos, sonhos e como vocês podem construir algo duradouro. Visão de futuro demonstra autoridade.',
          '🎉 **GATILHO: COERÊNCIA** - Celebre a reconexão. Marquem esse momento especial com algo significativo para vocês dois. Celebração coerente fortalece vínculo.'
        ],
        'indiferente': [
          '🎲 **GATILHO: AUTORIDADE/CONFIANÇA** - Seja estratégica na definição do relacionamento. Não pressione, mas deixe claro o que você quer. Clareza demonstra autoridade.',
          '🌟 **GATILHO: ESCASSEZ/EXCLUSIVIDADE** - Mantenha o mistério mesmo na reconexão. Continue sendo interessante e imprevisível. Mistério mantém escassez.',
          '💎 **GATILHO: COERÊNCIA** - Demonstre valor contínuo. Mostre que escolher você é a melhor decisão que ele pode fazer. Valor consistente é coerente.'
        ]
      },
      'mulher': {
        'possessivo': [
          '🔐 **GATILHO: AUTORIDADE/CONFIANÇA** - Ofereça segurança total. Demonstre através de ações que ela pode confiar em você completamente. Segurança demonstra autoridade.',
          '🪟 **GATILHO: COERÊNCIA** - Seja transparente sobre tudo. Mulheres possessivas precisam de honestidade absoluta para se sentirem seguras. Transparência é coerente.',
          '📋 **GATILHO: RECIPROCIDADE EMOCIONAL** - Construam acordos claros sobre o relacionamento. Definam limites e expectativas juntos. Acordos mútuos geram reciprocidade.'
        ],
        'emocional': [
          '🎊 **GATILHO: RECIPROCIDADE EMOCIONAL** - Celebre a reconexão emocional. Expressem gratidão por terem encontrado o caminho de volta um para o outro. Gratidão gera reciprocidade.',
          '🗺️ **GATILHO: AUTORIDADE/CONFIANÇA** - Planejem o futuro juntos. Conversem sobre sonhos compartilhados e como vão construir o relacionamento. Planejamento demonstra autoridade.',
          '🎭 **GATILHO: COERÊNCIA** - Criem novos rituais de conexão. Estabeleçam tradições que fortaleçam o vínculo entre vocês. Rituais são coerentes e duradouros.'
        ],
        'indiferente': [
          '📈 **GATILHO: COERÊNCIA** - Prove que a reconexão vale a pena. Demonstre consistentemente o valor que você traz para a vida dela. Valor consistente é coerente.',
          '⏰ **GATILHO: RECIPROCIDADE EMOCIONAL** - Seja paciente com o processo dela. Mulheres indiferentes precisam de tempo para se abrir completamente. Paciência gera reciprocidade.',
          '🚀 **GATILHO: AUTORIDADE/CONFIANÇA** - Mantenha-se interessante. Continue evoluindo e crescendo para que ela nunca se arrependa da escolha. Crescimento contínuo demonstra autoridade.'
        ]
      }
    }
  }

  // Seleção da mensagem baseada no contexto
  const genderKey = isTargetingMale ? 'homem' : 'mulher'
  const messages = messageTemplates[phase]?.[genderKey]?.[exType] || []
  
  if (messages.length === 0) {
    return `Dia ${dayNumber} da fase ${phase}: Continue focando em seu crescimento pessoal e bem-estar emocional. Aplique os gatilhos psicológicos da fase: ${phaseStrategies[phase].triggers.join(', ')}.`
  }

  // Seleção baseada no dia (para consistência)
  const messageIndex = (dayNumber - 1) % messages.length
  let selectedMessage = messages[messageIndex]

  // Ajustes baseados no estado emocional
  if (recentMood === 'muito_triste' || recentConfidence < 3) {
    selectedMessage = `🌱 **PRIMEIRO, CUIDE DE SI:** ${selectedMessage.replace(/\*\*GATILHO:.*?\*\*/, '**AUTOCUIDADO PRIMEIRO**')}`
  } else if (recentMood === 'muito_bem' && recentConfidence > 7) {
    selectedMessage = `🔥 **VOCÊ ESTÁ CONFIANTE - PERFEITO!** ${selectedMessage}`
  }

  return selectedMessage
}

// Geração de tarefas diárias personalizadas com gatilhos psicológicos
export function generateDailyTasks(
  profile: UserProfile,
  dayNumber: number,
  phase: ReconquestPhase
): Array<{ title: string; description: string; points: number }> {
  
  const baseTasks = {
    'Distanciamento': [
      {
        title: '🎯 Gatilho Escassez: Autocuidado Visível',
        description: 'Dedique 30 minutos para exercícios ou atividade física e poste sobre isso. Mostre que você está investindo em si mesmo.',
        points: 15
      },
      {
        title: '🧠 Gatilho Antecipação: Desenvolvimento Pessoal',
        description: 'Leia um capítulo de um livro ou assista um vídeo educativo. Compartilhe uma reflexão interessante nas redes sociais.',
        points: 10
      },
      {
        title: '✨ Gatilho Escassez: Conexões Sociais',
        description: 'Saia com amigos ou familiares e poste fotos se divertindo. Mostre que sua vida social está ativa e interessante.',
        points: 10
      }
    ],
    'Reaproximação': [
      {
        title: '👀 Gatilho Curiosidade: Contato Indireto',
        description: 'Faça um contato sutil através das redes sociais (curtir foto, responder story) ou amigos em comum. Desperte curiosidade.',
        points: 20
      },
      {
        title: '🎁 Gatilho Reciprocidade: Melhoria Pessoal',
        description: 'Trabalhe em algo que você sabe que a pessoa valoriza em você. Demonstre evolução de forma visível.',
        points: 15
      },
      {
        title: '🎭 Gatilho Curiosidade: Presença Social',
        description: 'Apareça em um local ou evento onde há chance de encontrá-la "casualmente". Mantenha interação leve e amigável.',
        points: 15
      }
    ],
    'Atração': [
      {
        title: '💫 Gatilho Emocional: Comunicação Ativa',
        description: 'Tenha uma conversa significativa, mostrando interesse genuíno. Desperte emoções positivas através da conexão.',
        points: 25
      },
      {
        title: '🌟 Gatilho Prova Social: Criar Memórias',
        description: 'Proponha ou participe de uma atividade especial. Mostre que você cria experiências valiosas e únicas.',
        points: 20
      },
      {
        title: '🏆 Gatilho Escassez/Exclusividade: Demonstrar Valor',
        description: 'Mostre uma conquista ou habilidade sua de forma natural. Demonstre que você é uma pessoa valiosa e escassa.',
        points: 15
      }
    ],
    'Reconexão': [
      {
        title: '💝 Gatilho Reciprocidade Emocional: Conversa Profunda',
        description: 'Tenham uma conversa honesta sobre sentimentos e o futuro. Abra seu coração e incentive a reciprocidade.',
        points: 30
      },
      {
        title: '🏗️ Gatilho Autoridade/Confiança: Planejamento Conjunto',
        description: 'Façam planos para algo especial juntos. Demonstre liderança emocional e visão de futuro.',
        points: 25
      },
      {
        title: '🤝 Gatilho Coerência: Compromisso',
        description: 'Demonstre seu comprometimento através de uma ação concreta. Seja consistente entre palavras e ações.',
        points: 20
      }
    ]
  }

  return baseTasks[phase] || []
}

// Análise de compatibilidade para sugestões personalizadas
export function analyzeCompatibility(profile: UserProfile): {
  strengths: string[]
  challenges: string[]
  recommendations: string[]
} {
  const analysis = {
    strengths: [] as string[],
    challenges: [] as string[],
    recommendations: [] as string[]
  }

  // Análise baseada no tipo de ex
  switch (profile.ex_type) {
    case 'emocional':
      analysis.strengths.push('Conexão emocional profunda', 'Capacidade de criar intimidade')
      analysis.challenges.push('Possível instabilidade emocional', 'Necessidade de validação constante')
      analysis.recommendations.push('Foque na estabilidade emocional', 'Demonstre crescimento pessoal', 'Use gatilhos emocionais positivos')
      break
    case 'possessivo':
      analysis.strengths.push('Intensidade dos sentimentos', 'Comprometimento forte')
      analysis.challenges.push('Ciúmes excessivos', 'Necessidade de controle')
      analysis.recommendations.push('Construa confiança gradualmente', 'Demonstre independência saudável', 'Use gatilhos de coerência e autoridade')
      break
    case 'indiferente':
      analysis.strengths.push('Estabilidade emocional', 'Racionalidade nas decisões')
      analysis.challenges.push('Dificuldade de conexão emocional', 'Resistência a mudanças')
      analysis.recommendations.push('Crie valor e interesse', 'Seja paciente e consistente', 'Use gatilhos de escassez e prova social')
      break
  }

  return analysis
}