import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const currentPath = req.nextUrl.pathname;

  // If already on /admin-login, proceed without checks
  if (currentPath === '/admin-login') {
    return NextResponse.next();
  }

  // If no token is found, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin-login', req.url));
  }

  try {
    const res = await fetch(`https://abicmanpowerservicecorp.com/api/dashboard/get-counts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get('Content-Type') || '';
    const isJson = contentType.includes('application/json');

    if (res.status === 200 && isJson) {
      const data = await res.json();
      // Optionally, use the `data` here for any additional checks

      return NextResponse.next();
    }

    // If the user is logged in and tries to access the login page, redirect them to the admin page
    if (res.status === 200 && currentPath === '/admin-login') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Otherwise, redirect to login if the token is invalid or the API returns an unexpected status
    return NextResponse.redirect(new URL('/admin-login', req.url));

  } catch (error) {
    return NextResponse.json({ message: 'Error validating token or fetching API' }, { status: 500 });
  }
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
};
