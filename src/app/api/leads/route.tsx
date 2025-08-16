import { NextRequest, NextResponse } from 'next/server';
import { LeadSchema } from '@/lib/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = LeadSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { upsertLead } = await import('@/lib/bigquery');
  await upsertLead(parsed.data);
  return new NextResponse(null, { status: 204 });
}
