"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubSpotService = void 0;
const axios_1 = __importDefault(require("axios"));
class HubSpotService {
    constructor(apiKey) {
        this.baseUrl = 'https://api.hubapi.com';
        this.apiKey = apiKey;
    }
    /**
     * Busca Deals fechados (won) recentemente.
     * Inclui propriedades de rastreamento (gclid, fbclid).
     */
    async getRecentWonDeals(limit = 100) {
        try {
            // Buscar deals com propriedades específicas e associações a contatos
            const response = await axios_1.default.post(`${this.baseUrl}/crm/v3/objects/deals/search`, {
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
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.results;
        }
        catch (error) {
            console.error('❌ HubSpot API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch HubSpot deals');
        }
    }
}
exports.HubSpotService = HubSpotService;
