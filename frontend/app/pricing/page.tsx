'use client';

import { Check, Zap, Shield, BarChart, CreditCard, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        price: 'R$ 97',
        period: '/mês',
        description: 'Para gestores de tráfego e freelancers iniciantes.',
        limit: 'Até 3 Clientes',
        features: [
            'Sincronização Diária (06:00)',
            'Meta Ads & Google Ads',
            'Export para Google Sheets',
            'Suporte por Email',
            'Sem fidelidade'
        ],
        highlight: false,
        icon: Zap,
        color: 'text-slate-400',
        borderColor: 'border-slate-800'
    },
    {
        id: 'growth',
        name: 'Growth',
        price: 'R$ 297',
        period: '/mês',
        description: 'Para agências que precisam de mais canais e velocidade.',
        limit: 'Até 15 Clientes',
        features: [
            'Tudo do Starter',
            'TikTok Ads & LinkedIn Ads',
            'Atualização a cada 6 horas',
            'Alertas de Orçamento',
            'Suporte Prioritário'
        ],
        highlight: true,
        icon: Rocket,
        color: 'text-blue-400',
        borderColor: 'border-blue-500'
    },
    {
        id: 'scale',
        name: 'Scale',
        price: 'R$ 697',
        period: '/mês',
        description: 'Para grandes operações focadas em ROI e CRM.',
        limit: 'Até 50 Clientes',
        features: [
            'Tudo do Growth',
            'Integração CRM (RD Station/HubSpot)',
            'Google Search Console (SEO)',
            'Analista Virtual (IA)',
            'Gerente de Conta Dedicado'
        ],
        highlight: false,
        icon: BarChart,
        color: 'text-purple-400',
        borderColor: 'border-purple-500'
    }
];

export default function PricingPage() {
    const router = useRouter();

    const handleSubscribe = (planId: string) => {
        const paymentLinks: Record<string, string> = {
            'starter': 'https://buy.stripe.com/test_cNi7sLclz5la5d02yf0co03',
            'growth': 'https://buy.stripe.com/test_4gMdR93P37ti7l84Gn0co04',
            'scale': 'https://buy.stripe.com/test_bJefZh4T75la0WKa0H0co05'
        };

        const link = paymentLinks[planId];

        if (link) {
            toast.loading('Redirecionando para o pagamento seguro...');
            setTimeout(() => {
                window.location.href = link;
            }, 1000);
        } else {
            toast.error('Plano não encontrado.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Escale sua operação sem aumentar a equipe
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Preços simples baseados no tamanho da sua carteira de clientes.
                        Cancele quando quiser.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`
                relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2
                ${plan.highlight
                                    ? 'bg-slate-900/80 border-blue-500 shadow-2xl shadow-blue-500/20'
                                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}
              `}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-blue-500/50">
                                    Mais Escolhido
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-3 rounded-lg bg-slate-800/50 ${plan.color}`}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{plan.limit}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-slate-500">{plan.period}</span>
                                </div>
                            </div>

                            <p className="text-slate-400 mb-8 min-h-[50px] text-sm leading-relaxed">
                                {plan.description}
                            </p>

                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                className={`
                  w-full py-4 rounded-xl font-bold transition-all mb-8 flex items-center justify-center gap-2
                  ${plan.highlight
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'}
                `}
                            >
                                Assinar Agora
                            </button>

                            <div className="flex items-center justify-center gap-3 mb-8 text-[10px] text-slate-500 uppercase tracking-widest">
                                <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Cartão</span>
                                <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                <span>Pix</span>
                                <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                <span>Boleto</span>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-slate-800/50">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                                        <Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-blue-400' : 'text-slate-500'}`} />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-slate-900/30 border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto">
                    <h3 className="text-lg font-semibold text-white mb-2">Precisa de mais de 50 clientes?</h3>
                    <p className="text-slate-400 mb-4 text-sm">
                        Temos planos Enterprise com infraestrutura dedicada e White-label para grandes redes de agências.
                    </p>
                    <a href="mailto:vendas@datasync.com" className="text-blue-400 hover:text-blue-300 font-medium text-sm hover:underline">
                        Falar com Consultor Enterprise &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
}
