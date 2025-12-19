import { supabase } from '../config/supabase';
import { GoogleAdsService } from './googleAdsService';
import { MetaAdsService } from './metaAdsService';
import { Ga4Service } from './ga4Service';
import { SheetsService } from './sheetsService';
import { TokenService } from './tokenService';
import { MonitorService } from './monitorService';
import { HubSpotService } from './hubSpotService';
import { MatchbackService } from './matchbackService';
import { NotificationService } from './notificationService';
import { TikTokService } from './tiktokService';
import { LinkedInService } from './linkedinService';
import { RDStationService } from './rdStationService';

export class SyncService {
    private googleAdsService: GoogleAdsService;
    private ga4Service: Ga4Service;
    private sheetsService: SheetsService;
    private tokenService: TokenService;
    private monitorService: MonitorService;
    private matchbackService: MatchbackService;
    private notificationService: NotificationService;

    constructor() {
        this.googleAdsService = new GoogleAdsService();
        this.ga4Service = new Ga4Service();
        this.sheetsService = new SheetsService();
        this.tokenService = new TokenService();
        this.monitorService = new MonitorService();
        this.matchbackService = new MatchbackService();
        this.notificationService = new NotificationService();
    }

    // Main function to sync a client
    async syncClient(clientId: string, date: string) {
        console.log(`🔄 Starting sync for Client ID: ${clientId} on date ${date}`);

        // 1. Fetch Client Details from Supabase
        const { data: client, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single();

        if (error || !client) {
            console.error(`❌ Client not found: ${error?.message}`);
            return;
        }

        console.log(`👤 Client found: ${client.name}`);

        // --- TOKEN REFRESH LOGIC ---
        let validGa4Token = client.ga4_access_token;

        if (client.ga4_refresh_token) {
            try {
                console.log('🔄 Refreshing GA4/Sheets Access Token...');
                validGa4Token = await this.tokenService.getValidAccessToken(client.ga4_refresh_token);

                // Update new token in DB to keep it fresh
                if (validGa4Token !== client.ga4_access_token) {
                    await supabase.from('clients').update({ ga4_access_token: validGa4Token }).eq('id', clientId);
                    console.log('✅ Access Token refreshed and saved to DB');
                }
            } catch (err: any) {
                console.error('⚠️ Failed to refresh token:', err.message);
                // We continue with the old token, hoping it might still work, or fail gracefully later
                if (client.owner_id) {
                    await this.notificationService.create(
                        client.owner_id,
                        'warning',
                        'Falha ao renovar token',
                        `Não foi possível renovar o token do Google/GA4 para o cliente ${client.name}. Verifique a conexão.`,
                        client.id
                    );
                }
            }
        }
        // ---------------------------

        console.log(`🚀 Starting Sync Cycle for Client: ${client.name} (${client.id})`);

        // Array to hold all sync promises
        const syncPromises: Promise<any>[] = [];

        // 1. Meta Ads
        if (client.meta_ads_access_token && client.meta_ads_account_id) {
            syncPromises.push(this.syncMetaAds(client, date).then(res =>
                res?.data ? res.data.map((d: any) => ({ ...d, platform: 'Meta Ads' })) : []
            ));
        }

        // 2. Google Ads
        if (client.google_ads_customer_id && client.google_ads_refresh_token) {
            syncPromises.push(this.syncGoogleAds(client, date).then(res =>
                res?.data ? res.data.map((d: any) => ({ ...d, platform: 'Google Ads' })) : []
            ));
        }

        // 3. GA4
        if (client.ga4_property_id && validGa4Token) {
            syncPromises.push(this.syncGa4(client, validGa4Token, date).then(res =>
                res?.data ? res.data.map((d: any) => ({ ...d, platform: 'GA4' })) : []
            ));
        }

        // 4. TikTok Ads
        if (client.tiktok_access_token) {
            syncPromises.push(this.syncTikTokAds(client, date).then(res =>
                res?.data ? [res.data].map((d: any) => ({ ...d, platform: 'TikTok Ads' })) : []
            ));
        }

        // 5. LinkedIn Ads
        if (client.linkedin_access_token) {
            syncPromises.push(this.syncLinkedInAds(client, date).then(res =>
                res?.data ? [res.data].map((d: any) => ({ ...d, platform: 'LinkedIn Ads' })) : []
            ));
        }

        // 6. RD Station (CRM)
        if (client.rd_station_token) {
            syncPromises.push((async () => {
                try {
                    console.log('💼 Syncing CRM (RD Station)...');
                    const deals = await RDStationService.getDeals(client.rd_station_token);
                    await this.matchbackService.processDeals(client.id, deals, 'rd_station');
                    await this.logSync(client.id, 'CRM_RD_STATION', 'SUCCESS', deals.length);
                    return []; // CRM data is processed internally, not returned to main data array for sheets yet
                } catch (error: any) {
                    console.error('❌ RD Station Sync Failed:', error.message);
                    await this.logSync(client.id, 'CRM_RD_STATION', 'ERROR', 0, error.message);
                    return [];
                }
            })());
        }

        // 7. HubSpot (CRM)
        if (client.crm_provider === 'hubspot' && client.crm_api_key) {
            syncPromises.push((async () => {
                try {
                    console.log('💼 Syncing CRM (HubSpot)...');
                    const hubSpotService = new HubSpotService(client.crm_api_key);
                    const deals = await hubSpotService.getRecentWonDeals();
                    await this.matchbackService.processDeals(client.id, deals, 'hubspot');
                    await this.logSync(client.id, 'CRM_HUBSPOT', 'SUCCESS', deals.length);
                    return [];
                } catch (error: any) {
                    console.error('❌ HubSpot Sync Failed:', error.message);
                    await this.logSync(client.id, 'CRM_HUBSPOT', 'ERROR', 0, error.message);
                    return [];
                }
            })());
        }

        // EXECUTE ALL IN PARALLEL
        const results = await Promise.allSettled(syncPromises);

        // Aggregate results
        let allData: any[] = [];
        results.forEach(result => {
            if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                allData = [...allData, ...result.value];
            }
        });

        // 8. Export to Google Sheets (if configured)
        if (client.google_spreadsheet_id && allData.length > 0) {
            // Sheets export happens after data collection
            if (validGa4Token) {
                console.log(`📊 Exporting ${allData.length} rows to Google Sheets...`);
                try {
                    await this.sheetsService.exportData(client.google_spreadsheet_id, validGa4Token, allData);
                } catch (err: any) {
                    console.error('❌ Sheets Export Failed:', err.message);
                }
            }
        }

        // 7. Monitor Anomalies (Phase 2 Feature)
        if (allData.length > 0) {
            await this.monitorService.checkAnomalies(clientId, allData);
        }

        // 8. Update Client Last Sync Timestamp
        await supabase
            .from('clients')
            .update({ last_sync_at: new Date().toISOString() })
            .eq('id', clientId);

        console.log(`✅ Sync cycle completed for Client: ${client.name}`);
    }

