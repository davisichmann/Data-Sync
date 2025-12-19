"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class TokenService {
    constructor() {
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_ADS_CLIENT_ID, process.env.GOOGLE_ADS_CLIENT_SECRET, 'https://developers.google.com/oauthplayground' // Redirect URL
        );
    }
    /**
     * Obtém um Access Token válido usando o Refresh Token.
     * Se o access token atual expirou, ele gera um novo automaticamente.
     */
    async getValidAccessToken(refreshToken) {
        try {
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken
            });
            const { token } = await this.oauth2Client.getAccessToken();
            if (!token) {
                throw new Error('Failed to refresh access token');
            }
            return token;
        }
        catch (error) {
            console.error('❌ Error refreshing token:', error.message);
            throw error;
        }
    }
}
exports.TokenService = TokenService;
