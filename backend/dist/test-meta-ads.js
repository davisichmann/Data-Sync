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
const metaAdsService_1 = require("./services/metaAdsService");
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
dotenv_1.default.config();
async function testMetaAds() {
    console.log('📢 Iniciando teste de integração Meta Ads...');
    // NOTE: You need a valid Access Token and Ad Account ID
    // Access Token usually starts with "EAAG..."
    // Ad Account ID usually starts with "act_" followed by numbers
    const ACCESS_TOKEN = process.env.META_ADS_ACCESS_TOKEN || 'INSERT_YOUR_TOKEN_HERE';
    const AD_ACCOUNT_ID = process.env.META_ADS_ACCOUNT_ID || 'act_INSERT_YOUR_ID_HERE';
    const DATE_TO_FETCH = new Date().toISOString().split('T')[0]; // Today
    console.log(`📅 Buscando dados para data: ${DATE_TO_FETCH}`);
    console.log(`🆔 Conta: ${AD_ACCOUNT_ID}`);
    if (!ACCESS_TOKEN || ACCESS_TOKEN.includes('INSERT')) {
        console.error('❌ Access Token não configurado no .env ou no script.');
        return;
    }
    const service = new metaAdsService_1.MetaAdsService(ACCESS_TOKEN);
    try {
        const results = await service.getDailyMetrics(AD_ACCOUNT_ID, DATE_TO_FETCH);
        console.log('✅ Sucesso! Dados recuperados.');
        fs.writeFileSync('meta-ads-result.json', JSON.stringify(results, null, 2));
    }
    catch (error) {
        console.log('⚠️ Teste falhou:');
        console.error(error);
        fs.writeFileSync('meta-ads-error.json', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
}
testMetaAds();
