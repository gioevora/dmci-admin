import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const isLogin = req.cookies.get('abic-admin-login')?.value;

    const currentPath = req.nextUrl.pathname;

    if (!isLogin || isLogin === 'false' || isLogin === 'null') {
        if (currentPath === '/admin-login' || currentPath === '/unauthorized') {
            return NextResponse.next(); 
        }

        return NextResponse.redirect(new URL('/unauthorized', req.url)); 
    }

    if (isLogin && currentPath === '/admin-login') {
        return NextResponse.redirect(new URL('/admin', req.url)); 
    }

    return NextResponse.next(); 
}

export const config = {
    matcher: ['/admin/:path*', '/admin-login', '/unauthorized'], 
};
