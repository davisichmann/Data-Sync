import { SheetsService } from './services/sheetsService';
import { supabase } from './config/supabase';
import dotenv from 'dotenv';

dotenv.config();

async function testSheetsExport() {
    console.log('📊 Testing Google Sheets Export with Mock Data...\n');

    // Get client from database
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .limit(1);

    if (!clients || clients.length === 0) {
        console.error('❌ No client found');
        return;
    }

    const client = clients[0];
    console.log(`👤 Client: ${client.name}`);
    console.log(`📋 Spreadsheet ID: ${client.google_spreadsheet_id}`);
    console.log(`🔑 Token: ${client.ga4_access_token ? 'Present' : 'Missing'}\n`);

    if (!client.google_spreadsheet_id) {
        console.error('❌ No spreadsheet ID configured');
        return;
    }

    if (!client.ga4_access_token) {
        console.error('❌ No access token (need GA4 token with Sheets scope)');
        return;
    }

    // Create mock data (simulating real campaign data)
    const mockData = [
        {
            date: '2025-12-11',
            platform: 'Meta Ads',
            campaignName: 'Campanha de Conversão - Verão 2025',
            cost: 150.75,
            clicks: 1250,
            impressions: 45000,
            conversions: 23,
            revenue: 0
        },
        {
            date: '2025-12-11',
            platform: 'Meta Ads',
            campaignName: 'Remarketing - Carrinho Abandonado',
            cost: 89.50,
            clicks: 780,
            impressions: 28000,
            conversions: 15,
            revenue: 0
        },
        {
            date: '2025-12-11',
            platform: 'GA4',
            sourceMedium: 'google / cpc',
            campaignName: 'Brand - Pesquisa',
            sessions: 2340,
            clicks: 0,
            impressions: 0,
            conversions: 45,
            revenue: 3450.00
        },
        {
            date: '2025-12-11',
            platform: 'GA4',
            sourceMedium: 'facebook / cpc',
            campaignName: 'Social - Awareness',
            sessions: 1890,
            clicks: 0,
            impressions: 0,
            conversions: 28,
            revenue: 2100.00
        },
        {
            date: '2025-12-11',
            platform: 'Google Ads',
            campaignName: 'Performance Max - Vendas',
            cost: 320.00,
            clicks: 2100,
            impressions: 67000,
            conversions: 52,
            revenue: 0
        }
    ];

    console.log(`📦 Mock data created: ${mockData.length} rows\n`);

    // Export to Sheets
    try {
        const sheetsService = new SheetsService();

        console.log('🚀 Exporting to Google Sheets...');
        await sheetsService.exportData(
            client.google_spreadsheet_id,
            client.ga4_access_token,
            mockData
        );

        console.log('\n✅ SUCCESS! Data exported to Google Sheets!');
        console.log('\n📊 Open your spreadsheet to see the data:');
        console.log(`https://docs.google.com/spreadsheets/d/${client.google_spreadsheet_id}/edit`);
        console.log('\n🎉 Your SaaS is working perfectly!');

    } catch (error: any) {
        console.error('\n❌ Export failed:');
        console.error(error.message);

        if (error.response?.data) {
            console.error('\nAPI Error:', error.response.data);
        }
    }
}

testSheetsExport();
