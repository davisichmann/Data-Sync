import { Ga4Service } from './services/ga4Service';
import dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

async function testGa4() {
    console.log('📢 Iniciando teste de integração GA4...');

    // NOTE: You need a valid Access Token with 'https://www.googleapis.com/auth/analytics.readonly' scope
    // And a GA4 Property ID (numeric)
    const ACCESS_TOKEN = process.env.GA4_ACCESS_TOKEN || 'INSERT_YOUR_TOKEN_HERE';
    const PROPERTY_ID = process.env.GA4_PROPERTY_ID || 'INSERT_YOUR_PROPERTY_ID_HERE';
    const DATE_TO_FETCH = new Date().toISOString().split('T')[0]; // Today

    console.log(`📅 Buscando dados para data: ${DATE_TO_FETCH}`);
    console.log(`🆔 Propriedade: ${PROPERTY_ID}`);

    if (!ACCESS_TOKEN || ACCESS_TOKEN.includes('INSERT')) {
        console.error('❌ Access Token não configurado no .env ou no script.');
        return;
    }

    const service = new Ga4Service();

    try {
        const results = await service.getDailyMetrics(PROPERTY_ID, ACCESS_TOKEN, DATE_TO_FETCH);
        console.log('✅ Sucesso! Dados recuperados.');
        fs.writeFileSync('ga4-result.json', JSON.stringify(results, null, 2));
    } catch (error: any) {
        console.log('⚠️ Teste falhou:');
        console.error(error);
        fs.writeFileSync('ga4-error.json', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
}

testGa4();
