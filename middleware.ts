import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/transcript/cron')) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (token !== process.env.CRON_TOKEN) return new NextResponse('Unauthorized', { status: 401 });
  }
  return NextResponse.next();
}
export const config = { matcher: ['/api/transcript/cron'] };