"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = {
  mensagem_do_dia?: string;
  proximos_passos?: string;
};

export default function Journey(){
  const router = useRouter();
  const sp = useSearchParams();
  const [plan, setPlan] = useState<Plan|null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(()=>{
    try{
      const raw = localStorage.getItem("reconquista_last_plan");
      if (raw) setPlan(JSON.parse(raw));
      const u = localStorage.getItem("journey_unlocked")==="true";
      setUnlocked(u);
      if (sp.get("unlock")==="1"){
        localStorage.setItem("journey_unlocked","true");
        setUnlocked(true);
        try { fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"journey_unlocked"})}); } catch {}
        router.replace("/journey");
      }
      try { if (window.fbq) window.fbq("track","ViewContent"); } catch {}
      try { if (window.ttq) window.ttq.track("ViewContent"); } catch {}
      try { fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"journey_view"})}); } catch {}
    }catch{}
  },[router, sp]);

  const days = useMemo(()=>{
    const items = Array.from({length:30},(_,i)=>({
      day: i+1,
      title: i===0 ? "Dia 1 — Primeira Vitória" : `Dia ${i+1} — ${unlocked ? "Desbloqueado" : "Bloqueado"}`,
      desc: i===0
        ? (plan?.proximos_passos || "Siga o próximo passo sugerido no seu conselho.")
        : (unlocked ? "Ação diária + mensagem + check-in." : "Desbloqueie para ver as ações deste dia.")
    }));
    return items;
  },[plan, unlocked]);

  function goTripwire(){
    try { if (window.fbq) window.fbq("InitiateCheckout"); } catch {}
    try { if (window.ttq) window.ttq.track("InitiateCheckout"); } catch {}
    router.push("/tripwire");
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Meu plano de 30 dias</h1>
      <p className="text-neutral-600 mb-6">
        {unlocked ? "Plano completo desbloqueado." : "O Dia 1 está liberado. Desbloqueie os próximos 29 dias."}
      </p>

      <div className="mb-6">
        <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-2 bg-rose-600" style={{ width: unlocked ? "100%" : `${(1/30)*100}%` }} />
        </div>
        <div className="mt-2 text-sm text-neutral-600">
          {unlocked ? "30/30 dias liberados" : "1/30 dias liberados"}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {days.map((d,idx)=>(
          <div key={d.day}
               className={`rounded-2xl border p-4 ${idx>0 && !unlocked ? "bg-white/60" : "bg-white"}`}
               style={idx>0 && !unlocked ? { filter:"blur(1px)", pointerEvents:"none" } : {}}
          >
            <div className="text-sm text-neutral-500 mb-1">Dia {d.day}</div>
            <div className="font-semibold mb-2">{d.title}</div>
            <div className="text-sm text-neutral-700">{d.desc}</div>
            {d.day===1 && (
              <div className="mt-3 rounded-xl bg-white/70 border p-3">
                <div className="text-xs text-neutral-500 mb-1">Mensagem do dia</div>
                <div className="text-sm">{plan?.mensagem_do_dia || "—"}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!unlocked ? (
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <button onClick={goTripwire} className="rounded-xl bg-rose-600 text-white px-5 py-3 font-semibold">
            Desbloquear meu plano de 30 dias (R$ 47) →
          </button>
          <button onClick={()=>router.push("/guide")} className="rounded-xl border px-5 py-3">
            Ver guia "O que NÃO fazer"
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <button onClick={()=>router.push("/guide")} className="rounded-xl border px-5 py-3">
            Abrir guia "O que NÃO fazer"
          </button>
          <button onClick={()=>alert("Em breve: Coach Amoroso Premium (R$97/mês).")}
                  className="rounded-xl bg-white/70 border px-5 py-3">
            Ativar Coach Amoroso (R$ 97/mês)
          </button>
        </div>
      )}
    </main>
  );
}