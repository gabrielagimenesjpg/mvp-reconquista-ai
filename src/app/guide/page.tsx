"use client";
import { useEffect, useState } from "react";

const PREVIEW = [
  "Não enviar múltiplas mensagens em sequência.",
  "Não pedir respostas urgentes.",
  "Não justificar-se em excesso.",
];

const FULL = [
  ...PREVIEW,
  "Evitar perguntas de validação (ex.: 'você ainda gosta de mim?').",
  "Não usar ciúmes como gatilho.",
  "Não stalkeie e não comente indiretas.",
  "Evite reabrir brigas antigas sem contexto.",
  "Não prometa mudanças grandiosas sem comprovar ações.",
  "Cuidado com horários inoportunos (madrugada).",
  "Não envolva amigos/família como intermediários.",
];

export default function Guide(){
  const [unlocked, setUnlocked] = useState(false);
  
  useEffect(()=>{
    setUnlocked(localStorage.getItem("journey_unlocked")==="true");
    try { 
      if (window.fbq) window.fbq("track","ViewContent"); 
    } catch {}
    try { 
      fetch("/api/notify",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({type:"guide_view"})
      }); 
    } catch {}
  },[]);
  
  const list = unlocked ? FULL : PREVIEW;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-2">Guia — O que NÃO fazer</h1>
      <p className="text-neutral-600 mb-6">Regras rápidas para não sabotar sua reconquista.</p>
      
      <div className="rounded-2xl border bg-white p-5">
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          {list.map((t,i)=>(<li key={i}>{t}</li>))}
        </ul>
        {!unlocked && (
          <div className="mt-4 text-sm text-neutral-500">
            Prévia exibida. Desbloqueie o plano para ver o guia completo.
          </div>
        )}
      </div>
    </main>
  );
}