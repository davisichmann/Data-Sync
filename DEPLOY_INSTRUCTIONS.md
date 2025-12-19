# 🚀 Guia de Deploy (Lançamento)

Este guia contém os passos exatos para colocar o **Data Sync Engine** no ar.

## 1. Banco de Dados (Supabase)
O banco já está na nuvem. Você só precisa das chaves.
Acesse o painel do Supabase > Project Settings > API.

## 2. Backend (Railway)
O Backend é o cérebro. Ele precisa rodar 24/7.

1. Crie uma conta no [Railway](https://railway.app/).
2. Clique em "New Project" > "Deploy from GitHub repo".
3. Selecione o repositório do projeto.
4. **IMPORTANTE:** O Railway vai tentar detectar a raiz. Como temos duas pastas (`frontend` e `backend`), você precisa configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Vá na aba **Variables** e adicione:
   - `SUPABASE_URL`: (Sua URL do Supabase)
   - `SUPABASE_SERVICE_ROLE_KEY`: (Sua chave `service_role` - **NÃO** use a `anon` aqui!)
   - `PORT`: `3001` (ou deixe o Railway atribuir)

## 3. Frontend (Vercel)
O Frontend é o que o cliente vê.

1. Crie uma conta na [Vercel](https://vercel.com/).
2. "Add New..." > "Project".
3. Importe o mesmo repositório do GitHub.
4. Nas configurações de importação:
   - **Root Directory:** Clique em "Edit" e selecione a pasta `frontend`.
   - **Framework Preset:** Next.js (deve detectar automático).
5. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`: (Sua URL do Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Sua chave `anon` / `public`)
   - `NEXT_PUBLIC_API_URL`: A URL que o Railway gerou para o seu backend (ex: `https://backend-production.up.railway.app`). **Sem a barra no final.**

## 4. Conectar os Pontos
Depois que o Backend estiver rodando no Railway, copie a URL dele (ex: `https://xxx.up.railway.app`) e volte na Vercel para atualizar a variável `NEXT_PUBLIC_API_URL`. Redê o deploy no Frontend.

## 5. Stripe (Pagamentos)
Certifique-se de que os Links de Pagamento no arquivo `frontend/app/pricing/page.tsx` são os links de **Produção** (Live Mode) quando for lançar de verdade. Atualmente estão em Test Mode.

---
**Pronto!** Seu SaaS estará online e pronto para escalar. 🚀
