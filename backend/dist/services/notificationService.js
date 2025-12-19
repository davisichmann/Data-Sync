"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
class NotificationService {
    // Cria uma nova notificação
    async create(userId, type, title, message, clientId) {
        const { error } = await supabase
            .from('notifications')
            .insert({
            user_id: userId,
            client_id: clientId,
            type,
            title,
            message
        });
        if (error)
            console.error('Error creating notification:', error);
    }
    // Busca notificações não lidas de um usuário
    async getUnread(userId) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(20);
        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
        return data;
    }
    // Marca todas como lidas
    async markAllRead(userId) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId);
        if (error)
            console.error('Error marking notifications read:', error);
    }
}
exports.NotificationService = NotificationService;