    private async syncMetaAds(client: any, date: string) {
        try {
            console.log(`🔵 Syncing Meta Ads for ${client.name}...`);

            const metaService = new MetaAdsService(client.meta_ads_access_token);
            const results = await metaService.getDailyMetrics(client.meta_ads_account_id, date);

            await this.logSync(client.id, 'META_ADS', 'SUCCESS', results.data.length);
            console.log(`   -> Success! Fetched ${results.data.length} campaigns.`);

            return results;

        } catch (error: any) {
            console.error(`   -> Failed: ${error.message || error}`);
            await this.logSync(client.id, 'META_ADS', 'ERROR', 0, error.message || JSON.stringify(error));
            if (client.owner_id) {
                await this.notificationService.create(
                    client.owner_id,
                    'error',
                    'Erro no Meta Ads',
                    `Falha ao sincronizar Meta Ads para ${client.name}: ${error.message}`,
                    client.id
                );
            }
            return null;
        }
    }

    private async syncGoogleAds(client: any, date: string) {
        try {
            console.log(`🟢 Syncing Google Ads for ${client.name}...`);

            const results = await this.googleAdsService.getDailyMetrics(
                client.google_ads_customer_id,
                client.google_ads_refresh_token,
                date
            );

            await this.logSync(client.id, 'GOOGLE_ADS', 'SUCCESS', results.data.length);
            console.log(`   -> Success! Fetched ${results.data.length} campaigns.`);

            return results;

        } catch (error: any) {
            console.error(`   -> Failed: ${error.message}`);
            await this.logSync(client.id, 'GOOGLE_ADS', 'ERROR', 0, error.message);
            return null;
        }
    }

    private async syncGa4(client: any, accessToken: string, date: string) {
        try {
            console.log(`🟠 Syncing GA4 for ${client.name}...`);

            const results = await this.ga4Service.getDailyMetrics(
                client.ga4_property_id,
                accessToken,
                date
            );

            await this.logSync(client.id, 'GA4', 'SUCCESS', results.data.length);
            console.log(`   -> Success! Fetched ${results.data.length} rows.`);

            return results;

        } catch (error: any) {
            console.error(`   -> Failed: ${error.message}`);
            await this.logSync(client.id, 'GA4', 'ERROR', 0, error.message);
            return null;
        }
    }

    private async logSync(clientId: string, platform: string, status: string, count: number, errorMsg?: string) {
        const { error } = await supabase.from('sync_logs').insert({
            client_id: clientId,
            platform,
            status,
            records_processed: count,
            error_message: errorMsg
        });

        if (error) console.error('   -> Error saving log:', error.message);
    }

    private async syncTikTokAds(client: any, date: string) {
        try {
            console.log(`🎵 Syncing TikTok Ads for ${client.name}...`);
            const metrics = await TikTokService.getDailyMetrics(client.tiktok_access_token, 'mock_advertiser_id');
            await this.logSync(client.id, 'TIKTOK_ADS', 'SUCCESS', metrics.spend);
            return { success: true, data: metrics };
        } catch (error: any) {
            console.error('❌ TikTok Sync Failed:', error.message);
            await this.logSync(client.id, 'TIKTOK_ADS', 'ERROR', 0, error.message);
            return { success: false, error: error.message };
        }
    }

    private async syncLinkedInAds(client: any, date: string) {
        try {
            console.log(`👔 Syncing LinkedIn Ads for ${client.name}...`);
            const metrics = await LinkedInService.getDailyMetrics(client.linkedin_access_token, 'mock_account_id');
            await this.logSync(client.id, 'LINKEDIN_ADS', 'SUCCESS', metrics.spend);
            return { success: true, data: metrics };
        } catch (error: any) {
            console.error('❌ LinkedIn Sync Failed:', error.message);
            await this.logSync(client.id, 'LINKEDIN_ADS', 'ERROR', 0, error.message);
            return { success: false, error: error.message };
        }
    }
}
