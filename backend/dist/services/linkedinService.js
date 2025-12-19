"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedInService = void 0;
exports.LinkedInService = {
    async getDailyMetrics(accessToken, accountId) {
        try {
            console.log(`[LinkedIn] Fetching metrics for account: ${accountId}`);
            // API: https://api.linkedin.com/v2/adAnalyticsV2
            // Mock Data
            return {
                spend: Math.random() * 1000, // LinkedIn é caro!
                impressions: Math.floor(Math.random() * 5000),
                clicks: Math.floor(Math.random() * 50)
            };
        }
        catch (error) {
            console.error('[LinkedIn] Error fetching metrics:', error.message);
            throw new Error('Failed to fetch LinkedIn metrics');
        }
    }
};
