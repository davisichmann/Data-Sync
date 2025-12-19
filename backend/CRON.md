# 🕐 Cron Job - Sincronização Automática

## Visão Geral

O sistema de Cron Job automatiza a sincronização diária de dados de todos os clientes cadastrados. Ele roda automaticamente todos os dias às **6:00 AM** (horário de Brasília).

## Como Funciona

### Agendamento Automático

Quando você inicia o servidor com `npm run dev` ou `npm start`, o cron job é automaticamente configurado e agendado.

```bash
npm run dev
```

Você verá no console:
```
🚀 Data Sync Engine API running on http://localhost:3001
📊 Health check: http://localhost:3001/health

⏰ Cron job scheduled: Daily sync at 6:00 AM
⏰ Next run: 10/12/2025 06:00:00
```

### O Que Acontece às 6:00 AM

1. **Busca todos os clientes** cadastrados no banco de dados
2. **Para cada cliente:**
   - Sincroniza Meta Ads (se configurado)
   - Sincroniza Google Ads (se configurado)
   - Sincroniza GA4 (se configurado)
   - Exporta para Google Sheets (se configurado)
   - Salva logs de sucesso/erro no Supabase
3. **Gera relatório** de quantos clientes foram sincronizados com sucesso

### Logs do Cron Job

Durante a execução, você verá logs detalhados:

```
🕐 ============================================
🕐 DAILY SYNC JOB STARTED
🕐 Time: 10/12/2025 06:00:00
🕐 ============================================

📊 Found 3 client(s) to sync

🔄 Syncing: Cliente Teste 01 (uuid-123)
🔵 Syncing Meta Ads for Cliente Teste 01...
   -> Success! Fetched 5 campaigns.
🟠 Syncing GA4 for Cliente Teste 01...
   -> Success! Fetched 10 rows.
✅ Success: Cliente Teste 01

🔄 Syncing: Agência XYZ (uuid-456)
...

🕐 ============================================
🕐 DAILY SYNC JOB COMPLETED
🕐 Success: 3 | Errors: 0
🕐 ============================================
```

## Sincronização Manual

### Via Script de Teste

Para testar a sincronização sem esperar até 6h da manhã:

```bash
npm run test:cron
```

Isso executará a sincronização de todos os clientes imediatamente.

### Via API REST

Você também pode disparar uma sincronização manual via API:

```bash
# Sincronizar todos os clientes
curl -X POST http://localhost:3001/api/sync-all

# Sincronizar um cliente específico
curl -X POST http://localhost:3001/api/sync/CLIENT_ID_HERE
```

## Configuração do Horário

### Alterar o Horário de Execução

Edite o arquivo `backend/src/cron.ts`:

```typescript
// Formato: minuto hora dia mês dia-da-semana

// Exemplos:
cron.schedule('0 6 * * *', ...);   // 6h da manhã (padrão)
cron.schedule('0 18 * * *', ...);  // 6h da tarde
cron.schedule('0 */4 * * *', ...); // A cada 4 horas
cron.schedule('30 8 * * *', ...);  // 8h30 da manhã
cron.schedule('0 9 * * 1', ...);   // 9h toda segunda-feira
```

### Executar Múltiplas Vezes por Dia

```typescript
// Às 6h e às 18h
cron.schedule('0 6,18 * * *', async () => {
  // ...
});

// A cada 6 horas
cron.schedule('0 */6 * * *', async () => {
  // ...
});
```

## Modo de Teste (Desenvolvimento)

Para testar o cron job rodando a cada minuto (útil durante desenvolvimento):

Edite `backend/src/cron.ts` e descomente:

```typescript
export function startTestCron() {
  cron.schedule('* * * * *', async () => {
    console.log('🧪 Test sync running...');
    await syncAllClientsNow();
  });
  console.log('🧪 Test cron: Running every minute');
}
```

Depois, em `backend/src/index.ts`, substitua:
```typescript
startCronJobs(); // Por:
startTestCron();
```

**⚠️ IMPORTANTE:** Não use isso em produção! Pode exceder limites de API.

## Monitoramento

### Verificar Logs no Supabase

Todos os syncs são registrados na tabela `sync_logs`. Para ver o histórico:

```bash
curl http://localhost:3001/api/logs/CLIENT_ID_HERE?limit=50
```

### Dashboard de Status

Acesse o dashboard em `http://localhost:3000/dashboard` para ver:
- Status de cada cliente
- Últimas sincronizações
- Erros recentes

## Tratamento de Erros

O cron job é robusto e continua funcionando mesmo se um cliente falhar:

```typescript
for (const client of clients) {
  try {
    await syncService.syncClient(client.id, today);
    successCount++;
  } catch (error) {
    errorCount++;
    // Continua para o próximo cliente
  }
}
```

Erros são:
1. Logados no console
2. Salvos no banco de dados (`sync_logs`)
3. Não interrompem o processo para outros clientes

## Deploy em Produção

### Opção 1: Servidor Tradicional (Railway, Render, etc.)

O cron job funciona automaticamente. Basta fazer deploy e ele rodará no horário configurado.

```bash
# No servidor
npm start
```

### Opção 2: Vercel (Serverless)

Vercel tem limitações para cron jobs de longa duração. Use Vercel Cron:

Criar `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/daily-sync",
    "schedule": "0 6 * * *"
  }]
}
```

Criar endpoint específico:
```typescript
app.get('/api/cron/daily-sync', async (req, res) => {
  // Verificar secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  await syncAllClientsNow();
  res.json({ success: true });
});
```

### Opção 3: Serviço Externo (Cron-job.org, EasyCron)

Configure um serviço externo para chamar:
```
POST https://sua-api.com/api/sync-all
```

## Notificações (Futuro)

Você pode adicionar notificações quando o sync completar:

```typescript
// Em cron.ts, após o sync:
if (errorCount > 0) {
  // Enviar email/Slack/Discord
  await sendNotification({
    type: 'error',
    message: `${errorCount} clientes falharam no sync diário`
  });
}
```

## FAQ

**P: O cron roda em qual timezone?**  
R: Usa o timezone do servidor. Configure `TZ=America/Sao_Paulo` no `.env` se necessário.

**P: E se o servidor reiniciar?**  
R: O cron é reconfigurado automaticamente quando o servidor inicia.

**P: Posso desabilitar o cron?**  
R: Sim, comente a linha `startCronJobs()` em `index.ts`.

**P: Como saber se o cron está rodando?**  
R: Verifique os logs do servidor ou consulte `sync_logs` no Supabase.

## Comandos Úteis

```bash
# Testar sync manual
npm run test:cron

# Ver logs em tempo real
npm run dev

# Verificar próxima execução
# (Aparece no console quando o servidor inicia)
```

---

**Cron Job configurado e funcionando! 🎉**
