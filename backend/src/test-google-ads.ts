import { GoogleAdsService } from './services/googleAdsService';
import dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

async function testGoogleAds() {
    console.log('📢 Iniciando teste de integração Google Ads...');

    const service = new GoogleAdsService();

    // NOTE: You need a real Customer ID and a valid Refresh Token for this to work
    // These usually come from the OAuth flow or inserted manually in the DB for testing
    const TEST_CUSTOMER_ID = '9155275180';
    const TEST_REFRESH_TOKEN = '1//04welsLzza9WNCgYIARAAGAQSNwF-L9IrPNg8uoN1T6zD51hmYHvEILzfqoXt41LNsHK9qu_dMSWW9kWgswB91pkDrh8YYyss_CM';
    const DATE_TO_FETCH = new Date().toISOString().split('T')[0]; // Today

    console.log(`📅 Buscando dados para data: ${DATE_TO_FETCH}`);

    try {
        const results = await service.getDailyMetrics(TEST_CUSTOMER_ID, TEST_REFRESH_TOKEN, DATE_TO_FETCH);
        console.log('✅ Sucesso! Dados recuperados:', results);
    } catch (error: any) {
        console.log('⚠️ Teste falhou:');
        console.error(error);
        fs.writeFileSync('error-log.json', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
}

testGoogleAds();
