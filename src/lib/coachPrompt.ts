import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function coachPrompt(input: string) {
  const basePrompt = `
  Você é o Coach Amoroso IA — especialista em reconquista e relacionamentos.
  Sua missão é ajudar o usuário a reconquistar o amor com empatia, estratégia e inteligência emocional.
  Retorne SEMPRE em JSON:
  {
    "diagnostico_curto": "",
    "status_emocional": "",
    "mensagem_do_dia": "",
    "checkin_pergunta": "",
    "proximos_passos": ""
  }
  Seja humano, direto e gentil.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: basePrompt },
        { role: "user", content: input },
      ],
      temperature: 0.85,
    });

    const raw = completion.choices[0].message.content ?? "";
    return safeJSON(raw);
  } catch (err: any) {
    console.error("Erro no coachPrompt:", err);
    return {
      diagnostico_curto: "Não consegui gerar uma resposta agora.",
      status_emocional: "Tente novamente em alguns minutos.",
      mensagem_do_dia: "",
      checkin_pergunta: "",
      proximos_passos: "",
    };
  }
}

function safeJSON(text: string) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      diagnostico_curto: text,
      status_emocional: "",
      mensagem_do_dia: "",
      checkin_pergunta: "",
      proximos_passos: "",
    };
  }
}