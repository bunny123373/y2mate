import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// This route forwards requests to a Python backend
// Deploy the Python backend separately on Railway/Render
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }
    
    // Forward to Python backend
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (body.download) {
      // Return the file blob
      const blob = await response.blob();
      return new NextResponse(blob, {
        headers: response.headers,
      });
    } else {
      // Return JSON
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
