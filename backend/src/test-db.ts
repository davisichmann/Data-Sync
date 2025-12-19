import { supabase } from './config/supabase';

async function testConnection() {
    console.log('🔌 Testando conexão com Supabase...');

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Erro ao conectar:', error.message);
    } else {
        console.log('✅ Conexão bem-sucedida! Dados encontrados:', data);
    }
}

testConnection();
