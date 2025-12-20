'use client';

import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    RefreshCw,
    Users,
    Activity,
    CheckCircle2,
    Clock,
    Search,
    LogOut,
    Settings,
    BarChart3,
    X,
    Save,
    Bell,
    Sparkles,
    Bot,
    CreditCard,
    ArrowRight,
    Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Client {
    id: string;
    name: string;
    last_sync_at: string | null;
    budget_monthly?: number;
    min_daily_spend?: number;
    max_daily_spend?: number;
    slack_webhook_url?: string;
    crm_provider?: string;
    crm_api_key?: string;
    meta_ads_access_token?: string;
    google_ads_refresh_token?: string;
    tiktok_access_token?: string;
    linkedin_access_token?: string;
    rd_station_token?: string;
    recentLogs: Array<{
        platform: string;
        status: string;
        created_at: string;
    }>;
}

export default function DashboardPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // AI Insights State
    const [aiInsights, setAiInsights] = useState<any>({ general: [], creatives: [] });
    const [loadingAi, setLoadingAi] = useState(false);

    // Modal State
    // Modal State
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState<string | null>(null); // 'meta' | 'google' | 'ga4' | null
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    // Notifications State
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    // Fetch AI insights for the first client when clients are loaded
    useEffect(() => {
        if (clients.length > 0) {
            fetchAiInsights(clients[0].id);
        }
    }, [clients]);

    // Fetch Notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id;

                if (!userId) return;

                const res = await fetch('http://localhost:3001/api/notifications', {
                    headers: { 'x-user-id': userId }
                });
                const data = await res.json();

                if (data.success) {
                    setNotifications(data.data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        // Poll every 60 seconds for new alerts
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchStatus = async () => {
        try {
            // Get current user for multi-tenancy
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            const headers: any = {};
            if (userId) {
                headers['x-user-id'] = userId;
            }

            const res = await fetch('http://localhost:3001/api/status', { headers }); // Note: api/status also needs update or use api/clients
            // Actually, the dashboard uses /api/status which returns clients + logs. 
            // We need to update /api/status in backend too, OR change this to use /api/clients and fetch logs separately.
            // For MVP speed, let's assume /api/status will also be updated to support filtering.

            const data = await res.json();
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            console.error('Error fetching status:', error);
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const fetchAiInsights = async (clientId: string) => {
        setLoadingAi(true);
        try {
            const res = await fetch(`http://localhost:3001/api/insights/${clientId}`);
            const data = await res.json();
            if (data.success) {
                setAiInsights(data.data);
            }
        } catch (error) {
            console.error('Error fetching AI insights:', error);
        } finally {
            setLoadingAi(false);
        }
    };

    const triggerSync = async (clientId: string) => {
        setSyncing(clientId);
        const promise = fetch(`http://localhost:3001/api/sync/${clientId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }).then(async (res) => {
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            return data;
        });

        toast.promise(promise, {
            loading: 'Iniciando sincronização...',
            success: () => {
                setTimeout(fetchStatus, 2000);
                // Refresh AI insights too
                setTimeout(() => fetchAiInsights(clientId), 3000);
                return 'Sincronização iniciada! Os dados aparecerão em breve.';
            },
            error: 'Erro ao iniciar sincronização',
        });

        promise.finally(() => setSyncing(null));
    };

    const openConfig = (client: Client) => {
        setEditingClient({ ...client });
        setIsConfigOpen(true);
    };

    const saveConfig = async () => {
        if (!editingClient) return;

        const promise = fetch(`http://localhost:3001/api/clients/${editingClient.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                budget_monthly: editingClient.budget_monthly,
                min_daily_spend: editingClient.min_daily_spend,
                max_daily_spend: editingClient.max_daily_spend,
                slack_webhook_url: editingClient.slack_webhook_url,
                crm_provider: editingClient.crm_provider,
                crm_api_key: editingClient.crm_api_key,
                meta_ads_access_token: editingClient.meta_ads_access_token,
                google_ads_refresh_token: editingClient.google_ads_refresh_token,
                tiktok_access_token: editingClient.tiktok_access_token,
                linkedin_access_token: editingClient.linkedin_access_token,
                rd_station_token: editingClient.rd_station_token
            })
        }).then(async (res) => {
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            return data;
        });

        toast.promise(promise, {
            loading: 'Salvando configurações...',
            success: () => {
                setIsConfigOpen(false);
                fetchStatus();
                return 'Configurações salvas com sucesso!';
            },
            error: 'Erro ao salvar configurações',
        });
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSyncs = clients.reduce((acc, c) => acc + c.recentLogs.length, 0);
    const successRate = clients.length > 0
        ? Math.round((clients.reduce((acc, c) => acc + c.recentLogs.filter(l => l.status === 'SUCCESS').length, 0) / totalSyncs) * 100) || 0
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-950 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-xl">
                        <Activity className="w-6 h-6" />
                        <span>DataSync</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Clientes</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg transition-colors">
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-medium">Relatórios</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg w-full transition-colors"
                    >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                        <span className="font-medium">Meu Perfil</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Topbar */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between px-8">
                    <h2 className="text-slate-200 font-semibold">Visão Geral</h2>
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative"
                            >
                                <Bell className="w-5 h-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                        <h3 className="font-bold text-white text-sm">Notificações</h3>
                                        <span className="text-xs text-slate-500">{notifications.length} novas</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div key={notif.id} className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'warning' ? 'bg-yellow-500' :
                                                            notif.type === 'error' ? 'bg-red-500' :
                                                                'bg-green-500'
                                                            }`} />
                                                        <div>
                                                            <h4 className="text-sm font-medium text-slate-200">{notif.title}</h4>
                                                            <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                                                            <span className="text-[10px] text-slate-600 mt-2 block">
                                                                {new Date(notif.created_at).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-slate-500 text-sm">
                                                Nenhuma notificação nova.
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 bg-slate-950 text-center">
                                        <button className="text-xs text-blue-400 hover:text-blue-300">Marcar todas como lidas</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Olá, Admin 👋</h1>
                        <p className="text-slate-400">Aqui está o resumo das suas sincronizações de hoje.</p>
                    </div>

                    {/* AI Insights & Creative Analysis Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Daily Briefing */}
                        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Bot className="w-32 h-32 text-indigo-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                                    <h3 className="text-lg font-bold text-white">Analista Virtual (Beta)</h3>
                                </div>

                                {loadingAi ? (
                                    <div className="space-y-2 animate-pulse">
                                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {aiInsights?.general?.length > 0 ? (
                                            aiInsights.general.map((insight: string, idx: number) => (
                                                <div key={idx} className="flex items-start gap-3 text-slate-200 bg-black/20 p-3 rounded-lg backdrop-blur-sm text-sm">
                                                    <div dangerouslySetInnerHTML={{
                                                        __html: insight.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-white">$1</span>')
                                                    }} />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 text-sm">Nenhum insight disponível. Sincronize para gerar.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Creative Intelligence */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
                            <div className="flex items-center gap-2 mb-4 text-pink-400">
                                <LayoutDashboard className="w-5 h-5" />
                                <h3 className="text-lg font-bold text-white">Inteligência Criativa 🎨</h3>
                            </div>

                            {loadingAi ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-20 bg-slate-800 rounded-lg"></div>
                                    <div className="h-20 bg-slate-800 rounded-lg"></div>
                                </div>
                            ) : (
                                <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                    {aiInsights?.creatives?.length > 0 ? (
                                        aiInsights.creatives.map((creative: any, idx: number) => (
                                            <div key={idx} className={`
                                                p-4 rounded-xl border flex gap-4
                                                ${creative.type === 'winning_pattern' ? 'bg-green-500/5 border-green-500/20' :
                                                    creative.type === 'losing_pattern' ? 'bg-red-500/5 border-red-500/20' :
                                                        'bg-blue-500/5 border-blue-500/20'}
                                            `}>
                                                <div className={`
                                                    w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                                    ${creative.type === 'winning_pattern' ? 'bg-green-500/10 text-green-400' :
                                                        creative.type === 'losing_pattern' ? 'bg-red-500/10 text-red-400' :
                                                            'bg-blue-500/10 text-blue-400'}
                                                `}>
                                                    {creative.type === 'winning_pattern' && <CheckCircle2 className="w-5 h-5" />}
                                                    {creative.type === 'losing_pattern' && <X className="w-5 h-5" />}
                                                    {creative.type === 'opportunity' && <Sparkles className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-200 text-sm mb-1">{creative.title}</h4>
                                                    <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{
                                                        __html: creative.description.replace(/\*\*(.*?)\*\*/g, '<span class="text-slate-200 font-semibold">$1</span>')
                                                    }} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm text-center">
                                            <p>Sem dados de criativos suficientes.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users className="w-24 h-24 text-blue-500" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-400 font-medium mb-1">Clientes Ativos</p>
                                <h3 className="text-4xl font-bold text-white">{clients.length}</h3>
                                <div className="mt-4 flex items-center gap-2 text-sm text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded-full">
                                    <Activity className="w-3 h-3" />
                                    <span>Todos ativos</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <RefreshCw className="w-24 h-24 text-purple-500" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-400 font-medium mb-1">Syncs Realizados</p>
                                <h3 className="text-4xl font-bold text-white">{totalSyncs}</h3>
                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                                    <span>Últimas 24h</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle2 className="w-24 h-24 text-green-500" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-400 font-medium mb-1">Taxa de Sucesso</p>
                                <h3 className="text-4xl font-bold text-white">{successRate}%</h3>
                                <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${successRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clients Section */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-xl font-bold text-white">Status dos Clientes</h3>

                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-full md:w-64 placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 text-slate-400 text-sm border-b border-slate-800">
                                        <th className="p-4 font-medium">Cliente</th>
                                        <th className="p-4 font-medium">Monitoramento</th>
                                        <th className="p-4 font-medium">Status Recente</th>
                                        <th className="p-4 font-medium text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredClients.map((client) => (
                                        <tr key={client.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                                        {client.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-200">{client.name}</div>
                                                        <div className="text-xs text-slate-500">ID: {client.id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {client.budget_monthly ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-green-400 text-sm">
                                                            <Activity className="w-3 h-3" />
                                                            <span>Ativo</span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">Budget: R$ {client.budget_monthly}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600 text-sm italic">Não configurado</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {client.recentLogs.length > 0 ? (
                                                        client.recentLogs.slice(0, 3).map((log, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`
                                                                    w-8 h-8 rounded-full flex items-center justify-center border border-slate-800
                                                                    ${log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                                                                `}
                                                                title={`${log.platform}: ${log.status}`}
                                                            >
                                                                {log.platform === 'META_ADS' && '🔵'}
                                                                {log.platform === 'GOOGLE_ADS' && '🟢'}
                                                                {log.platform === 'GA4' && '🟠'}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-600 text-sm italic">Sem logs</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            openConfig(client);
                                                            fetchAiInsights(client.id); // Refresh AI when clicking config too
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                                        title="Configurar Monitoramento"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => triggerSync(client.id)}
                                                        disabled={syncing === client.id}
                                                        className="
                                                            inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                                            bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white
                                                            disabled:opacity-50 disabled:cursor-not-allowed
                                                        "
                                                    >
                                                        <RefreshCw className={`w-4 h-4 ${syncing === client.id ? 'animate-spin' : ''}`} />
                                                        {syncing === client.id ? 'Sync...' : 'Sincronizar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredClients.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-500">
                                                    <Search className="w-12 h-12 opacity-20" />
                                                    <p>Nenhum cliente encontrado</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Config Modal */}
                {isConfigOpen && editingClient && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-blue-500" />
                                    Configurar Monitoramento
                                </h3>
                                <button
                                    onClick={() => setIsConfigOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Orçamento Mensal (R$)
                                    </label>
                                    <input
                                        type="number"
                                        value={editingClient.budget_monthly || ''}
                                        onChange={(e) => setEditingClient({ ...editingClient, budget_monthly: Number(e.target.value) })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Ex: 5000.00"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Usado para calcular o ritmo (pacing) de gastos.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">
                                            Mínimo Diário (R$)
                                        </label>
                                        <input
                                            type="number"
                                            value={editingClient.min_daily_spend || ''}
                                            onChange={(e) => setEditingClient({ ...editingClient, min_daily_spend: Number(e.target.value) })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Ex: 50.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">
                                            Máximo Diário (R$)
                                        </label>
                                        <input
                                            type="number"
                                            value={editingClient.max_daily_spend || ''}
                                            onChange={(e) => setEditingClient({ ...editingClient, max_daily_spend: Number(e.target.value) })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Ex: 500.00"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <h4 className="text-sm font-bold text-white mb-4">Credenciais de Anúncios</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center justify-between">
                                                Meta Ads Access Token
                                                <button
                                                    onClick={() => setIsHelpOpen('meta')}
                                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                >
                                                    <span className="w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center text-[10px]">?</span>
                                                    Como pegar?
                                                </button>
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Atualizar token..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                                // Note: We don't show the existing token for security, only allow update
                                                onChange={(e) => setEditingClient({ ...editingClient, meta_ads_access_token: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center justify-between">
                                                Google Ads Refresh Token
                                                <button
                                                    onClick={() => setIsHelpOpen('google')}
                                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                >
                                                    <span className="w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center text-[10px]">?</span>
                                                    Como pegar?
                                                </button>
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Atualizar token..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                                onChange={(e) => setEditingClient({ ...editingClient, google_ads_refresh_token: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                TikTok Access Token
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Atualizar token..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                                onChange={(e) => setEditingClient({ ...editingClient, tiktok_access_token: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                LinkedIn Access Token
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Atualizar token..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                                onChange={(e) => setEditingClient({ ...editingClient, linkedin_access_token: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                Google Search Console Token
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Atualizar token..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                                // Note: Usually GSC uses the same Google credentials, but for flexibility we add a field or reuse logic.
                                                // For MVP, let's assume it might need a separate scope/token if not using a unified OAuth.
                                                disabled
                                                title="Usa a mesma conta do Google Ads (Em breve)"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Usa a mesma conexão do Google Ads.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        Slack Webhook URL
                                    </label>
                                    <input
                                        type="text"
                                        value={editingClient.slack_webhook_url || ''}
                                        onChange={(e) => setEditingClient({ ...editingClient, slack_webhook_url: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="https://hooks.slack.com/services/..."
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-orange-500" />
                                        Integração CRM (ROI)
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                Provedor CRM
                                            </label>
                                            <select
                                                value={editingClient.crm_provider || ''}
                                                onChange={(e) => setEditingClient({ ...editingClient, crm_provider: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="hubspot">HubSpot</option>
                                                <option value="rd_station">RD Station</option>
                                                <option value="pipedrive" disabled>Pipedrive (Em breve)</option>
                                            </select>
                                        </div>

                                        {editingClient.crm_provider === 'hubspot' && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    HubSpot Access Token
                                                </label>
                                                <input
                                                    type="password"
                                                    value={editingClient.crm_api_key || ''}
                                                    onChange={(e) => setEditingClient({ ...editingClient, crm_api_key: e.target.value })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                                    placeholder="pat-na1-..."
                                                />
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Use um Private App Token com escopo <code>crm.objects.deals.read</code>.
                                                </p>
                                            </div>
                                        )}

                                        {editingClient.crm_provider === 'rd_station' && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    RD Station Access Token
                                                </label>
                                                <input
                                                    type="password"
                                                    value={editingClient.rd_station_token || ''}
                                                    onChange={(e) => setEditingClient({ ...editingClient, rd_station_token: e.target.value })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                                    placeholder="Token de Integração..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsConfigOpen(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveConfig}
                                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    Salvar Configurações
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Profile & Subscription Modal */}
                {isProfileOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    Minha Conta
                                </h3>
                                <button
                                    onClick={() => setIsProfileOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                                        A
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Admin User</h4>
                                        <p className="text-slate-400 text-sm">admin@agencia.com</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                                            Plano Growth
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Assinatura</h4>

                                    <a
                                        href="https://billing.stripe.com/p/login/test_..."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5 text-blue-500" />
                                            <div className="text-left">
                                                <p className="text-white font-medium">Gerenciar Assinatura</p>
                                                <p className="text-xs text-slate-500">Alterar plano, cartão ou cancelar</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors" />
                                    </a>

                                    <a
                                        href="mailto:suporte@datasync.com?subject=Solicitação de Reembolso&body=Olá, gostaria de solicitar um reembolso referente à minha última fatura pois..."
                                        className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-red-500/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-red-500" />
                                            <div className="text-left">
                                                <p className="text-white font-medium">Solicitar Reembolso</p>
                                                <p className="text-xs text-slate-500">Falar com suporte financeiro</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-red-500 transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Help Modal */}
                {isHelpOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                    Como obter seu Token
                                </h3>
                                <button
                                    onClick={() => setIsHelpOpen(null)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 text-slate-300">
                                {isHelpOpen === 'meta' && (
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold text-white">Meta Ads (Facebook/Instagram)</h4>
                                        <ol className="list-decimal pl-5 space-y-3">
                                            <li>Acesse <a href="https://developers.facebook.com/apps/" target="_blank" className="text-blue-400 hover:underline">developers.facebook.com/apps</a>.</li>
                                            <li>Crie um novo aplicativo do tipo <strong>"Empresa"</strong>.</li>
                                            <li>No painel do app, vá em <strong>"API de Marketing"</strong> e clique em Configurar.</li>
                                            <li>No menu lateral, vá em <strong>Ferramentas</strong>.</li>
                                            <li>Selecione as permissões <code>ads_read</code> e <code>read_insights</code>.</li>
                                            <li>Clique em <strong>"Obter Token"</strong>.</li>
                                            <li>Copie o token gerado e cole no campo do Dashboard.</li>
                                        </ol>
                                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-sm text-blue-300">
                                            <strong>Dica:</strong> Para tokens de longa duração (60 dias), você precisará usar a ferramenta "Graph API Explorer" ou verificar sua empresa.
                                        </div>
                                    </div>
                                )}

                                {isHelpOpen === 'google' && (
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold text-white">Google Ads</h4>
                                        <ol className="list-decimal pl-5 space-y-3">
                                            <li>Acesse o <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-400 hover:underline">Google Cloud Console</a>.</li>
                                            <li>Crie um projeto e ative a <strong>"Google Ads API"</strong>.</li>
                                            <li>Vá em <strong>"Credenciais"</strong> e crie um "ID do cliente OAuth".</li>
                                            <li>Configure a tela de consentimento (pode ser "Externo" em modo de teste).</li>
                                            <li>Use o "OAuth 2.0 Playground" para gerar seu <strong>Refresh Token</strong>.</li>
                                            <li>Você também precisará do seu <strong>Developer Token</strong> (no painel do Google Ads &gt; Ferramentas &gt; API).</li>
                                        </ol>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
