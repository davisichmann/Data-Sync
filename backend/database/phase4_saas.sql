-- Adicionar coluna owner_id para vincular clientes ao usuário logado (Agência)
alter table clients 
add column if not exists owner_id uuid;

-- Habilitar Row Level Security (RLS) é uma boa prática, 
-- mas para este MVP vamos filtrar via API Backend para simplificar.

-- Criar tabela de Assinaturas (Simples)
create table if not exists subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null, -- ID do usuário no Supabase Auth
  plan_id text not null, -- 'starter', 'growth', 'scale'
  status text not null, -- 'active', 'canceled', 'past_due'
  stripe_customer_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now()
);
