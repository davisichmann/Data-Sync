import { TokenService } from './services/tokenService';
import dotenv from 'dotenv';

dotenv.config();

async function testTokenRefresh() {
    console.log('🔄 Testing Token Refresh Logic...\n');

    const refreshToken = process.env.GA4_REFRESH_TOKEN;

    if (!refreshToken) {
        console.error('❌ No Refresh Token found in .env');
        return;
    }

    console.log('🔑 Refresh Token found:', refreshToken.substring(0, 10) + '...');

    try {
        const tokenService = new TokenService();
        console.log('⏳ Requesting new Access Token...');

        const newToken = await tokenService.getValidAccessToken(refreshToken);

        console.log('\n✅ SUCCESS! New Access Token generated:');
        console.log(newToken.substring(0, 20) + '...');
        console.log('\n🎉 Token Refresh is working perfectly!');

    } catch (error: any) {
        console.error('\n❌ Token Refresh Failed:', error.message);
    }
}

testTokenRefresh();
