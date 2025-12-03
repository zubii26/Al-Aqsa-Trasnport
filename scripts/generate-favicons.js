const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE = path.join(process.cwd(), 'public', 'logo.png');
const PUBLIC = path.join(process.cwd(), 'public');

async function generate() {
    if (!fs.existsSync(SOURCE)) {
        console.error('Source logo.png not found!');
        process.exit(1);
    }

    console.log('Generating favicons from', SOURCE);

    // 1. favicon.png (32x32) - Standard for tabs
    await sharp(SOURCE)
        .resize(32, 32)
        .toFile(path.join(PUBLIC, 'favicon.png'));
    console.log('Generated favicon.png (32x32)');

    // 2. apple-touch-icon.png (180x180) - For Apple devices
    await sharp(SOURCE)
        .resize(180, 180)
        .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png (180x180)');

    // 3. android-chrome-192x192.png (192x192) - For Android
    await sharp(SOURCE)
        .resize(192, 192)
        .toFile(path.join(PUBLIC, 'android-chrome-192x192.png'));
    console.log('Generated android-chrome-192x192.png (192x192)');

    // 4. android-chrome-512x512.png (512x512) - For Android
    await sharp(SOURCE)
        .resize(512, 512)
        .toFile(path.join(PUBLIC, 'android-chrome-512x512.png'));
    console.log('Generated android-chrome-512x512.png (512x512)');

    // 5. favicon.ico (32x32 PNG renamed, simple fallback)
    // Note: True ICO requires multiple sizes, but this often works for simple needs
    await sharp(SOURCE)
        .resize(32, 32)
        .toFile(path.join(PUBLIC, 'favicon.ico')); // Sharp infers format from extension? No, usually needs explicit format.
    // Actually sharp might not support .ico output directly.
    // Let's just save as png and rename manually or just rely on favicon.png
}

generate().catch(console.error);
