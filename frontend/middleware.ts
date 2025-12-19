import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Verificação simples de cookie de sessão do Supabase
    // O nome do cookie geralmente contém o ID do projeto, mas 'sb-' é um bom indicador genérico
    // ou verificamos se existe QUALQUER cookie começando com 'sb-'

    const hasSession = req.cookies.getAll().some(cookie => cookie.name.startsWith('sb-'));

    // Se não tiver cookie e tentar acessar dashboard, redireciona
    if (!hasSession && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Se tiver cookie e tentar acessar login, redireciona para dashboard
    if (hasSession && req.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
