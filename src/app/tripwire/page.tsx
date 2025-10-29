"use client";

export default function Tripwire(){
  function devUnlock(){
    localStorage.setItem("journey_unlocked","true");
    alert("Plano desbloqueado (dev).");
    window.location.href="/journey";
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-2">Desbloquear meu plano de 30 dias</h1>
      <p className="text-neutral-600 mb-6">
        Liberar Dias 1–30 + Guia completo "O que NÃO fazer" + mensagens por fase (básico).
      </p>

      <div className="rounded-2xl border p-6 bg-white mb-6">
        <h3 className="text-xl font-bold mb-2">O que está incluso</h3>
        <ul className="text-sm space-y-2">
          <li>• Ações diárias (Dias 1–30)</li>
          <li>• Guia completo "O que NÃO fazer"</li>
          <li>• Pacote básico de mensagens por fase</li>
        </ul>
        <div className="flex items-baseline gap-2 mt-4">
          <div className="text-2xl font-extrabold">R$ 47</div>
          <div className="text-xs line-through text-neutral-400">R$ 97</div>
        </div>

        <button
          onClick={devUnlock}
          className="mt-4 w-full rounded-xl border px-5 py-3"
        >
          Já comprei / Desbloquear agora (dev)
        </button>
      </div>

      <p className="text-center text-sm text-neutral-600">
        Depois você poderá ativar o Coach Amoroso Premium (R$ 97/mês).
      </p>
    </main>
  );
}