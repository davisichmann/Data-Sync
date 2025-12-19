import { GoogleAdsApi } from "google-ads-api";

export class GoogleAdsService {
    private client: GoogleAdsApi;

    constructor() {
        const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID || '';
        const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET || '';
        const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '';

        if (!CLIENT_ID || !CLIENT_SECRET || !DEVELOPER_TOKEN) {
            console.warn("⚠️ Google Ads Credentials missing in .env");
        }

        this.client = new GoogleAdsApi({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            developer_token: DEVELOPER_TOKEN,
        });
    }

    // Get daily metrics for a specific customer (account)
    async getDailyMetrics(customerId: string, refreshToken: string, date: string) {
        try {
            const customer = this.client.Customer({
                customer_id: customerId,
                refresh_token: refreshToken,
            });

            // GAQL Query to get Cost, Clicks, and Impressions by Campaign
            // Cost in Google Ads is usually in micros (multiply by 1,000,000 to get currency unit)
            const query = `
        SELECT
          campaign.id,
          campaign.name,
          metrics.cost_micros,
          metrics.clicks,
          metrics.impressions
        FROM
          campaign
        WHERE
          segments.date = '${date}'
      `;

            // Adding explicit type casting or handling if needed by the lib, but usually query returns array directly
            const response = await customer.query(query);

            // Simplify the data for our app
            const simplifiedData = response.map((row: any) => ({
                campaignId: row.campaign?.id,
                campaignName: row.campaign?.name,
                cost: (row.metrics?.cost_micros || 0) / 1000000, // Convert micros to standard currency
                clicks: row.metrics?.clicks || 0,
                impressions: row.metrics?.impressions || 0,
                date: date
            }));

            // Calculate totals
            const totals = simplifiedData.reduce((acc: any, curr: any) => ({
                cost: acc.cost + curr.cost,
                clicks: acc.clicks + curr.clicks,
                impressions: acc.impressions + curr.impressions
            }), { cost: 0, clicks: 0, impressions: 0 });

            return {
                data: simplifiedData,
                totals: totals
            };

        } catch (error: any) {
            // Improved error logging
            console.error(`❌ Error fetching Google Ads data for customer ${customerId}`);
            if (error.errors) {
                console.error("Scrubbed Errors:", JSON.stringify(error.errors, null, 2));
            } else {
                console.error(error.message);
            }
            throw error;
        }
    }
}
