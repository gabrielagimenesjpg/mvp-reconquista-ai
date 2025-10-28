"use client";

import { useState } from "react";
import { Heart, MessageCircle, Target, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Redirecionar para dashboard
      window.location.href = "/dashboard";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Reconquista<span className="text-rose-600">.AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Seu coach amoroso inteligente para reconquistar com 
              <span className="text-rose-600 font-semibold"> empatia, estratégia e inteligência emocional</span>
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12">
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Começar agora 💘
                </button>
              </div>
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <MessageCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Coach IA Personalizado</h3>
              <p className="text-gray-600">
                Análise inteligente da sua situação amorosa com conselhos personalizados e empáticos
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Target className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Estratégias Eficazes</h3>
              <p className="text-gray-600">
                Planos de ação baseados em psicologia e inteligência emocional para reconquistar
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Acompanhamento Diário</h3>
              <p className="text-gray-600">
                Check-ins emocionais e mensagens motivacionais para manter você no caminho certo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="px-6 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Como funciona o Reconquista.AI
          </h2>
          
          <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-8 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <span className="font-semibold">Conte sua situação amorosa</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <span className="font-semibold">Receba análise personalizada da IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <span className="font-semibold">Siga o plano de reconquista</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <span className="font-semibold">Acompanhe seu progresso diário</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-left space-y-3">
                  <h4 className="font-semibold text-rose-600">💞 Exemplo de Conselho:</h4>
                  <p className="text-sm text-gray-700">
                    <strong>🩷 Diagnóstico:</strong> Fase de reflexão pós-término
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>💭 Estado Emocional:</strong> Melancolia com esperança
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>📩 Mensagem do Dia:</strong> "O amor verdadeiro sempre encontra um caminho de volta..."
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>🎯 Próximos Passos:</strong> Trabalhe no autoconhecimento primeiro
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Acessar Dashboard 💘
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Reconquista.AI</h3>
          <p className="text-gray-400 mb-6">
            Transformando relacionamentos com inteligência artificial e muito amor
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-sm text-gray-500">
              © 2024 Reconquista.AI - Feito com ❤️ para reconectar corações
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}