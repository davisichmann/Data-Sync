"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetsService = void 0;
const googleapis_1 = require("googleapis");
class SheetsService {
    constructor() { }
    // Function to append data to a Google Sheet
    async exportData(spreadsheetId, accessToken, data) {
        try {
            const auth = new googleapis_1.google.auth.OAuth2();
            auth.setCredentials({ access_token: accessToken });
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            // Get the first sheet name
            const spreadsheet = await sheets.spreadsheets.get({
                spreadsheetId,
            });
            const firstSheet = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
            console.log(`   -> Using sheet: "${firstSheet}"`);
            // Prepare the values to append
            const values = data.map(row => [
                row.date,
                row.platform,
                row.campaignName || row.sourceMedium || 'Unknown',
                row.cost || 0,
                row.clicks || row.sessions || 0,
                row.impressions || 0,
                row.conversions || 0,
                row.revenue || 0
            ]);
            if (values.length === 0)
                return;
            const resource = {
                values,
            };
            // Append to the first sheet
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: `${firstSheet}!A:H`,
                valueInputOption: 'USER_ENTERED',
                requestBody: resource,
            });
            console.log(`   -> Exported ${values.length} rows to Google Sheets.`);
        }
        catch (error) {
            console.error(`❌ Error exporting to Google Sheets:`, error.message);
            throw error;
        }
    }
}
exports.SheetsService = SheetsService;
