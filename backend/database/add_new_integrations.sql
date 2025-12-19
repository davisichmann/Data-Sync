-- Adicionar colunas para novas integrações de Ads
ALTER TABLE clients
ADD COLUMN tiktok_access_token TEXT,
ADD COLUMN linkedin_access_token TEXT,
ADD COLUMN pinterest_access_token TEXT;

-- Adicionar colunas para Analytics e SEO
ALTER TABLE clients
ADD COLUMN gsc_site_url TEXT; -- URL do site para o Search Console (usa o mesmo token do Google)

-- Adicionar colunas para CRM/Automação
ALTER TABLE clients
ADD COLUMN rd_station_token TEXT,
ADD COLUMN salesforce_token TEXT;
