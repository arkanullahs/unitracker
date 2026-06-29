import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const KV_KEY = 'app-state';

export async function GET() {
  try {
    const data = await kv.get(KV_KEY);
    return NextResponse.json(data || {});
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await kv.set(KV_KEY, body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await kv.del(KV_KEY);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
