import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    // If no token is found, redirect to the login page
    if (!token) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Allow the request if token exists
    return NextResponse.next();
}

// Apply middleware only to admin routes
export const config = {
    matcher: '/admin/:path*',
};
