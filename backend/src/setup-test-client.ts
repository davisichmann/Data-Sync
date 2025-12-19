import { supabase } from './config/supabase';
import dotenv from 'dotenv';
dotenv.config();

async function setupTestClient() {
    console.log('🛠️ Updating Test Client credentials in Supabase...');

    const META_TOKEN = process.env.META_ADS_ACCESS_TOKEN;
    const META_ACCOUNT_ID = process.env.META_ADS_ACCOUNT_ID;

    // Google credentials (even if pending approval, we save them)
    const GOOGLE_REFRESH_TOKEN = '1//04welsLzza9WNCgYIARAAGAQSNwF-L9IrPNg8uoN1T6zD51hmYHvEILzfqoXt41LNsHK9qu_dMSWW9kWgswB91pkDrh8YYyss_CM';
    const GOOGLE_CUSTOMER_ID = '9155275180'; // Test Account ID

    // GA4 Credentials
    const GA4_TOKEN = process.env.GA4_ACCESS_TOKEN;
    const GA4_PROP_ID = process.env.GA4_PROPERTY_ID;
    const GA4_REFRESH_TOKEN = process.env.GA4_REFRESH_TOKEN;

    // Google Sheets
    const SPREADSHEET_ID = '1YyuVZBJoDtdDq8pqLO9bEIoemAIMiccB2F1blE9KIio';

    if (!META_TOKEN || !META_ACCOUNT_ID) {
        console.error('❌ Missing Meta Credentials in .env');
        return;
    }

    // Find the test client (assuming there is only one or we pick the first)
    const { data: clients } = await supabase.from('clients').select('*').limit(1);

    if (!clients || clients.length === 0) {
        console.log('Creating new test client...');
        await supabase.from('clients').insert({
            name: 'Cliente Teste 01',
            meta_ads_access_token: META_TOKEN,
            meta_ads_account_id: META_ACCOUNT_ID,
            google_ads_refresh_token: GOOGLE_REFRESH_TOKEN,
            google_ads_customer_id: GOOGLE_CUSTOMER_ID,
            ga4_access_token: GA4_TOKEN,
            ga4_refresh_token: GA4_REFRESH_TOKEN,
            ga4_property_id: GA4_PROP_ID,
            google_spreadsheet_id: SPREADSHEET_ID
        });
        console.log('✅ Client created with all credentials!');
    } else {
        const client = clients[0];
        console.log(`Updating client: ${client.name} (${client.id})`);

        const { error } = await supabase
            .from('clients')
            .update({
                meta_ads_access_token: META_TOKEN,
                meta_ads_account_id: META_ACCOUNT_ID,
                google_ads_refresh_token: GOOGLE_REFRESH_TOKEN,
                google_ads_customer_id: GOOGLE_CUSTOMER_ID,
                ga4_access_token: GA4_TOKEN,
                ga4_refresh_token: GA4_REFRESH_TOKEN,
                ga4_property_id: GA4_PROP_ID,
                google_spreadsheet_id: SPREADSHEET_ID
            })
            .eq('id', client.id);

        if (error) console.error('Error updating:', error);
        else console.log('✅ Client updated with all credentials (Meta + Google + GA4 + Sheets + Refresh Token)!');
    }
}

setupTestClient();
