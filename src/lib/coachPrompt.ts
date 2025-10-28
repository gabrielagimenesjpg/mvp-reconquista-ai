'use server';

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function coachPrompt(message: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Você é um assistente que ajuda em reconquista amorosa com empatia e clareza." },
      { role: "user", content: message },
    ],
  });
  return response.choices[0].message.content;
}