import { NextResponse, NextRequest } from 'next/server';

const host = 'www.alaqsaumrahtransport.com';
// This key matches the file created in public/e4b5f8c6a2d19f3b7c8e9a2d1f4b5c6a.txt
const key = 'e4b5f8c6a2d19f3b7c8e9a2d1f4b5c6a';
const keyLocation = `https://${host}/${key}.txt`;

async function submitToIndexNow(url: string) {
    const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            host: host,
            key: key,
            keyLocation: keyLocation,
            urlList: [url],
        }),
    });

    return response;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ 
            error: 'URL parameter is required', 
            example: `https://${host}/api/indexnow?url=https://${host}/services/ziyarat-tours` 
        }, { status: 400 });
    }

    try {
        const response = await submitToIndexNow(url);
        if (response.ok || response.status === 202 || response.status === 200) {
            return NextResponse.json({ success: true, message: `Successfully submitted ${url} to IndexNow for immediate crawling` });
        } else {
            return NextResponse.json({ error: `IndexNow API returned ${response.status}: ${response.statusText}` }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required in JSON body' }, { status: 400 });
        }

        const response = await submitToIndexNow(url);
        if (response.ok || response.status === 202 || response.status === 200) {
            return NextResponse.json({ success: true, message: `Successfully submitted ${url} to IndexNow for immediate crawling` });
        } else {
            return NextResponse.json({ error: `IndexNow API returned ${response.status}: ${response.statusText}` }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
