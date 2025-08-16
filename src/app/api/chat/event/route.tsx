import { NextRequest, NextResponse } from 'next/server';
import { LiveEventSchema } from '@/lib/schemas';
import { verifyEventSignature } from '@/lib/auth';

export const runtime = 'nodejs';        // ensure Node runtime
export const dynamic = 'force-dynamic'; // no caching

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')?.split(' ')[1];
  if (process.env.EVENT_JWS_JWK && (!auth || !(await verifyEventSignature(auth)))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  const body = await req.json();
  const events = Array.isArray(body) ? body : [body];

  const rows = events.map((e: unknown) => {
    const parsed = LiveEventSchema.safeParse(e);
    if (!parsed.success) return null;
    const d = parsed.data;
    return {
      inserted_at: new Date().toISOString(),
      event_id: d.event.id,
      type: d.event.type,
      created_at_ms: d.event.created_at,
      chat_id: d.chat?.id ?? null,
      author_id: d.event.author_id ?? null,
      payload_json: JSON.stringify(d),
    };
  }).filter(Boolean) as any[];

  if (!rows.length) {
    return NextResponse.json({ error: 'no valid events' }, { status: 400 });
  }

  const { insertBQ } = await import('@/lib/bigquery'); // server-only
  await insertBQ(process.env.BQ_EVENTS_TABLE!, rows);
  return new NextResponse(null, { status: 204 });
}
