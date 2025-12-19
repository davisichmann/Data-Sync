-- Adicionar colunas para Monitoramento e Pacing
alter table clients 
add column if not exists budget_monthly numeric, -- Orçamento mensal (ex: 5000.00)
add column if not exists min_daily_spend numeric, -- Alerta se gastar menos que isso (ex: 50.00)
add column if not exists max_daily_spend numeric, -- Alerta se gastar mais que isso (ex: 500.00)
add column if not exists slack_webhook_url text, -- URL para enviar alertas
add column if not exists email_alert_to text; -- Email para enviar alertas
