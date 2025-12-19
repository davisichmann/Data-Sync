-- Adicionar colunas para GA4
alter table clients 
add column ga4_property_id text,
add column ga4_access_token text;

-- Adicionar coluna para Google Sheets Access Token (opcional, se quisermos separar do GA4)
-- alter table clients add column sheets_access_token text;
