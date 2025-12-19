import axios from 'axios';

interface LinkedInMetrics {
    spend: number;
    impressions: number;
    clicks: number;
}

export const LinkedInService = {
    async getDailyMetrics(accessToken: string, accountId: string): Promise<LinkedInMetrics> {
        try {
            console.log(`[LinkedIn] Fetching metrics for account: ${accountId}`);

            // API: https://api.linkedin.com/v2/adAnalyticsV2

            // Mock Data
            return {
                spend: Math.random() * 1000, // LinkedIn é caro!
                impressions: Math.floor(Math.random() * 5000),
                clicks: Math.floor(Math.random() * 50)
            };

        } catch (error: any) {
            console.error('[LinkedIn] Error fetching metrics:', error.message);
            throw new Error('Failed to fetch LinkedIn metrics');
        }
    }
};
