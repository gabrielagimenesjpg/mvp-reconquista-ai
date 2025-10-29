"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Plan = {
  diagnostico_curto?: string;
  status_emocional?: string;
  mensagem_do_dia?: string;
  checkin_pergunta?: string;
  proximos_passos?: string;
};

function derive(plan: Plan){
  const insight =
    plan?.status_emocional
      ? `Seu estado atual pede ${String(plan.status_emocional).toLowerCase()}. Faça 24–48h de pausa consciente para estabilizar.`
      : "Equilibre emoções por 24–48h antes de reaproximar — isso eleva sua resposta.";
  const proximo =
    plan?.proximos_passos?.trim()
      ? plan.proximos_passos
      : "Hoje (10 min): check-in 1–10 + 1 autocuidado • Amanhã (15 min): redigir Mensagem-Ponte neutra • Em 48h: enviar Script A; se sem resposta em 24h, enviar Script B.";
  return { insight, proximoPasso: proximo };
}

export default function Onboarding(){
  const router = useRouter();
  const [plan, setPlan] = useState<Plan|null>(null);

  useEffect(()=>{
    try {
      const raw = localStorage.getItem("reconquista_last_plan");
      if (raw) setPlan(JSON.parse(raw));
      try { if (window.fbq) window.fbq("track","Lead"); } catch {}
      try { if (window.ttq) window.ttq.track("SubmitForm"); } catch {}
      try { fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"onboarding_view"})}); } catch {}
    } catch {}
  },[]);

  if (!plan) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Quase lá</h1>
        <p className="text-neutral-600 mb-4">Gere seu conselho primeiro.</p>
        <button onClick={()=>router.push("/dashboard")} className="rounded-lg bg-rose-600 text-white px-4 py-2">Voltar</button>
      </main>
    );
  }

  const { insight, proximoPasso } = derive(plan);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-2">Mini-Onboarding</h1>
      <p className="text-neutral-600 mb-6">Um passo prático para consolidar sua primeira vitória.</p>

      <section className="rounded-2xl border bg-white/70 p-5 mb-4">
        <h2 className="text-xl font-bold mb-2">Insight prático</h2>
        <p className="text-neutral-800">{insight}</p>
      </section>

      <section className="rounded-2xl border bg-white p-5 mb-6">
        <h2 className="text-xl font-bold mb-2">Próximo passo</h2>
        <p className="text-neutral-800 mb-4">{proximoPasso}</p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={()=>{ try { if (window.fbq) window.fbq("track","AddToCart"); } catch {};  window.location.href="/journey"; }}
            className="rounded-xl bg-rose-600 text-white px-5 py-3 font-semibold"
          >
            Continuar → ver meu plano de 30 dias
          </button>
          <button
            onClick={()=>{
              try {
                const msg = plan?.mensagem_do_dia || "";
                if (!msg) return alert("Sem mensagem do dia no momento.");
                if (navigator.clipboard?.writeText) { navigator.clipboard.writeText(msg); alert("Mensagem do dia copiada!"); return; }
                const ta = document.createElement("textarea"); ta.value = msg; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); alert("Mensagem do dia copiada!");
              } catch {}
            }}
            className="rounded-xl border px-5 py-3"
          >
            Copiar mensagem do dia
          </button>
        </div>
      </section>

      <button onClick={()=>router.push("/dashboard")} className="text-sm text-neutral-600 underline">← Voltar ao conselho</button>
    </main>
  );
}