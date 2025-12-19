import axios from 'axios';

export class HubSpotService {
    private apiKey: string;
    private baseUrl = 'https://api.hubapi.com';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Busca Deals fechados (won) recentemente.
     * Inclui propriedades de rastreamento (gclid, fbclid).
     */
    async getRecentWonDeals(limit = 100) {
        try {
            // Buscar deals com propriedades específicas e associações a contatos
            const response = await axios.post(
                `${this.baseUrl}/crm/v3/objects/deals/search`,
                {
                    filterGroups: [
                        {
                            filters: [
                                {
                                    propertyName: 'dealstage',
                                    operator: 'EQ',
                                    value: 'closedwon' // Você pode precisar ajustar isso dependendo do pipeline do cliente
                                }
                            ]
                        }
                    ],
                    properties: ['dealname', 'amount', 'closedate', 'pipeline', 'dealstage'],
                    limit,
                    sorts: [
                        {
                            propertyName: 'closedate',
                            direction: 'DESCENDING'
                        }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.results;
        } catch (error: any) {
            console.error('❌ HubSpot API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch HubSpot deals');
        }
    }
}
