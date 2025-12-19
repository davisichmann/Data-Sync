import cron from 'node-cron';
import { SyncService } from './services/syncService';
import { supabase } from './config/supabase';

const syncService = new SyncService();

/**
 * Daily Sync Job
 * Runs every day at 6:00 AM (Brazil time)
 * Syncs all active clients automatically
 */
export function startCronJobs() {
    // Schedule: minute hour day month day-of-week
    // '0 6 * * *' = Every day at 6:00 AM
    cron.schedule('0 6 * * *', async () => {
        console.log('\n🕐 ============================================');
        console.log('🕐 DAILY SYNC JOB STARTED');
        console.log('🕐 Time:', new Date().toLocaleString('pt-BR'));
        console.log('🕐 ============================================\n');

        try {
            // Get all active clients
            const { data: clients, error } = await supabase
                .from('clients')
                .select('id, name');

            if (error) {
                console.error('❌ Error fetching clients:', error);
                return;
            }

            if (!clients || clients.length === 0) {
                console.log('⚠️  No clients found to sync');
                return;
            }

            console.log(`📊 Found ${clients.length} client(s) to sync\n`);

            const today = new Date().toISOString().split('T')[0];
            let successCount = 0;
            let errorCount = 0;

            // Sync each client
            for (const client of clients) {
                try {
                    console.log(`\n🔄 Syncing: ${client.name} (${client.id})`);
                    await syncService.syncClient(client.id, today);
                    successCount++;
                    console.log(`✅ Success: ${client.name}`);
                } catch (error: any) {
                    errorCount++;
                    console.error(`❌ Failed: ${client.name}`, error.message);
                }
            }

            console.log('\n🕐 ============================================');
            console.log('🕐 DAILY SYNC JOB COMPLETED');
            console.log(`🕐 Success: ${successCount} | Errors: ${errorCount}`);
            console.log('🕐 ============================================\n');

        } catch (error: any) {
            console.error('❌ Critical error in cron job:', error);
        }
    });

    console.log('⏰ Cron job scheduled: Daily sync at 6:00 AM');
    console.log('⏰ Next run:', getNextRunTime());
}

/**
 * Manual Sync All Clients
 * Useful for testing or manual triggers
 */
export async function syncAllClientsNow() {
    console.log('\n🚀 MANUAL SYNC TRIGGERED\n');

    const { data: clients } = await supabase
        .from('clients')
        .select('id, name');

    if (!clients || clients.length === 0) {
        console.log('⚠️  No clients found');
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    for (const client of clients) {
        try {
            console.log(`\n🔄 Syncing: ${client.name}`);
            await syncService.syncClient(client.id, today);
            console.log(`✅ Success: ${client.name}`);
        } catch (error: any) {
            console.error(`❌ Failed: ${client.name}`, error.message);
        }
    }

    console.log('\n✅ Manual sync completed\n');
}

/**
 * Get next scheduled run time
 */
function getNextRunTime(): string {
    const now = new Date();
    const next = new Date();

    next.setHours(6, 0, 0, 0);

    // If it's past 6 AM today, schedule for tomorrow
    if (now.getHours() >= 6) {
        next.setDate(next.getDate() + 1);
    }

    return next.toLocaleString('pt-BR');
}

// For testing: run sync every minute (uncomment to test)
// export function startTestCron() {
//   cron.schedule('* * * * *', async () => {
//     console.log('🧪 Test sync running...');
//     await syncAllClientsNow();
//   });
//   console.log('🧪 Test cron: Running every minute');
// }
