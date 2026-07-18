import { NextRequest, NextResponse } from 'next/server';

// ──────────────────────────────────────────────────────────────
// IndexNow Key File Handler
//
// Serves the IndexNow verification key at /{KEY}.txt.
// IndexNow requires the key to be publicly accessible at this URL
// so search engines (Bing, Yandex, Seznam, Naver) can verify
// domain ownership before processing URL submissions.
//
// URL format: https://www.alaqsaumrahtransport.com/{KEY}.txt
// Expected response: the bare key string, no whitespace, no markup.
//
// The route matches any path segment that ends in `.txt`.
// It returns 200 only when the requested key equals INDEXNOW_KEY.
// All other requests return 404 — including probing with wrong keys.
// ──────────────────────────────────────────────────────────────

const HEX_PATTERN = /^[0-9a-f]{32,128}$/i;

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    const { key: rawParam } = await params;

    // Must end with .txt
    if (!rawParam.endsWith('.txt')) {
        return new NextResponse(null, { status: 404 });
    }

    // Strip the .txt suffix to get the candidate key
    const candidate = rawParam.slice(0, -4);

    // Must be a valid hex string (32–128 characters)
    if (!HEX_PATTERN.test(candidate)) {
        return new NextResponse(null, { status: 404 });
    }

    const envKey = process.env.INDEXNOW_KEY;

    // Return 404 if the env var is unset or if the key does not match
    if (!envKey || candidate !== envKey) {
        return new NextResponse(null, { status: 404 });
    }

    // Serve the key as plain text — no newline, no whitespace
    return new NextResponse(envKey, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}
