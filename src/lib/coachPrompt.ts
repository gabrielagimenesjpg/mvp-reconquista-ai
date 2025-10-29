'use server';

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function coachPrompt(message: string) {
  try {
    console.log("🔹 Enviando mensagem para o modelo:", message);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um coach amoroso empático, direto e estratégico. Dê conselhos práticos e emocionais para ajudar o usuário a reconquistar o ex ou lidar melhor com o fim do relacionamento.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const output = response.choices?.[0]?.message?.content || "Não foi possível gerar uma resposta.";
    console.log("✅ Resposta da OpenAI:", output);

    return output;
  } catch (error) {
    console.error("❌ Erro ao gerar resposta com OpenAI:", error);
    return "Ocorreu um erro ao gerar seu plano personalizado. Tente novamente em alguns minutos.";
  }
}