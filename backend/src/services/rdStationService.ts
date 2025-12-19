import axios from 'axios';

interface RDStationDeal {
    id: string;
    name: string;
    amount_total: number;
    deal_stage_id: string;
}

export const RDStationService = {
    async getDeals(accessToken: string): Promise<RDStationDeal[]> {
        try {
            console.log('[RD Station] Fetching deals...');

            // Endpoint real: https://crm.rdstation.com/api/v1/deals
            // const response = await axios.get('https://crm.rdstation.com/api/v1/deals', {
            //     headers: { 'Authorization': `Bearer ${accessToken}` }
            // });

            // Mock Data
            return [
                {
                    id: 'rd-1',
                    name: 'Contrato Enterprise - Tech',
                    amount_total: 15000,
                    deal_stage_id: 'closed_won'
                },
                {
                    id: 'rd-2',
                    name: 'Consultoria SEO',
                    amount_total: 2500,
                    deal_stage_id: 'negotiation'
                }
            ];

        } catch (error: any) {
            console.error('[RD Station] Error fetching deals:', error.message);
            throw new Error('Failed to fetch RD Station deals');
        }
    }
};
