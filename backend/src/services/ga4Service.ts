import axios from 'axios';

export class Ga4Service {

    constructor() { }

    // Get daily metrics for a specific GA4 Property
    async getDailyMetrics(propertyId: string, accessToken: string, date: string) {
        try {
            // GA4 Data API Endpoint
            const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

            const requestBody = {
                dateRanges: [
                    { startDate: date, endDate: date }
                ],
                dimensions: [
                    { name: 'sessionSourceMedium' }, // Source / Medium (e.g., google / cpc)
                    { name: 'campaignName' }
                ],
                metrics: [
                    { name: 'sessions' },
                    { name: 'conversions' }, // Key metric for ROAS
                    { name: 'totalRevenue' }
                ]
            };

            const response = await axios.post(url, requestBody, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Simplify Data
            const rows = response.data.rows || [];

            const simplifiedData = rows.map((row: any) => ({
                sourceMedium: row.dimensionValues[0].value,
                campaignName: row.dimensionValues[1].value,
                sessions: parseInt(row.metricValues[0].value),
                conversions: parseFloat(row.metricValues[1].value),
                revenue: parseFloat(row.metricValues[2].value),
                date: date
            }));

            // Totals
            const totals = simplifiedData.reduce((acc: any, curr: any) => ({
                sessions: acc.sessions + curr.sessions,
                conversions: acc.conversions + curr.conversions,
                revenue: acc.revenue + curr.revenue
            }), { sessions: 0, conversions: 0, revenue: 0 });

            return {
                data: simplifiedData,
                totals: totals
            };

        } catch (error: any) {
            console.error(`❌ Error fetching GA4 data for property ${propertyId}:`, error.response?.data || error.message);
            throw error;
        }
    }
}
