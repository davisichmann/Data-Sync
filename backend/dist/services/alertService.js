"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const axios_1 = __importDefault(require("axios"));
class AlertService {
    async sendSlackAlert(webhookUrl, message, type = 'info') {
        if (!webhookUrl)
            return;
        const color = type === 'danger' ? '#FF0000' : type === 'warning' ? '#FFA500' : '#36a64f';
        const emoji = type === 'danger' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';
        try {
            await axios_1.default.post(webhookUrl, {
                text: `${emoji} *Data Sync Alert*`,
                attachments: [
                    {
                        color: color,
                        text: message,
                        footer: "Data Sync Engine Monitor",
                        ts: Math.floor(Date.now() / 1000)
                    }
                ]
            });
            console.log('🔔 Slack alert sent successfully');
        }
        catch (error) {
            console.error('❌ Failed to send Slack alert:', error.message);
        }
    }
}
exports.AlertService = AlertService;
