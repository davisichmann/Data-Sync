# 🚀 Guia de Início Rápido - Data Sync Engine

## ⚡ Em 5 Minutos

### Passo 1: Iniciar o Backend
```bash
cd backend
npm run dev
```

Você deve ver:
```
🚀 Data Sync Engine API running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

### Passo 2: Iniciar o Frontend
Em outro terminal:
```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:3000**

### Passo 3: Ver o Dashboard
Clique em **"Acessar Dashboard"** ou vá direto para:
**http://localhost:3000/dashboard**

### Passo 4: Testar Sincronização
No dashboard, clique em **"🔄 Sincronizar"** no cliente de teste.

Ou via API:
```bash
curl -X POST http://localhost:3001/api/sync/89a1502c-93db-4811-a4e3-c0a3f0aa7cce
```

---

## 🎯 Configuração Completa (15 minutos)

### 1. Configurar Google Sheets

#### a) Criar Planilha
1. Vá em [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha
3. Copie o ID da URL (entre `/d/` e `/edit`)
   - Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123XYZ/edit`
   - ID: `1ABC123XYZ`

#### b) Adicionar ao Cliente
```bash
curl -X PATCH http://localhost:3001/api/clients/89a1502c-93db-4811-a4e3-c0a3f0aa7cce \
  -H "Content-Type: application/json" \
  -d '{"google_spreadsheet_id": "SEU_ID_AQUI"}'
```

#### c) Garantir Permissões do Token
O token GA4 precisa ter escopo de Sheets. Para isso:

1. Vá em [OAuth Playground](https://developers.google.com/oauthplayground)
2. Adicione os escopos:
   - `https://www.googleapis.com/auth/analytics.readonly`
   - `https://www.googleapis.com/auth/spreadsheets`
3. Gere novo Access Token
4. Atualize no `.env`:
```bash
GA4_ACCESS_TOKEN=novo_token_aqui
```
5. Rode:
```bash
npm run setup
```

### 2. Configurar Cron Job (Opcional)

#### Opção A: Node-cron (Local/Servidor)
```bash
cd backend
npm install node-cron @types/node-cron
```

Criar `backend/src/cron.ts`:
```typescript
import cron from 'node-cron';
import { SyncService } from './services/syncService';
import { supabase } from './config/supabase';

const syncService = new SyncService();

// Todo dia às 6h
cron.schedule('0 6 * * *', async () => {
  console.log('🕐 Daily sync started');
  
  const { data: clients } = await supabase
    .from('clients')
    .select('id');
  
  const today = new Date().toISOString().split('T')[0];
  
  for (const client of clients || []) {
    try {
      await syncService.syncClient(client.id, today);
    } catch (error) {
      console.error(`Failed for client ${client.id}:`, error);
    }
  }
  
  console.log('✅ Daily sync completed');
});

console.log('⏰ Cron job scheduled: Daily at 6:00 AM');
```

Atualizar `backend/src/index.ts`:
```typescript
import './cron'; // Adicionar no topo
```

#### Opção B: Vercel Cron (Produção)
Criar `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/daily-sync",
    "schedule": "0 6 * * *"
  }]
}
```

Criar endpoint `backend/src/routes/cron.ts`:
```typescript
app.get('/api/cron/daily-sync', async (req, res) => {
  // Verificar secret do Vercel
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Rodar sync...
  res.json({ success: true });
});
```

---

## 🔧 Troubleshooting

### Problema: "Cannot connect to Supabase"
**Solução:**
1. Verifique se as credenciais estão corretas no `.env`
2. Teste a conexão:
```bash
npm run test:db
```

### Problema: "Meta Ads token expired"
**Solução:**
1. Gere novo token no [Graph Explorer](https://developers.facebook.com/tools/explorer/)
2. Atualize no banco:
```bash
curl -X PATCH http://localhost:3001/api/clients/SEU_ID \
  -H "Content-Type: application/json" \
  -d '{"meta_ads_access_token": "NOVO_TOKEN"}'
```

### Problema: "GA4 Access Denied"
**Solução:**
1. Verifique se o token tem o escopo correto
2. Gere novo token com `analytics.readonly`
3. Atualize no `.env` e rode `npm run setup`

### Problema: "Google Ads not working"
**Isso é esperado!** O Google Ads precisa de aprovação "Basic Access".
1. Vá no [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services > Google Ads API
3. Solicite Basic Access
4. Aguarde aprovação (1-3 dias)

---

## 📊 Verificar se Está Funcionando

### 1. Health Check
```bash
curl http://localhost:3001/health
```
Deve retornar: `{"status":"ok"}`

### 2. Ver Clientes
```bash
curl http://localhost:3001/api/clients
```

### 3. Ver Logs
```bash
curl http://localhost:3001/api/logs/89a1502c-93db-4811-a4e3-c0a3f0aa7cce
```

### 4. Disparar Sync Manual
```bash
curl -X POST http://localhost:3001/api/sync/89a1502c-93db-4811-a4e3-c0a3f0aa7cce
```

Depois, verifique os logs novamente para ver o resultado.

---

## 🎨 Personalizar

### Mudar Porta do Backend
No `.env`:
```
PORT=4000
```

### Mudar Horário do Cron
Em `cron.ts`:
```typescript
// Formato: minuto hora dia mês dia-da-semana
cron.schedule('0 6 * * *', ...);  // 6h da manhã
cron.schedule('0 18 * * *', ...); // 6h da tarde
cron.schedule('0 */4 * * *', ...); // A cada 4 horas
```

### Adicionar Novo Cliente
```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agência XYZ",
    "meta_ads_access_token": "EAA...",
    "meta_ads_account_id": "act_123",
    "ga4_property_id": "123456",
    "ga4_access_token": "ya29..."
  }'
```

---

## 🚀 Deploy Rápido

### Backend (Railway)
1. Crie conta em [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Selecione o repositório
4. Adicione variáveis de ambiente do `.env`
5. Deploy!

### Frontend (Vercel)
1. Crie conta em [vercel.com](https://vercel.com)
2. Import Project > GitHub
3. Selecione o repositório
4. Configure:
   - Framework: Next.js
   - Root Directory: `frontend`
5. Deploy!

---

## 📞 Próximos Passos

Agora que está tudo funcionando:

1. ✅ Configure o Google Sheets
2. ✅ Teste com dados reais
3. ✅ Configure o Cron Job
4. ✅ Mostre para um cliente potencial
5. ✅ Faça a primeira venda!

**Boa sorte! 🎉**
