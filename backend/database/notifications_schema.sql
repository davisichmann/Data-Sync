-- Tabela de Notificações para o Usuário (Agência)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- O dono da agência que deve ver o aviso
    client_id UUID REFERENCES clients(id),  -- O cliente relacionado (opcional)
    type VARCHAR(50) NOT NULL,              -- 'warning', 'error', 'success', 'info'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;
