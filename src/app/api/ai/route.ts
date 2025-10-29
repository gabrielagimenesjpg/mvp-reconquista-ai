import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input = "" } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const r = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "Você é um coach amoroso empático, direto e estratégico. Sempre responda em JSON com as chaves: diagnostico_curto, status_emocional, mensagem_do_dia, checkin_pergunta, proximos_passos.",
        },
        { role: "user", content: String(input) },
      ],
    });

    const raw = r.choices?.[0]?.message?.content ?? "";
    // Tenta parsear JSON; se vier texto solto, devolve mapeado
    try {
      const json = JSON.parse(raw.replace(/```json|```/g, "").trim());
      return NextResponse.json(json);
    } catch {
      return NextResponse.json({
        diagnostico_curto: raw,
        status_emocional: "",
        mensagem_do_dia: "",
        checkin_pergunta: "",
        proximos_passos: "",
      });
    }
  } catch (e: any) {
    console.error("api/ai error:", e?.message || e);
    return NextResponse.json(
      {
        diagnostico_curto: "Não consegui gerar agora.",
        status_emocional: "Tente novamente em instantes.",
        mensagem_do_dia: "",
        checkin_pergunta: "",
        proximos_passos: "",
        _error: e?.message || "AI_ERROR",
      },
      { status: 500 }
    );
  }
}