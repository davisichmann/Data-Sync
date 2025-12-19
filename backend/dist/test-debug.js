"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_ads_api_1 = require("google-ads-api");
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
dotenv_1.default.config();
const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET || '';
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '';
const CUSTOMER_ID = '9155275180';
const REFRESH_TOKEN = '1//04welsLzza9WNCgYIARAAGAQSNwF-L9IrPNg8uoN1T6zD51hmYHvEILzfqoXt41LNsHK9qu_dMSWW9kWgswB91pkDrh8YYyss_CM';
async function debug() {
    console.log("🐞 Debugging Google Ads Library...");
    const client = new google_ads_api_1.GoogleAdsApi({
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
    }
    catch (err) {
        console.error("❌ ERRO CAPTURADO:", err);
        // Salva o erro completo em arquivo para leitura
        fs.writeFileSync('debug-error.json', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
        // Tenta escavar o erro interno
        if (err.errors)
            console.log("Detalhes (errors):", JSON.stringify(err.errors, null, 2));
        if (err.response)
            console.log("Detalhes (response):", JSON.stringify(err.response, null, 2));
    }
}
debug();
