"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("./config/supabase");
async function testNotificationsTable() {
    console.log('🔍 Verificando tabela de notificações...');
    // 1. Tentar inserir uma notificação de teste
    // Usamos um UUID aleatório para user_id apenas para testar a inserção (se não tiver FK constraint estrita ou se tivermos um user válido)
    // Para evitar erro de FK (Foreign Key) se a tabela users estiver vazia ou restrita, vamos tentar apenas um SELECT primeiro para ver se a tabela existe.
    // Melhor abordagem: Tentar listar as notificações. Se a tabela não existir, vai dar erro.
    const { data, error } = await supabase_1.supabase
        .from('notifications')
        .select('*')
        .limit(1);
    if (error) {
        console.error('❌ Erro ao acessar tabela notifications:');
        console.error(error.message);
        console.log('\n⚠️  Parece que a tabela NÃO foi criada ou há um problema de permissão.');
        console.log('Dica: Verifique se rodou o script SQL no Supabase.');
    }
    else {
        console.log('✅ Tabela `notifications` encontrada com sucesso!');
        console.log(`📊 Registros atuais: ${data.length}`);
        console.log('\n🎉 O Banco de Dados está pronto e sincronizado!');
    }
}
testNotificationsTable();
