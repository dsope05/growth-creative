import type { NextFetchEvent, NextRequest } from 'next/server';
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

const protectedPath = ['/dashboard'];
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const requestForNextAuth = {
    headers: {
      cookie: req.headers.get('cookie'),
    },
  };

  const session = await getSession({ req: requestForNextAuth });

  if (session) {
    return NextResponse.next();
  } else if (redirectProtected(req.nextUrl.pathname)) {
    // the user is not logged in, redirect to the sign-in page
    const signInPage = '/signin';
    const signInUrl = new URL(signInPage, req.nextUrl.origin);
    //signInUrl.searchParams.append('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }
}

const redirectProtected = (pathname: string) => { 
  return protectedPath.includes(pathname);
}