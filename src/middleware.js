import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('adminToken')?.value;
  const pathname = request.nextUrl.pathname;
  
  // ✅ Deixa /admin/login acessível (sem autenticação)
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // ✅ Protege o resto de /admin (precisa estar autenticado)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};