"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { coachPrompt } from "@/lib/coachPrompt";
import { savePlanSafe } from "@/lib/savePlans";
import { Heart, MessageCircle, Target, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    if (!input.trim()) return alert("Conte sua situação primeiro 💬");
    setLoading(true);
    try {
      const resp = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const result = await resp.json();
      setResponse(result);
      try { localStorage.setItem("reconquista_last_plan", JSON.stringify(result)); } catch {}
      // Se você tiver savePlanSafe ativo, mantenha:
      try { await savePlanSafe(result); } catch {}
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar conselho. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function gotoOnboarding(){
    try { const v = localStorage.getItem("reconquista_last_plan"); if(!v) return alert("Gere seu conselho primeiro ❤️"); } catch {}
    try { if (window.fbq) window.fbq("track","ViewContent"); } catch {}
    try { if (window.ttq) window.ttq.track("ViewContent"); } catch {}
    router.push("/onboarding");
  }

  const handleCopyMessage = () => {
    if (response?.mensagem_do_dia) {
      navigator.clipboard.writeText(response.mensagem_do_dia);
      alert("Mensagem copiada! 💌");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-100 p-6 text-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <div className="text-center">
            <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-rose-600">Reconquista.AI 💘</h1>
            <p className="text-gray-600">Seu coach amoroso inteligente</p>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <MessageCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Conte sua situação amorosa
            </h2>
            <p className="text-gray-600">
              Seja honesto(a) e detalhado(a). Quanto mais informações, melhor será o conselho.
            </p>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
            placeholder="Ex: Terminei com meu namorado há 2 semanas após uma briga. Ainda o amo muito e gostaria de uma segunda chance. Ele não está respondendo minhas mensagens..."
            rows={6}
          />

          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="px-8 py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analisando sua situação...
                </span>
              ) : (
                "Gerar plano personalizado 💌"
              )}
            </button>
          </div>
        </div>

        {/* Response Section */}
        {response && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-rose-600">💞 Seu Conselho Personalizado</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-rose-50 rounded-lg p-4">
                  <h3 className="font-semibold text-rose-700 mb-2 flex items-center gap-2">
                    🩷 Diagnóstico
                  </h3>
                  <p className="text-gray-700">{response.diagnostico_curto}</p>
                </div>

                <div className="bg-pink-50 rounded-lg p-4">
                  <h3 className="font-semibold text-pink-700 mb-2 flex items-center gap-2">
                    💭 Estado Emocional
                  </h3>
                  <p className="text-gray-700">{response.status_emocional}</p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                    ❤️ Check-in Diário
                  </h3>
                  <p className="text-gray-700">{response.checkin_pergunta}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg p-4">
                  <h3 className="font-semibold text-rose-700 mb-2 flex items-center gap-2">
                    📩 Mensagem do Dia
                  </h3>
                  <p className="text-gray-700 mb-3">{response.mensagem_do_dia}</p>
                  <button
                    onClick={handleCopyMessage}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Copiar mensagem 💌
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-rose-100 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    🎯 Próximos Passos
                  </h3>
                  <p className="text-gray-700">{response.proximos_passos}</p>
                </div>
              </div>
            </div>

            {response ? (
              <button
                onClick={gotoOnboarding}
                className="mt-4 w-full md:w-auto rounded-xl bg-rose-600 text-white px-5 py-3 font-semibold"
              >
                Continuar jornada →
              </button>
            ) : null}

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                💡 Lembre-se: a reconquista é um processo. Seja paciente consigo mesmo(a).
              </p>
              <button
                onClick={() => {
                  setInput("");
                  setResponse(null);
                }}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Nova consulta 🔄
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}