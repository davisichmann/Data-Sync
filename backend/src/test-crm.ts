import { HubSpotService } from './services/hubSpotService';

// ⚠️ COLOQUE SUA CHAVE DE API DO HUBSPOT AQUI PARA TESTAR
// Se for um Private App Token, começa com "pat-na1-..."
const TEST_API_KEY = 'SUA_CHAVE_AQUI';

async function testHubSpotConnection() {
    console.log('💼 Testando Conexão com HubSpot CRM...');

    if (TEST_API_KEY === 'SUA_CHAVE_AQUI') {
        console.error('❌ ERRO: Você precisa editar o arquivo `src/test-crm.ts` e colocar uma chave de API válida do HubSpot na variável TEST_API_KEY.');
        return;
    }

    const hubSpotService = new HubSpotService(TEST_API_KEY);

    try {
        console.log('🔄 Buscando Deals recentes (Closed Won)...');
        const deals = await hubSpotService.getRecentWonDeals(5);

        if (deals.length > 0) {
            console.log(`✅ Sucesso! Encontrados ${deals.length} deals.`);
            console.log('📋 Exemplo do primeiro deal:');
            console.log(JSON.stringify(deals[0], null, 2));
        } else {
            console.log('✅ Conexão bem-sucedida, mas nenhum deal "Closed Won" encontrado recentemente.');
        }

    } catch (error: any) {
        console.error('❌ Falha na conexão:', error.message);
    }
}

testHubSpotConnection();
