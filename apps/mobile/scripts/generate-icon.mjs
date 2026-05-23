import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../assets/icon.png');

const svg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" fill="#B5503A"/>

  <!-- Envelope body -->
  <rect x="112" y="272" width="800" height="510" rx="36" fill="#FDFAF6"/>

  <!-- Envelope flap (top triangle) -->
  <path d="M112 272 L512 542 L912 272 Z" fill="#EDD8C8"/>

  <!-- Left bottom fold -->
  <path d="M112 782 L112 272 L412 512 Z" fill="#E5CEBC"/>

  <!-- Right bottom fold -->
  <path d="M912 782 L912 272 L612 512 Z" fill="#E5CEBC"/>

  <!-- Wax seal -->
  <circle cx="512" cy="540" r="88" fill="#6E2418"/>
  <circle cx="512" cy="540" r="78" fill="#8B3A2A"/>
  <radialGradient id="wax" cx="38%" cy="36%">
    <stop offset="0%" stop-color="#A0453A"/>
    <stop offset="100%" stop-color="#8B3A2A"/>
  </radialGradient>
  <circle cx="512" cy="540" r="78" fill="url(#wax)"/>

  <!-- f glyph in wax seal -->
  <text x="512" y="572"
    font-family="Georgia, serif"
    font-style="italic"
    font-weight="bold"
    font-size="88"
    fill="rgba(255,255,255,0.92)"
    text-anchor="middle">f</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(OUT);

console.log(`icon.png generated → ${OUT}`);
