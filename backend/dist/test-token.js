"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenService_1 = require("./services/tokenService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function testTokenRefresh() {
    console.log('🔄 Testing Token Refresh Logic...\n');
    const refreshToken = process.env.GA4_REFRESH_TOKEN;
    if (!refreshToken) {
        console.error('❌ No Refresh Token found in .env');
        return;
    }
    console.log('🔑 Refresh Token found:', refreshToken.substring(0, 10) + '...');
    try {
        const tokenService = new tokenService_1.TokenService();
        console.log('⏳ Requesting new Access Token...');
        const newToken = await tokenService.getValidAccessToken(refreshToken);
        console.log('\n✅ SUCCESS! New Access Token generated:');
        console.log(newToken.substring(0, 20) + '...');
        console.log('\n🎉 Token Refresh is working perfectly!');
    }
    catch (error) {
        console.error('\n❌ Token Refresh Failed:', error.message);
    }
}
testTokenRefresh();
