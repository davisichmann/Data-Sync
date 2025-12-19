import axios from 'axios';

interface TikTokMetrics {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
}

export const TikTokService = {
    async getDailyMetrics(accessToken: string, advertiserId: string): Promise<TikTokMetrics> {
        try {
            // Em produção, você chamaria: https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/
            // Como não temos um token real agora, vou simular uma resposta da API para não quebrar o sync.

            console.log(`[TikTok] Fetching metrics for advertiser: ${advertiserId}`);

            // Simulação de chamada de API
            // const response = await axios.get('https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/', {
            //     headers: { 'Access-Token': accessToken },
            //     params: { ... }
            // });

            // Mock Data (Simulação)
            return {
                spend: Math.random() * 500, // Gasto simulado
                impressions: Math.floor(Math.random() * 10000),
                clicks: Math.floor(Math.random() * 200),
                conversions: Math.floor(Math.random() * 10)
            };

        } catch (error: any) {
            console.error('[TikTok] Error fetching metrics:', error.message);
            throw new Error('Failed to fetch TikTok metrics');
        }
    }
};
