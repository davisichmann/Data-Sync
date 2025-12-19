import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { SyncService } from './services/syncService';
import { AiService } from './services/aiService';
import { supabase } from './config/supabase';
import { startCronJobs, syncAllClientsNow } from './cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const syncService = new SyncService();

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all clients
app.get('/api/clients', async (req: Request, res: Response) => {
    try {
        const userId = req.headers['x-user-id'] as string;

        let query = supabase
            .from('clients')
            .select('id, name, last_sync_at, created_at')
            .order('created_at', { ascending: false });

        // If user ID is provided, filter by owner
        if (userId) {
            query = query.eq('owner_id', userId);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get client by ID
app.get('/api/clients/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Don't expose sensitive tokens in the response
        const sanitized = {
            ...data,
            meta_ads_access_token: data.meta_ads_access_token ? '***' : null,
            google_ads_refresh_token: data.google_ads_refresh_token ? '***' : null,
            ga4_access_token: data.ga4_access_token ? '***' : null,
        };

        res.json({ success: true, data: sanitized });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Trigger sync for a specific client
app.post('/api/sync/:clientId', async (req: Request, res: Response) => {
    try {
        const { clientId } = req.params;
        const { date } = req.body;
        const userId = req.headers['x-user-id'] as string;

        // Security Check: Verify ownership
        if (userId) {
            const { data: client } = await supabase
                .from('clients')
                .select('owner_id')
                .eq('id', clientId)
                .single();

            if (!client || client.owner_id !== userId) {
                return res.status(403).json({ success: false, error: 'Unauthorized access to this client' });
            }
        }

        const syncDate = date || new Date().toISOString().split('T')[0];

        console.log(`📡 API: Triggering sync for client ${clientId} on ${syncDate}`);

        // Run sync in background
        syncService.syncClient(clientId, syncDate).catch(err => {
            console.error('Sync error:', err);
        });

        res.json({
            success: true,
            message: 'Sync started',
            clientId,
            date: syncDate
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get sync logs for a client
app.get('/api/logs/:clientId', async (req: Request, res: Response) => {
    try {
        const { clientId } = req.params;
        const { limit = 20 } = req.query;

        const { data, error } = await supabase
            .from('sync_logs')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })
            .limit(Number(limit));

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get latest sync status for all clients
app.get('/api/status', async (req: Request, res: Response) => {
    try {
        const userId = req.headers['x-user-id'] as string;

        let query = supabase
            .from('clients')
            .select('id, name, last_sync_at');

        if (userId) {
            query = query.eq('owner_id', userId);
        }

        const { data: clients, error: clientsError } = await query;

        if (clientsError) throw clientsError;

        // Get latest log for each client
        const statusPromises = clients.map(async (client) => {
            const { data: logs } = await supabase
                .from('sync_logs')
                .select('platform, status, created_at')
                .eq('client_id', client.id)
                .order('created_at', { ascending: false })
                .limit(3);

            return {
                ...client,
                recentLogs: logs || []
            };
        });

        const statuses = await Promise.all(statusPromises);

        res.json({ success: true, data: statuses });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new client
app.post('/api/clients', async (req: Request, res: Response) => {
    try {
        const { name, ...credentials } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Name is required' });
        }

        const { data, error } = await supabase
            .from('clients')
            .insert({ name, ...credentials })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update client credentials
app.patch('/api/clients/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.headers['x-user-id'] as string;

        // Security Check
        if (userId) {
            const { data: client } = await supabase.from('clients').select('owner_id').eq('id', id).single();
            if (!client || client.owner_id !== userId) {
                return res.status(403).json({ success: false, error: 'Unauthorized' });
            }
        }

        const { data, error } = await supabase
            .from('clients')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete client
app.delete('/api/clients/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.headers['x-user-id'] as string;

        // Security Check
        if (userId) {
            const { data: client } = await supabase.from('clients').select('owner_id').eq('id', id).single();
            if (!client || client.owner_id !== userId) {
                return res.status(403).json({ success: false, error: 'Unauthorized' });
            }
        }

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Client deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get AI Insights for a client
app.get('/api/insights/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Fetch recent logs to have some context (Platform usage)
        const { data: logs } = await supabase
            .from('sync_logs')
            .select('*')
            .eq('client_id', id)
            .order('created_at', { ascending: false })
            .limit(10);

        // Transform logs into "Spend Data" mock for the AI service
        const mockData = logs ? logs.map(l => ({
            platform: l.platform.replace('_', ' '), // META_ADS -> Meta Ads
            cost: l.status === 'SUCCESS' ? Math.random() * 500 : 0 // Mock cost based on success
        })) : [];

        const insights = new AiService().generateDailyInsights(mockData);

        res.json({ success: true, data: insights });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Notifications for a user
app.get('/api/notifications', async (req: Request, res: Response) => {
    try {
        const userId = req.headers['x-user-id'] as string;

        if (!userId) {
            return res.json({ success: true, data: [] });
        }

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Manual sync all clients endpoint (for testing/admin)
app.post('/api/sync-all', async (req: Request, res: Response) => {
    try {
        console.log('📡 API: Manual sync all clients triggered');

        // Run in background
        syncAllClientsNow().catch(err => {
            console.error('Sync all error:', err);
        });

        res.json({
            success: true,
            message: 'Sync all clients started'
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Data Sync Engine API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log('');

    // Start cron jobs
    startCronJobs();
});
