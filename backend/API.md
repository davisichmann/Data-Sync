# Data Sync Engine - API Documentation

Base URL: `http://localhost:3001`

## Endpoints

### Health Check
```http
GET /health
```
Verifica se a API está online.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-10T23:00:00.000Z"
}
```

---

### Get All Clients
```http
GET /api/clients
```
Lista todos os clientes cadastrados.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cliente Teste 01",
      "last_sync_at": "2025-12-10T22:00:00.000Z",
      "created_at": "2025-12-05T10:00:00.000Z"
    }
  ]
}
```

---

### Get Client by ID
```http
GET /api/clients/:id
```
Retorna detalhes de um cliente específico (tokens são mascarados).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Cliente Teste 01",
    "meta_ads_access_token": "***",
    "meta_ads_account_id": "act_123456",
    "google_ads_customer_id": "9155275180",
    "ga4_property_id": "515913607",
    "google_spreadsheet_id": null,
    "last_sync_at": "2025-12-10T22:00:00.000Z"
  }
}
```

---

### Trigger Sync
```http
POST /api/sync/:clientId
```
Dispara uma sincronização para o cliente especificado.

**Body (opcional):**
```json
{
  "date": "2025-12-10"  // Default: hoje
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sync started",
  "clientId": "uuid",
  "date": "2025-12-10"
}
```

---

### Get Sync Logs
```http
GET /api/logs/:clientId?limit=20
```
Retorna o histórico de sincronizações de um cliente.

**Query Parameters:**
- `limit` (optional): Número de logs a retornar (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "client_id": "uuid",
      "platform": "META_ADS",
      "status": "SUCCESS",
      "records_processed": 5,
      "error_message": null,
      "created_at": "2025-12-10T22:00:00.000Z"
    }
  ]
}
```

---

### Get Status Dashboard
```http
GET /api/status
```
Retorna status consolidado de todos os clientes com seus últimos logs.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cliente Teste 01",
      "last_sync_at": "2025-12-10T22:00:00.000Z",
      "recentLogs": [
        {
          "platform": "META_ADS",
          "status": "SUCCESS",
          "created_at": "2025-12-10T22:00:00.000Z"
        },
        {
          "platform": "GA4",
          "status": "SUCCESS",
          "created_at": "2025-12-10T22:00:00.000Z"
        }
      ]
    }
  ]
}
```

---

### Create Client
```http
POST /api/clients
```
Cria um novo cliente.

**Body:**
```json
{
  "name": "Novo Cliente",
  "meta_ads_access_token": "EAA...",
  "meta_ads_account_id": "act_123456",
  "google_ads_customer_id": "9155275180",
  "google_ads_refresh_token": "1//04...",
  "ga4_property_id": "515913607",
  "ga4_access_token": "ya29...",
  "google_spreadsheet_id": "1abc..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "Novo Cliente",
    ...
  }
}
```

---

### Update Client
```http
PATCH /api/clients/:id
```
Atualiza credenciais ou configurações de um cliente.

**Body (partial update):**
```json
{
  "meta_ads_access_token": "new-token",
  "google_spreadsheet_id": "new-sheet-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Cliente Atualizado",
    ...
  }
}
```

---

### Delete Client
```http
DELETE /api/clients/:id
```
Remove um cliente do sistema.

**Response:**
```json
{
  "success": true,
  "message": "Client deleted"
}
```

---

## Error Responses

Todos os endpoints retornam erros no formato:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Status codes:
- `200`: Success
- `400`: Bad Request
- `500`: Internal Server Error

---

## Testing with cURL

```bash
# Health check
curl http://localhost:3001/health

# Get all clients
curl http://localhost:3001/api/clients

# Trigger sync
curl -X POST http://localhost:3001/api/sync/CLIENT_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-12-10"}'

# Get logs
curl http://localhost:3001/api/logs/CLIENT_ID_HERE?limit=10
```

---

## Next Steps

1. Add authentication middleware
2. Implement rate limiting
3. Add request validation
4. Create OpenAPI/Swagger documentation
5. Deploy to production (Vercel, Railway, etc.)
