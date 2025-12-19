"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorService = void 0;
const alertService_1 = require("./alertService");
const supabase_1 = require("../config/supabase");
class MonitorService {
    constructor() {
        this.alertService = new alertService_1.AlertService();
    }
    async checkAnomalies(clientId, dailyData) {
        console.log(`🕵️ Checking anomalies for Client ID: ${clientId}`);
        // 1. Get Client Config
        const { data: client } = await supabase_1.supabase
            .from('clients')
            .select('name, budget_monthly, min_daily_spend, max_daily_spend, slack_webhook_url')
            .eq('id', clientId)
            .single();
        if (!client)
            return;
        // 2. Calculate Totals for Today
        const totalSpend = dailyData.reduce((acc, row) => acc + (Number(row.cost) || 0), 0);
        const totalConversions = dailyData.reduce((acc, row) => acc + (Number(row.conversions) || 0), 0);
        console.log(`   -> Total Spend Today: R$ ${totalSpend.toFixed(2)}`);
        // 3. Check Rules
        // Rule A: Zero Spend (Campanha Parada?)
        // Only alert if min_daily_spend is set and spend is below it
        if (client.min_daily_spend && totalSpend < client.min_daily_spend) {
            const msg = `⚠️ *Baixo Investimento Detectado!*
      \nO cliente *${client.name}* gastou apenas *R$ ${totalSpend.toFixed(2)}* hoje.
      \nMínimo esperado: R$ ${client.min_daily_spend}
      \nVerifique se as campanhas estão ativas ou se houve problema no cartão.`;
            await this.alertService.sendSlackAlert(client.slack_webhook_url, msg, 'danger');
        }
        // Rule B: High Spend (Estouro de Orçamento?)
        if (client.max_daily_spend && totalSpend > client.max_daily_spend) {
            const msg = `🚨 *ALERTA DE GASTO ALTO!*
      \nO cliente *${client.name}* já gastou *R$ ${totalSpend.toFixed(2)}* hoje.
      \nMáximo esperado: R$ ${client.max_daily_spend}
      \nVerifique imediatamente para evitar estouro de budget.`;
            await this.alertService.sendSlackAlert(client.slack_webhook_url, msg, 'danger');
        }
        // Rule C: Pacing Check (Ritmo do Mês)
        if (client.budget_monthly) {
            const today = new Date();
            const dayOfMonth = today.getDate();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const idealSpendPerDay = client.budget_monthly / daysInMonth;
            const idealSpendToDate = idealSpendPerDay * dayOfMonth;
            // Note: In a real app, we would query the DB for the month's total spend.
            // For this MVP, we are just checking daily velocity.
            // If daily spend is 50% higher than ideal daily spend
            if (totalSpend > (idealSpendPerDay * 1.5)) {
                const msg = `📈 *Ritmo Acelerado*
         \nGasto de hoje (R$ ${totalSpend.toFixed(2)}) está 50% acima da média ideal (R$ ${idealSpendPerDay.toFixed(2)}).
         \nNesse ritmo, o budget mensal de R$ ${client.budget_monthly} vai acabar antes do dia ${daysInMonth}.`;
                await this.alertService.sendSlackAlert(client.slack_webhook_url, msg, 'warning');
            }
        }
    }
}
exports.MonitorService = MonitorService;
