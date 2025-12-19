"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("./cron");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('🧪 Testing manual sync of all clients...\n');
(0, cron_1.syncAllClientsNow)()
    .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
})
    .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
});
