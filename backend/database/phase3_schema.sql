-- Tabela para armazenar dados de vendas (CRM)
create table if not exists sales_data (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references clients(id) on delete cascade,
  external_id text not null, -- ID do Deal no CRM
  deal_name text,
  amount numeric,
  currency text default 'BRL',
  status text, -- 'won', 'lost', etc.
  close_date timestamp with time zone,
  gclid text,
  fbclid text,
  utm_source text,
  utm_campaign text,
  crm_source text, -- 'hubspot', 'salesforce'
  created_at timestamp with time zone default now(),
  unique(client_id, external_id) -- Evitar duplicatas
);

-- Adicionar configurações de CRM na tabela clients
alter table clients 
add column if not exists crm_provider text, -- 'hubspot', 'salesforce'
add column if not exists crm_api_key text, -- Token de acesso
add column if not exists crm_field_mapping jsonb; -- Mapeamento de campos customizados
