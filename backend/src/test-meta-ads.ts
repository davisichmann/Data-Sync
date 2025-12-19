import { MetaAdsService } from './services/metaAdsService';
import dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

async function testMetaAds() {
    console.log('📢 Iniciando teste de integração Meta Ads...');

    // NOTE: You need a valid Access Token and Ad Account ID
    // Access Token usually starts with "EAAG..."
    // Ad Account ID usually starts with "act_" followed by numbers
    const ACCESS_TOKEN = process.env.META_ADS_ACCESS_TOKEN || 'INSERT_YOUR_TOKEN_HERE';
    const AD_ACCOUNT_ID = process.env.META_ADS_ACCOUNT_ID || 'act_INSERT_YOUR_ID_HERE';
    const DATE_TO_FETCH = new Date().toISOString().split('T')[0]; // Today

    console.log(`📅 Buscando dados para data: ${DATE_TO_FETCH}`);
    console.log(`🆔 Conta: ${AD_ACCOUNT_ID}`);

    if (!ACCESS_TOKEN || ACCESS_TOKEN.includes('INSERT')) {
        console.error('❌ Access Token não configurado no .env ou no script.');
        return;
    }

    const service = new MetaAdsService(ACCESS_TOKEN);

    try {
        const results = await service.getDailyMetrics(AD_ACCOUNT_ID, DATE_TO_FETCH);
        console.log('✅ Sucesso! Dados recuperados.');
        fs.writeFileSync('meta-ads-result.json', JSON.stringify(results, null, 2));
    } catch (error: any) {
        console.log('⚠️ Teste falhou:');
        console.error(error);
        fs.writeFileSync('meta-ads-error.json', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
}

testMetaAds();
