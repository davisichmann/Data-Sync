import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Home
                </Link>

                <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidade</h1>

                <div className="space-y-6 text-sm leading-relaxed">
                    <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Coleta de Informações</h2>
                        <p>Coletamos informações que você nos fornece diretamente, como:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Informações de conta (Nome, Email).</li>
                            <li>Credenciais de API (Tokens de acesso) para plataformas de marketing.</li>
                            <li>Dados de desempenho de campanhas (coletados via API).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Uso das Informações</h2>
                        <p>Usamos as informações coletadas para:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Fornecer, manter e melhorar nossos serviços.</li>
                            <li>Processar transações e enviar avisos relacionados.</li>
                            <li>Gerar relatórios e insights de IA personalizados para sua agência.</li>
                            <li>Enviar notificações técnicas, atualizações de segurança e suporte.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Compartilhamento de Dados</h2>
                        <p>Não vendemos seus dados pessoais. Compartilhamos informações apenas nas seguintes circunstâncias:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Com fornecedores de serviços (ex: processamento de pagamentos via Stripe, hospedagem via Vercel/Supabase).</li>
                            <li>Para cumprir obrigações legais.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Segurança de Dados</h2>
                        <p>Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados. Seus tokens de API são armazenados de forma segura e utilizados apenas para a finalidade de sincronização de dados.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Seus Direitos</h2>
                        <p>Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Você pode fazer isso através das configurações da sua conta ou entrando em contato conosco.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Dados do Google e Meta</h2>
                        <p>O uso de informações recebidas das APIs do Google e Meta adere às Políticas de Dados do Usuário dos Serviços de API do Google e Meta, incluindo os requisitos de Uso Limitado.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">7. Contato</h2>
                        <p>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em: privacidade@datasync.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
