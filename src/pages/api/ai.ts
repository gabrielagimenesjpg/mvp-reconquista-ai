import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, inputs } = req.body;

    // Substituir variáveis no prompt
    let processedPrompt = prompt;
    if (inputs) {
      Object.entries(inputs).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        processedPrompt = processedPrompt.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    // Simular resposta da IA (em produção, aqui seria a chamada real para OpenAI/Claude)
    const mockResponse = `
<json>
{
  "fase": "Distanciamento",
  "diagnostico_curto": "Situação recente e bloqueio indicam necessidade de espaço para reflexão.",
  "status_emocional": "Momento delicado que requer paciência e autocontrole",
  "acao_sugerida": "Mantenha silêncio estratégico por 7-10 dias e foque no seu bem-estar",
  "mensagem_do_dia": "Às vezes, o silêncio fala mais alto que mil palavras. Dê tempo ao tempo ⏰💙",
  "alertas": ["Evite insistir em contato", "Não reabra discussões antigas"],
  "checkin_pergunta": "Como você está se sentindo hoje em relação ao seu processo de cura?",
  "dia_plano": 1,
  "previsao_proximos_passos": ["Trabalhar autoestima", "Avaliar padrões de relacionamento", "Preparar reaproximação sutil"]
}
</json>

<display>
💔 Diagnóstico: Distanciamento — Situação recente e bloqueio indicam necessidade de espaço para reflexão.
📊 Status: Momento delicado que requer paciência e autocontrole
🎯 Ação sugerida: Mantenha silêncio estratégico por 7-10 dias e foque no seu bem-estar
💬 Mensagem do dia: "Às vezes, o silêncio fala mais alto que mil palavras. Dê tempo ao tempo ⏰💙"
❤️ Check-in: Como você está se sentindo hoje em relação ao seu processo de cura?
</display>
    `;

    res.status(200).send(mockResponse);
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}