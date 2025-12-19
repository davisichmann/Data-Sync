import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Home
                </Link>

                <h1 className="text-3xl font-bold text-white mb-8">Termos de Uso</h1>

                <div className="space-y-6 text-sm leading-relaxed">
                    <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
                        <p>Ao acessar e usar o Data Sync Engine ("Serviço"), você concorda em cumprir estes Termos de Uso. Se você não concordar com algum destes termos, você está proibido de usar ou acessar este site.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Descrição do Serviço</h2>
                        <p>O Data Sync Engine é uma plataforma SaaS que fornece sincronização de dados de marketing, análise de criativos com IA e relatórios automatizados. O serviço é fornecido "como está" e pode ser modificado ou descontinuado a qualquer momento.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Contas e Segurança</h2>
                        <p>Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em notificar imediatamente sobre qualquer uso não autorizado de sua conta. O Data Sync Engine não será responsável por quaisquer perdas decorrentes do uso não autorizado de sua conta.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Uso de Dados e API</h2>
                        <p>Nosso serviço utiliza APIs de terceiros (Meta, Google, etc.). Ao usar nosso serviço, você concorda e reconhece que:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Você tem as permissões necessárias para acessar e compartilhar os dados das contas conectadas.</li>
                            <li>O uso dos dados está sujeito às políticas de privacidade das respectivas plataformas.</li>
                            <li>Não armazenamos dados sensíveis de cartão de crédito em nossos servidores (processamento via Stripe).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Pagamentos e Reembolsos</h2>
                        <p>O serviço é cobrado via assinatura recorrente. Você pode cancelar a qualquer momento através do painel do usuário. Solicitações de reembolso são analisadas caso a caso, conforme nossa política de garantia de satisfação.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Limitação de Responsabilidade</h2>
                        <p>Em nenhum caso o Data Sync Engine ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro) decorrentes do uso ou da incapacidade de usar o serviço.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">7. Contato</h2>
                        <p>Para questões sobre estes termos, entre em contato conosco através do email: suporte@datasync.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
