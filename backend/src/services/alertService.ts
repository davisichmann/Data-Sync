import axios from 'axios';

export class AlertService {

    async sendSlackAlert(webhookUrl: string, message: string, type: 'danger' | 'warning' | 'info' = 'info') {
        if (!webhookUrl) return;

        const color = type === 'danger' ? '#FF0000' : type === 'warning' ? '#FFA500' : '#36a64f';
        const emoji = type === 'danger' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';

        try {
            await axios.post(webhookUrl, {
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
        } catch (error: any) {
            console.error('❌ Failed to send Slack alert:', error.message);
        }
    }
}
