import { syncAllClientsNow } from './cron';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing manual sync of all clients...\n');

syncAllClientsNow()
    .then(() => {
        console.log('\n✅ Test completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
