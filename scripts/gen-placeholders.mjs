import fs from "node:fs";

const BLUE = "#3457D5";
const COPPER = "#E2A63B";
const INK = "#14171C";
const PAPER = "#F5F6F8";

const ICONS = {
  cpu: `
    <rect x="130" y="130" width="140" height="140" rx="10" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <rect x="160" y="160" width="80" height="80" rx="4" fill="${BLUE}" opacity="0.15"/>
    <rect x="160" y="160" width="80" height="80" rx="4" fill="none" stroke="${BLUE}" stroke-width="3"/>
    ${[0,1,2,3,4].map(i => `<line x1="${150+i*25}" y1="130" x2="${150+i*25}" y2="108" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/>`).join("")}
    ${[0,1,2,3,4].map(i => `<line x1="${150+i*25}" y1="270" x2="${150+i*25}" y2="292" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/>`).join("")}
    ${[0,1,2,3,4].map(i => `<line x1="130" y1="${150+i*25}" x2="108" y2="${150+i*25}" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/>`).join("")}
    ${[0,1,2,3,4].map(i => `<line x1="270" y1="${150+i*25}" x2="292" y2="${150+i*25}" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/>`).join("")}
    <circle cx="204" cy="204" r="4" fill="${COPPER}"/>
  `,
  gpu: `
    <rect x="90" y="150" width="220" height="90" rx="10" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <circle cx="150" cy="195" r="28" fill="none" stroke="${BLUE}" stroke-width="4"/>
    <circle cx="150" cy="195" r="4" fill="${COPPER}"/>
    <circle cx="230" cy="195" r="28" fill="none" stroke="${BLUE}" stroke-width="4"/>
    <circle cx="230" cy="195" r="4" fill="${COPPER}"/>
    <rect x="90" y="240" width="24" height="16" fill="${BLUE}"/>
    <rect x="290" y="130" width="14" height="20" fill="${BLUE}"/>
  `,
  motherboards: `
    <rect x="90" y="90" width="220" height="220" rx="8" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <rect x="115" y="115" width="60" height="60" rx="4" fill="${BLUE}" opacity="0.15" stroke="${BLUE}" stroke-width="3"/>
    <rect x="200" y="115" width="90" height="18" fill="none" stroke="${BLUE}" stroke-width="3"/>
    <rect x="200" y="140" width="90" height="18" fill="none" stroke="${BLUE}" stroke-width="3"/>
    <rect x="115" y="200" width="16" height="90" fill="none" stroke="${BLUE}" stroke-width="3"/>
    <rect x="140" y="200" width="16" height="90" fill="none" stroke="${BLUE}" stroke-width="3"/>
    <circle cx="270" cy="270" r="4" fill="${COPPER}"/>
    <circle cx="290" cy="200" r="4" fill="${COPPER}"/>
  `,
  memory: `
    <rect x="130" y="90" width="30" height="220" rx="4" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <rect x="190" y="90" width="30" height="220" rx="4" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <rect x="250" y="90" width="30" height="220" rx="4" fill="none" stroke="${BLUE}" stroke-width="6"/>
    ${[0,1,2,3,4,5].map(i => `<line x1="130" y1="${120+i*28}" x2="160" y2="${120+i*28}" stroke="${BLUE}" stroke-width="2" opacity="0.5"/>`).join("")}
    <circle cx="205" cy="200" r="4" fill="${COPPER}"/>
  `,
  storage: `
    <rect x="100" y="140" width="200" height="120" rx="12" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <circle cx="230" cy="200" r="4" fill="${COPPER}"/>
    <rect x="125" y="165" width="70" height="10" rx="3" fill="${BLUE}" opacity="0.4"/>
    <rect x="125" y="185" width="70" height="10" rx="3" fill="${BLUE}" opacity="0.25"/>
    <rect x="125" y="205" width="50" height="10" rx="3" fill="${BLUE}" opacity="0.15"/>
  `,
  "power-supplies": `
    <rect x="100" y="120" width="200" height="160" rx="10" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <circle cx="200" cy="200" r="46" fill="none" stroke="${BLUE}" stroke-width="4"/>
    <circle cx="200" cy="200" r="4" fill="${COPPER}"/>
    <line x1="300" y1="180" x2="330" y2="180" stroke="${BLUE}" stroke-width="6" stroke-linecap="round"/>
  `,
  "cases-cooling": `
    <rect x="140" y="80" width="120" height="240" rx="10" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <circle cx="200" cy="160" r="32" fill="none" stroke="${BLUE}" stroke-width="4"/>
    <circle cx="200" cy="160" r="4" fill="${COPPER}"/>
    <circle cx="200" cy="250" r="32" fill="none" stroke="${BLUE}" stroke-width="4"/>
    <circle cx="200" cy="250" r="4" fill="${COPPER}"/>
  `,
  laptops: `
    <rect x="120" y="90" width="160" height="110" rx="6" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <path d="M95,290 L305,290 L285,225 L115,225 Z" fill="none" stroke="${BLUE}" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="200" cy="257" r="4" fill="${COPPER}"/>
  `,
  monitors: `
    <rect x="100" y="100" width="200" height="130" rx="8" fill="none" stroke="${BLUE}" stroke-width="6"/>
    <line x1="200" y1="230" x2="200" y2="270" stroke="${BLUE}" stroke-width="6" stroke-linecap="round"/>
    <line x1="155" y1="300" x2="245" y2="300" stroke="${BLUE}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="200" cy="165" r="4" fill="${COPPER}"/>
  `,
  peripherals: `
    <rect x="100" y="150" width="200" height="80" rx="8" fill="none" stroke="${BLUE}" stroke-width="6"/>
    ${[0,1,2,3,4,5].map(i => `<rect x="${118+i*29}" y="168" width="18" height="18" rx="3" fill="${BLUE}" opacity="0.3"/>`).join("")}
    ${[0,1,2,3,4,5].map(i => `<rect x="${118+i*29}" y="194" width="18" height="18" rx="3" fill="${BLUE}" opacity="0.3"/>`).join("")}
    <circle cx="200" cy="240" r="4" fill="${COPPER}"/>
  `
};

const LABELS = {
  cpu: "CPU",
  gpu: "Graphics Card",
  motherboards: "Motherboard",
  memory: "Memory",
  storage: "Storage",
  "power-supplies": "Power Supply",
  "cases-cooling": "Case / Cooling",
  laptops: "Laptop",
  monitors: "Monitor",
  peripherals: "Peripheral"
};

for (const [key, icon] of Object.entries(ICONS)) {
  const label = LABELS[key];
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <style>
      .label { font-family: ui-monospace, "SFMono-Regular", Consolas, monospace; font-size: 20px; letter-spacing: 0.04em; fill: ${INK}; text-anchor: middle; }
    </style>
  </defs>
  <rect width="400" height="400" fill="${PAPER}"/>
  <g opacity="0.9">${icon}</g>
  <text x="200" y="355" class="label">${label.toUpperCase()}</text>
</svg>`;
  fs.writeFileSync(`public/placeholders/${key}.svg`, svg);
  console.log("wrote", key);
}
