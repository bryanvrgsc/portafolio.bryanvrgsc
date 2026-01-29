import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const iconPath = searchParams.get('path');

    if (!iconPath) {
        return new NextResponse('Missing path parameter', { status: 400 });
    }

    // Security: Only allow paths within /icons/ and ending with .icns
    if (!iconPath.startsWith('/icons/') || !iconPath.endsWith('.icns')) {
        return new NextResponse('Invalid path', { status: 400 });
    }

    // Resolve the full path to the .icns file
    const publicDir = path.join(process.cwd(), 'public');
    const icnsPath = path.join(publicDir, iconPath);

    // Check if file exists
    if (!fs.existsSync(icnsPath)) {
        return new NextResponse('Icon not found', { status: 404 });
    }

    // Create temp file for conversion
    const tempFile = path.join(os.tmpdir(), `icon_${Date.now()}.png`);

    try {
        // Convert using sips (macOS only)
        execSync(`sips -s format png "${icnsPath}" --out "${tempFile}"`, {
            stdio: 'pipe'
        });

        // Read the converted PNG
        const pngBuffer = fs.readFileSync(tempFile);

        // Clean up temp file
        fs.unlinkSync(tempFile);

        // Return PNG with proper headers
        return new NextResponse(pngBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error converting icon:', error);
        return new NextResponse('Conversion failed', { status: 500 });
    }
}
