import Image from "next/image";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white overflow-hidden">

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span>DataSync</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
          <a href="/pricing" className="hover:text-white transition-colors">Preços</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-slate-300 hover:text-white font-medium text-sm hidden md:block">
            Entrar
          </a>
          <a href="/pricing" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25">
            Começar Agora
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center px-4 pt-16 pb-20 sm:pt-32 text-center">
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] -z-10 opacity-50"></div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 backdrop-blur-xl">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Plataforma SaaS v1.0
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
            Data Sync Engine
          </h1>

          <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
            O fim do "Copy & Paste" para agências. Sincronize <span className="text-blue-400 font-medium">Google Ads</span>, <span className="text-blue-600 font-medium">Meta Ads</span> e <span className="text-yellow-500 font-medium">GA4</span> diretamente para o Google Sheets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <a
              href="/pricing"
              className="px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Ver Planos
            </a>
            <a href="/login" className="px-8 py-3.5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition-all hover:border-zinc-700">
              Acessar Dashboard
            </a>
          </div>
        </div>
      </main>

      {/* Grid Features */}
      <section id="features" className="relative z-10 px-4 py-24 border-t border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Google Ads", color: "from-blue-500/20", desc: "Custo, Cliques, Impressões. Extração diária automatizada via API oficial." },
            { title: "Meta Ads", color: "from-blue-600/20", desc: "Sincronize campanhas do Facebook e Instagram com normalização automática de métricas." },
            { title: "GA4", color: "from-yellow-500/20", desc: "Dados de sessões e conversões amarrados com o custo de mídia. O ROAS real." }
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-2xl border border-zinc-800 bg-gradient-to-br ${item.color} to-zinc-900/0 hover:border-zinc-700 transition-all group`}>
              <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors">{item.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-zinc-900 bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-500 text-sm">
            © 2024 Data Sync Engine. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="/terms" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="mailto:suporte@datasync.com" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div >
  );
}
