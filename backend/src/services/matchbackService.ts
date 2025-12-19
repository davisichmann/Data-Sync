import { supabase } from '../config/supabase';

export class MatchbackService {

    async processDeals(clientId: string, deals: any[], provider: string) {
        console.log(`💰 Processing ${deals.length} deals for Matchback...`);

        let savedCount = 0;

        for (const deal of deals) {
            // Normalizar dados (exemplo HubSpot)
            const dealData = {
                client_id: clientId,
                external_id: deal.id,
                deal_name: deal.properties.dealname,
                amount: Number(deal.properties.amount) || 0,
                close_date: deal.properties.closedate,
                crm_source: provider,
                // Tentar extrair UTMs ou CLIDs se disponíveis (mock logic for now)
                // Num cenário real, buscaríamos as propriedades mapeadas
                status: 'won'
            };

            // Upsert no banco (evita duplicatas pelo external_id)
            const { error } = await supabase
                .from('sales_data')
                .upsert(dealData, { onConflict: 'client_id, external_id' });

            if (!error) savedCount++;
            else console.error('Error saving deal:', error.message);
        }

        console.log(`✅ Saved/Updated ${savedCount} sales records.`);
        return savedCount;
    }
}
