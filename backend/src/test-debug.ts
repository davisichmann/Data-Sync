import { GoogleAdsApi } from "google-ads-api";
import dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET || '';
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '';

const CUSTOMER_ID = '9155275180';
const REFRESH_TOKEN = '1//04welsLzza9WNCgYIARAAGAQSNwF-L9IrPNg8uoN1T6zD51hmYHvEILzfqoXt41LNsHK9qu_dMSWW9kWgswB91pkDrh8YYyss_CM';

async function debug() {
  console.log("🐞 Debugging Google Ads Library...");

  const client = new GoogleAdsApi({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    developer_token: DEVELOPER_TOKEN,
  });

  // Removing login_customer_id to test direct access again, but with file logging
  const customer = client.Customer({
    customer_id: CUSTOMER_ID,
    refresh_token: REFRESH_TOKEN
  });

  try {
    // Tenta uma query super simples de campanhas
    const result = await customer.query(`
      SELECT 
        campaign.id, 
        campaign.name 
      FROM 
        campaign 
      LIMIT 1
    `);

    console.log("✅ SUCCESSO! Dados:", result);

  } catch (err: any) {
    console.error("❌ ERRO CAPTURADO:", err);

    // Salva o erro completo em arquivo para leitura
    fs.writeFileSync('debug-error.json', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

    // Tenta escavar o erro interno
    if (err.errors) console.log("Detalhes (errors):", JSON.stringify(err.errors, null, 2));
    if (err.response) console.log("Detalhes (response):", JSON.stringify(err.response, null, 2));
  }
}

debug();
