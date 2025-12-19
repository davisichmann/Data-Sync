import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

// Credentials from previous steps
const REFRESH_TOKEN = '1//04welsLzza9WNCgYIARAAGAQSNwF-L9IrPNg8uoN1T6zD51hmYHvEILzfqoXt41LNsHK9qu_dMSWW9kWgswB91pkDrh8YYyss_CM';
const CUSTOMER_ID = '9155275180';

async function runRawTest() {
    console.log("🔍 Starting RAW HTTP test to Google Ads API...");

    // Step 1: Get Access Token using Refresh Token
    console.log("1️⃣ Refreshing Access Token...");
    let accessToken = '';

    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            grant_type: 'refresh_token'
        });

        accessToken = tokenResponse.data.access_token;
        console.log("✅ Access Token obtained successfully!");
    } catch (err: any) {
        console.error("❌ Failed to get Access Token:", err.response?.data || err.message);
        return;
    }

    // Step 2: Make a search query to Google Ads API
    console.log(`2️⃣ Querying Google Ads API (Customer: ${CUSTOMER_ID})...`);

    const query = `
    SELECT 
      campaign.id, 
      campaign.name, 
      metrics.clicks, 
      metrics.impressions 
    FROM 
      campaign 
    WHERE 
      segments.date DURING TODAY
  `;

    try {
        const url = `https://googleads.googleapis.com/v17/customers/${CUSTOMER_ID}/googleAds:searchStream`;

        const response = await axios.post(url, {
            query: query
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'developer-token': DEVELOPER_TOKEN,
                'login-customer-id': CUSTOMER_ID // Header sometimes needed for MCCs, trying direct first
            }
        });

        console.log("✅ SUCCESS! API Responded:");
        // Google Ads returns a stream of JSON objects
        console.log(JSON.stringify(response.data, null, 2));

    } catch (err: any) {
        console.error("❌ API Call Failed!");
        // Log the full error detail from Google
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", JSON.stringify(err.response.data, null, 2));
        } else {
            console.error("Error:", err.message);
        }
    }
}

runRawTest();
