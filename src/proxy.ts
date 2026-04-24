import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';

export async function middleware(request: NextRequest) {
  // Hanya lindungi rute /api yang BUKAN /api/auth
  if (request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/api/auth')) {
    const session = await getSessionFromRequest(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Harap login terlebih dahulu' },
        { status: 401 }
      );
    }
    
    // Tambahkan header opsional jika butuh role checking
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-role', session.role);
    requestHeaders.set('x-user-nip', session.username);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
