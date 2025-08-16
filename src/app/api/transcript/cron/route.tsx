import { NextRequest, NextResponse } from 'next/server';
import fetch from 'cross-fetch';
import { saveJsonl } from '@/lib/gcs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (token !== process.env.CRON_TOKEN) return new NextResponse('Unauthorized', { status: 401 });

  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const base = 'https://api.livechatinc.com/v3.5/agent/action';
  const headers = { Authorization: `Bearer ${process.env.LC_AGENT_PAT}` };

  const listResp = await fetch(`${base}/list_chats`, {
    method: 'POST', headers, body: JSON.stringify({ filters: { date_from: since }, sort_order: 'desc', limit: 100 })
  });
  const list = await listResp.json();
  const transcripts: any[] = [];

  for (const chat of list.chats || []) {
    const id = chat.id;
    const tr = await fetch(`${base}/get_archives`, {
      method: 'POST', headers, body: JSON.stringify({ chat_id: id })
    }).then(r => r.json());
    transcripts.push({ chat_id: id, transcript: tr, pulled_at: new Date().toISOString() });
  }

  const path = `transcripts/date=${new Date().toISOString().slice(0,10)}/export.jsonl`;
  await saveJsonl(path, transcripts);
  return NextResponse.json({ saved: transcripts.length, path }, { status: 200 });
}
