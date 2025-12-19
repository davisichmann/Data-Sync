const bizSdk = require('facebook-nodejs-business-sdk');
const FacebookAdsApi = bizSdk.FacebookAdsApi;
const AdAccount = bizSdk.AdAccount;

export class MetaAdsService {
    private api: any;

    constructor(accessToken: string) {
        // Initialize the API with the access token
        this.api = FacebookAdsApi.init(accessToken);
    }

    // Get daily metrics for a specific account
    async getDailyMetrics(adAccountId: string, date: string) {
        try {
            const account = new AdAccount(adAccountId);

            // Define the fields we want to fetch
            const fields = [
                'campaign_name',
                'campaign_id',
                'spend',
                'clicks',
                'impressions',
                'actions' // Conversions are inside actions
            ];

            // Define the parameters (date range)
            const params = {
                'time_range': {
                    'since': date,
                    'until': date
                },
                'level': 'campaign',
                'limit': 100
            };

            // Fetch insights
            const insights = await account.getInsights(fields, params);

            // Simplify the data
            const simplifiedData = insights.map((row: any) => {
                // Find conversion count (usually 'purchase' or 'lead' action types)
                // For now, we sum all actions as "conversions" or look for specific ones if needed
                const conversions = row.actions ? row.actions.reduce((acc: number, action: any) => {
                    // You can filter by action.action_type here (e.g., 'purchase', 'lead')
                    return acc + parseInt(action.value);
                }, 0) : 0;

                return {
                    campaignId: row.campaign_id,
                    campaignName: row.campaign_name,
                    cost: parseFloat(row.spend || '0'),
                    clicks: parseInt(row.clicks || '0'),
                    impressions: parseInt(row.impressions || '0'),
                    conversions: conversions,
                    date: date
                };
            });

            // Calculate totals
            const totals = simplifiedData.reduce((acc: any, curr: any) => ({
                cost: acc.cost + curr.cost,
                clicks: acc.clicks + curr.clicks,
                impressions: acc.impressions + curr.impressions,
                conversions: acc.conversions + curr.conversions
            }), { cost: 0, clicks: 0, impressions: 0, conversions: 0 });

            return {
                data: simplifiedData,
                totals: totals
            };

        } catch (error: any) {
            console.error(`❌ Error fetching Meta Ads data for account ${adAccountId}:`, error);
            throw error;
        }
    }
}
