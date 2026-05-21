/* eslint-env node */
/* global __dirname */
// generate_icons.js
// Usage:
// 1. Install sharp: `npm install --save-dev sharp`
// 2. Run: `node scripts/generate_icons.js`
// This script generates smaller centered icons and Android adaptive foreground
// images from `assets/logomark.png` and outputs them to `assets/`.

const fs = require('fs');
const path = require('path');

async function ensureSharp() {
    try {
        return require('sharp');
    } catch (e) {
        console.error('Please install sharp first: npm install --save-dev sharp');
        process.exit(1);
    }
}

async function run() {
    const sharp = await ensureSharp();
    const scriptDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(process.argv[1]) || process.cwd();
    const root = path.resolve(scriptDir, '..');
    const src = path.join(root, 'assets', 'logomark.png');
    if (!fs.existsSync(src)) {
        console.error('Source logomark not found at', src);
        process.exit(1);
    }

    const outIcon = path.join(root, 'assets', 'logomark_icon_512.png');
    const outForeground = path.join(root, 'assets', 'logomark_foreground.png');

    // Create a 512x512 icon with padding. Default logo scale is 82%.
    // You can override with CLI: `node scripts/generate_icons.js --scale=0.5`
    const size = 512;
    const arg = process.argv.find((a) => a.startsWith('--scale='));
    const logoScale = arg ? Math.max(0.1, Math.min(0.95, parseFloat(arg.split('=')[1]) || 0.82)) : (process.env.ICON_SCALE ? Math.max(0.1, Math.min(0.95, parseFloat(process.env.ICON_SCALE) || 0.82)) : 0.82);
    const logoSize = Math.round(size * logoScale);

    const sourceLogo = sharp(src).trim();
    const logoBuffer = await sourceLogo.resize({ width: logoSize, height: logoSize, fit: 'contain' }).png().toBuffer();

    const composite = await sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
    })
        .composite([{ input: logoBuffer, gravity: 'center' }])
        .png()
        .toFile(outIcon);

    console.log('Wrote', outIcon);

    // Foreground image for Android adaptive icon: leave transparent background
    const fgSize = 432; // Android recommended foreground size
    await sharp(src).trim().resize({ width: Math.round(fgSize * logoScale), height: Math.round(fgSize * logoScale), fit: 'contain' })
        .png()
        .toFile(outForeground);

    console.log('Wrote', outForeground);
    console.log('\nNow update `app.json` to point icon/adaptive foreground to these files:');
    console.log('  "icon": "./assets/logomark_icon_512.png"');
    console.log('  "android.adaptiveIcon.foregroundImage": "./assets/logomark_foreground.png"');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
