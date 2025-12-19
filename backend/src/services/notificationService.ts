import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class NotificationService {

    // Cria uma nova notificação
    async create(userId: string, type: 'warning' | 'error' | 'success' | 'info', title: string, message: string, clientId?: string) {
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                client_id: clientId,
                type,
                title,
                message
            });

        if (error) console.error('Error creating notification:', error);
    }

    // Busca notificações não lidas de um usuário
    async getUnread(userId: string) {
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
    async markAllRead(userId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId);

        if (error) console.error('Error marking notifications read:', error);
    }
}
