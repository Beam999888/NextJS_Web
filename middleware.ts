import { NextRequest, NextResponse } from 'next/server';

function isAuthPage(pathname: string) {
    return pathname === '/login' || pathname === '/register';
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    if (pathname.startsWith('/admin')) return NextResponse.next();

    const session = req.cookies.get('site_session')?.value;
    const onAuthPage = isAuthPage(pathname);

    if (session && onAuthPage) {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        url.search = '';
        return NextResponse.redirect(url);
    }

    // if (!session && !onAuthPage) {
    //     const url = req.nextUrl.clone();
    //     url.pathname = '/login';
    //     url.searchParams.set('redirect', `${pathname}${search}`);
    //     return NextResponse.redirect(url);
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

