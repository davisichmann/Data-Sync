-- Tabela para armazenar seus Clientes (Agências ou Contas finais)
create table clients (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null, -- Nome do Cliente (ex: "Agência X", "E-commerce Y")
  
  -- Configurações de Destino
  google_spreadsheet_id text, -- ID da planilha onde os dados serão salvos
  
  -- Credenciais do Google Ads
  google_ads_customer_id text,
  google_ads_refresh_token text, -- No futuro, criptografar isso!
  
  -- Credenciais do Meta Ads
  meta_ads_account_id text,
  meta_ads_access_token text,
  
  -- Controle de Status
  is_active boolean default true,
  last_sync_at timestamp with time zone
);

-- Tabela para logs de execução (para você saber se funcionou)
create table sync_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references clients(id) not null,
  platform text not null, -- 'GOOGLE_ADS', 'META_ADS', 'GA4'
  status text not null, -- 'SUCCESS', 'ERROR'
  records_processed integer default 0,
  error_message text
);

-- Habilitar RLS (Segurança) - Opcional para o Backend mas boaa prática
alter table clients enable row level security;
alter table sync_logs enable row level security;

-- Inserir um Cliente de Teste (Mock)
insert into clients (name, google_spreadsheet_id, google_ads_customer_id)
values ('Cliente Teste 01', 'substitua_pelo_id_da_planilha', '123-456-7890');
