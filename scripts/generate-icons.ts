
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SOURCE_IMAGE = String.raw`C:\Users\zubii\.gemini\antigravity\brain\2f705f83-cb91-4b14-a264-93d8419429d4\light_theme_icon_v3_1767638167817.png`;
const DEST_DIR = String.raw`d:\with data base\Al aqsa web\transport\public`;

async function generateIcons() {
    if (!fs.existsSync(SOURCE_IMAGE)) {
        console.error(`Source image not found at ${SOURCE_IMAGE}`);
        process.exit(1);
    }

    console.log(`Generating icons from ${SOURCE_IMAGE}...`);

    // 1. android-chrome-192x192.png
    await sharp(SOURCE_IMAGE)
        .resize(192, 192)
        .toFile(path.join(DEST_DIR, 'android-chrome-192x192.png'));
    console.log('Created android-chrome-192x192.png');

    // 2. android-chrome-512x512.png
    await sharp(SOURCE_IMAGE)
        .resize(512, 512)
        .toFile(path.join(DEST_DIR, 'android-chrome-512x512.png'));
    console.log('Created android-chrome-512x512.png');

    // 3. apple-touch-icon.png (usually 180x180, but 192 is often used or 180 specifically)
    // Let's make it 180x180 for standard iOS
    await sharp(SOURCE_IMAGE)
        .resize(180, 180)
        .toFile(path.join(DEST_DIR, 'apple-touch-icon.png'));
    console.log('Created apple-touch-icon.png');

    // 4. favicon.png (32x32 usually, usually served as PNG now)
    await sharp(SOURCE_IMAGE)
        .resize(32, 32)
        .toFile(path.join(DEST_DIR, 'favicon.png'));
    console.log('Created favicon.png');

    // 5. favicon.ico (multi-size)
    // sharp can't output .ico directly easily without plugins, usually. 
    // We'll stick to favicon.png which Next.js supports well, or resize to 32x32 png and rename if needed, but browsers prefer png.
    // Let's just update the favicon.png used by layout.tsx (usually called icon.png or favicon.ico).
    // The list_dir showed `favicon.png`.
}

generateIcons().catch(err => {
    console.error(err);
    process.exit(1);
});
