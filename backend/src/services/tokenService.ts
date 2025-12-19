import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export class TokenService {
    private oauth2Client;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_ADS_CLIENT_ID,
            process.env.GOOGLE_ADS_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground' // Redirect URL
        );
    }

    /**
     * Obtém um Access Token válido usando o Refresh Token.
     * Se o access token atual expirou, ele gera um novo automaticamente.
     */
    async getValidAccessToken(refreshToken: string): Promise<string> {
        try {
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken
            });

            const { token } = await this.oauth2Client.getAccessToken();

            if (!token) {
                throw new Error('Failed to refresh access token');
            }

            return token;
        } catch (error: any) {
            console.error('❌ Error refreshing token:', error.message);
            throw error;
        }
    }
}
