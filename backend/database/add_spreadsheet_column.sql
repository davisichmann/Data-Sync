-- Adicionar coluna para Google Spreadsheet ID
alter table clients 
add column if not exists google_spreadsheet_id text;
