-- Adicionar coluna para GA4 Refresh Token
alter table clients 
add column if not exists ga4_refresh_token text;
