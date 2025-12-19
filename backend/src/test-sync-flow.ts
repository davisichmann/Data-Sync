import { SyncService } from './services/syncService';
import { supabase } from './config/supabase';
import dotenv from 'dotenv';
dotenv.config();

async function runSyncFlow() {
    console.log('🚀 Starting Full Sync Flow Test...');

    // 1. Get the test client ID
    const { data: clients } = await supabase.from('clients').select('id').limit(1);

    if (!clients || clients.length === 0) {
        console.error('No clients found. Run setup-test-client.ts first.');
        return;
    }

    const clientId = clients[0].id;
    const today = new Date().toISOString().split('T')[0];

    // 2. Run Sync
    const syncService = new SyncService();
    await syncService.syncClient(clientId, today);

    // 3. Verify Logs
    console.log('\n🔎 Verifying Logs in Supabase...');
    const { data: logs } = await supabase
        .from('sync_logs')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(2);

    console.table(logs?.map(l => ({
        platform: l.platform,
        status: l.status,
        records: l.records_processed,
        error: l.error_message ? l.error_message.substring(0, 50) + '...' : 'None'
    })));
}

runSyncFlow();
