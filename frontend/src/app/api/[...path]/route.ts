import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000/api';

async function handleProxy(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path ? params.path.join('/') : '';
  const url = new URL(req.url);
  const targetUrl = `${BACKEND_URL}/${path}${url.search}`;

  const contentType = req.headers.get('content-type') || '';

  try {
    let body: any = undefined;
    const headers: Record<string, string> = {};

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData();
        body = formData;
      } else {
        const text = await req.text();
        body = text;
        if (contentType) headers['content-type'] = contentType;
      }
    }

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const resContentType = backendRes.headers.get('content-type') || '';
    if (resContentType.includes('application/json')) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    } else {
      const text = await backendRes.text();
      return new NextResponse(text, {
        status: backendRes.status,
        headers: { 'content-type': resContentType },
      });
    }
  } catch (err: any) {
    console.error('API Proxy Error:', err);
    return NextResponse.json(
      { detail: `Gagal menghubungi server backend: ${err?.message || err}` },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
