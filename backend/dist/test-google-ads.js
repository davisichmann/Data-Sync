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
const googleAdsService_1 = require("./services/googleAdsService");
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
dotenv_1.default.config();
async function testGoogleAds() {
    console.log('📢 Iniciando teste de integração Google Ads...');
    const service = new googleAdsService_1.GoogleAdsService();
    // NOTE: You need a real Customer ID and a valid Refresh Token for this to work
    // These usually come from the OAuth flow or inserted manually in the DB for testing
    const TEST_CUSTOMER_ID = '9155275180';
    const TEST_REFRESH_TOKEN = '1//04welsLzza9WNCgYIARAAGAQSNwF-L9IrPNg8uoN1T6zD51hmYHvEILzfqoXt41LNsHK9qu_dMSWW9kWgswB91pkDrh8YYyss_CM';
    const DATE_TO_FETCH = new Date().toISOString().split('T')[0]; // Today
    console.log(`📅 Buscando dados para data: ${DATE_TO_FETCH}`);
    try {
        const results = await service.getDailyMetrics(TEST_CUSTOMER_ID, TEST_REFRESH_TOKEN, DATE_TO_FETCH);
        console.log('✅ Sucesso! Dados recuperados:', results);
    }
    catch (error) {
        console.log('⚠️ Teste falhou:');
        console.error(error);
        fs.writeFileSync('error-log.json', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
}
testGoogleAds();
