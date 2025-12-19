import { MonitorService } from './services/monitorService';
import { supabase } from './config/supabase';
import dotenv from 'dotenv';

dotenv.config();

async function testMonitor() {
    console.log('🕵️ Testing Monitor Service...\n');

    // 1. Setup Mock Client with Monitoring Config
    const { data: clients } = await supabase.from('clients').select('*').limit(1);

    if (!clients || clients.length === 0) {
        console.error('❌ No clients found');
        return;
    }

    const client = clients[0];
    console.log(`👤 Client: ${client.name}`);

    // Update client with test monitoring config (mocking Slack URL for safety or use a real one if provided)
    // For this test, we will just log the alert attempt in the service

    // Mock Data: Low Spend Scenario
    const lowSpendData = [
        { cost: 10.00, conversions: 1 }
    ];

    // Mock Data: High Spend Scenario
    const highSpendData = [
        { cost: 1000.00, conversions: 50 }
    ];

    const monitorService = new MonitorService();

    console.log('\n--- Scenario 1: Low Spend ---');
    // Temporarily update client config in memory (or DB if needed, but let's assume DB has config)
    // For the test to work without DB update, we need to mock the DB response in the service, 
    // but since we can't easily mock imports here, let's update the DB with test config.

    console.log('⚙️ Updating client config for test...');
    await supabase.from('clients').update({
        min_daily_spend: 50.00,
        max_daily_spend: 500.00,
        budget_monthly: 5000.00,
        slack_webhook_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX' // Invalid URL just to test logic flow
    }).eq('id', client.id);

    console.log('🧪 Running checkAnomalies (Low Spend)...');
    await monitorService.checkAnomalies(client.id, lowSpendData);

    console.log('\n--- Scenario 2: High Spend ---');
    console.log('🧪 Running checkAnomalies (High Spend)...');
    await monitorService.checkAnomalies(client.id, highSpendData);

    console.log('\n✅ Monitor test completed (Check console for alert logs)');
}

testMonitor();
