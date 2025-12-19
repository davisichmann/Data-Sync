"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
class AiService {
    generateDailyInsights(data) {
        const insights = [];
        // Mock Data Analysis Logic
        // In a real scenario, we would compare 'today' vs 'yesterday' from the DB.
        // Here we use the data passed to generate context-aware messages.
        const metaSpend = data.find((d) => d.platform === 'Meta Ads')?.cost || 0;
        const googleSpend = data.find((d) => d.platform === 'Google Ads')?.cost || 0;
        const totalSpend = metaSpend + googleSpend;
        // 1. Análise de Mix de Mídia
        if (totalSpend > 0) {
            if (metaSpend > googleSpend * 2) {
                insights.push(`🔵 **Meta Ads Dominante:** O Facebook/Instagram está consumindo a maior parte do budget hoje (${Math.round((metaSpend / totalSpend) * 100)}%). Vale verificar se o Google Ads não está limitado.`);
            }
            else if (googleSpend > metaSpend * 2) {
                insights.push(`🟢 **Google Ads Liderando:** O Google está com tração forte hoje. Verifique se o CPA está dentro da meta com esse volume.`);
            }
            else {
                insights.push(`⚖️ **Equilíbrio:** O investimento está bem distribuído entre Meta e Google hoje.`);
            }
        }
        // 2. Análise de Performance (Simulada com Random para Demo Variada)
        // Na produção, compararia com D-1
        const performanceTrend = Math.random();
        if (performanceTrend > 0.7) {
            insights.push(`🚀 **Tendência de Alta:** O volume de conversões está **20% acima da média** das últimas semanas. O criativo "Vídeo Depoimento" parece ser o responsável.`);
        }
        else if (performanceTrend < 0.3) {
            insights.push(`⚠️ **Atenção ao Custo:** O CPC médio subiu ligeiramente nesta tarde. Pode ser aumento de concorrência no leilão.`);
        }
        else {
            insights.push(`✅ **Estabilidade:** As campanhas estão performando dentro do KPI esperado para o dia da semana.`);
        }
        // 3. Insight de Oportunidade
        insights.push(`💡 **Sugestão:** Que tal aumentar o orçamento da campanha de Remarketing em 10% para aproveitar o tráfego do fim de semana?`);
        return {
            general: insights,
            creatives: this.generateCreativeInsights()
        };
    }
    generateCreativeInsights() {
        // Mock de Análise de Criativos (Simulando o que a Vision API faria)
        return [
            {
                type: 'winning_pattern',
                title: '🎥 Vídeos Curtos Dominando',
                description: 'Criativos em vídeo com menos de 15s estão com **CTR 45% maior** que imagens estáticas nesta conta.',
                icon: 'video'
            },
            {
                type: 'losing_pattern',
                title: '❌ Texto Longo em Imagens',
                description: 'Anúncios com muito texto na imagem (mais de 20% da área) estão sofrendo penalidade no alcance. Recomendamos limpar o design.',
                icon: 'image-minus'
            },
            {
                type: 'opportunity',
                title: '🎨 Cores Vibrantes',
                description: 'O padrão visual "Fundo Laranja" está gerando o menor Custo por Lead (CPL). Teste mais variações com essa paleta.',
                icon: 'palette'
            }
        ];
    }
}
exports.AiService = AiService;
