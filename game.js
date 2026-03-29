const sbConfig = {
    url: window.PROJECT_CONFIG?.SUPABASE_URL || "", // Local config file
    anonKey: window.PROJECT_CONFIG?.SUPABASE_ANON_KEY || ""
};

let supabaseClient; let channel;
try { 
    if (sbConfig.url) supabaseClient = supabase.createClient(sbConfig.url, sbConfig.anonKey); 
} catch(e) { 
    console.warn("Supabase configuration missing or invalid."); 
}

let particles = [];

// --- DATA ---
const LEVELS = [
    { name: "First Steps", par: 2, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 150 }, walls: [{ x: 50, y: 50, w: 20, h: 800 }, { x: 530, y: 50, w: 20, h: 800 }, { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }], hazards: [] },
    { name: "Dogleg Left", par: 3, startInfo: { x: 150, y: 800 }, hole: { x: 450, y: 150 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 800 }, { x: 530, y: 70, w: 20, h: 800 }, { x: 250, y: 300, w: 300, h: 20 }, { x: 50, y: 600, w: 300, h: 20 }], hazards: [] },
    { name: "Sand Trap", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 }, { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 }], hazards: [{ type: 'sand', x: 200, y: 300, w: 200, h: 300 }] },
    { name: "The Moat", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }], hazards: [{ type: 'water', x: 70, y: 350, w: 460, h: 250 }, { type: 'bridge', x: 250, y: 350, w: 100, h: 250 }] },
    { name: "Moving Block", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 200, y: 400, w: 200, h: 40, vx: 2, minX: 70, maxX: 330 }], hazards: [] },
    { name: "Zig Zag", par: 5, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 50, y: 600, w: 400, h: 20 }, { x: 150, y: 400, w: 400, h: 20 }, { x: 50, y: 200, w: 400, h: 20 }], hazards: [] },
    { name: "Double Trouble", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 70, y: 300, w: 200, h: 40, vx: 2, minX: 70, maxX: 200 }, { x: 330, y: 500, w: 200, h: 40, vx: -2, minX: 200, maxX: 330 }], hazards: [] },
    { name: "Island Hop", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [], hazards: [{ type: 'water', x: 0, y: 300, w: 600, h: 300 }, { type: 'bridge', x: 250, y: 300, w: 100, h: 300, vx: 3, minX: 50, maxX: 450 }] },
    { name: "The Pinball", par: 4, startInfo: { x: 150, y: 800 }, hole: { x: 450, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 220, y: 250, w: 50, h: 50 }, { x: 350, y: 350, w: 50, h: 50 }, { x: 220, y: 450, w: 50, h: 50 }, { x: 350, y: 550, w: 50, h: 50 }], hazards: [] },
    { name: "Walled City", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 200 }, walls: [{ x: 100, y: 500, w: 400, h: 30 }, { x: 200, y: 350, w: 200, h: 20, vx: 4, minX: 0, maxX: 400 }], hazards: [] },
    { name: "Quick Reflexes", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 100, y: 450, w: 400, h: 20, vx: 5, minX: 50, maxX: 150 }], hazards: [] },
    { name: "Sandy Dunes", par: 4, startInfo: { x: 150, y: 800 }, hole: { x: 450, y: 100 }, walls: [{ x: 280, y: 200, w: 40, h: 500 }], hazards: [{ type: 'sand', x: 150, y: 400, w: 300, h: 150, vx: 2, minX: 50, maxX: 250 }] },
    { name: "Bridge Over Troubled", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 100, y: 300, w: 150, h: 20, vx: 2, minX: 0, maxX: 200 }, { x: 400, y: 500, w: 150, h: 20, vx: -2, minX: 200, maxX: 450 }], hazards: [{ type: 'water', x: 0, y: 350, w: 600, h: 200 }, { type: 'bridge', x: 250, y: 350, w: 100, h: 200 }] },
    { name: "Piston Pump", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 200, y: 400, w: 200, h: 60, vy: 4, minY: 200, maxY: 600 }, { x: 50, y: 400, w: 100, h: 60, vy: -4, minY: 200, maxY: 600 }, { x: 450, y: 400, w: 100, h: 60, vy: -4, minY: 200, maxY: 600 }], hazards: [] },
    { name: "The Gauntlet", par: 5, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 70, y: 200, w: 250, h: 20 }, { x: 280, y: 400, w: 250, h: 20 }, { x: 70, y: 600, w: 250, h: 20 }], hazards: [{ type: 'sand', x: 350, y: 200, w: 100, h: 100 }] },
    { name: "Narrow Path", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 180, y: 200, w: 30, h: 500 }, { x: 390, y: 200, w: 30, h: 500 }, { x: 210, y: 350, w: 100, h: 30, vx: 5, minX: 210, maxX: 290 }], hazards: [] },
    { name: "Water Hazard", par: 4, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }], hazards: [{ type: 'water', x: 200, y: 70, w: 200, h: 780 }, { type: 'bridge', x: 200, y: 400, w: 200, h: 50 }] },
    { name: "Crazy Blocks", par: 5, startInfo: { x: 150, y: 800 }, hole: { x: 450, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 150, y: 600, w: 100, h: 20, vx: 2, minX: 100, maxX: 300 }, { x: 350, y: 400, w: 100, h: 20, vx: -3, minX: 200, maxX: 400 }, { x: 150, y: 200, w: 100, h: 20, vx: 4, minX: 100, maxX: 400 }], hazards: [] },
    { name: "Twin Tunnels", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 200, y: 300, w: 50, h: 300 }, { x: 350, y: 300, w: 50, h: 300 }, { x: 250, y: 300, w: 100, h: 20 }], hazards: [] },
    { name: "The Ultimate Challenge", par: 6, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 30, y: 30, w: 540, h: 20 }, { x: 30, y: 870, w: 540, h: 20 }, { x: 30, y: 50, w: 20, h: 820 }, { x: 550, y: 50, w: 20, h: 820 }, { x: 200, y: 600, w: 150, h: 20, vx: 3, minX: 50, maxX: 400 }, { x: 250, y: 300, w: 150, h: 20, vx: -4, minX: 50, maxX: 400 }], hazards: [{ type: 'water', x: 50, y: 400, w: 280, h: 150 }, { type: 'water', x: 270, y: 150, w: 280, h: 100 }, { type: 'bridge', x: 250, y: 400, w: 80, h: 150 }, { type: 'sand', x: 100, y: 100, w: 150, h: 150 }] },
    // NEW LEVELS 21-40
    { name: "Wall Warp", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 100, y: 300, w: 400, h: 40 }, { x: 300, y: 500, w: 20, h: 300 }], hazards: [] },
    { name: "Slalom Run", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 50 }, walls: [{ x: 100, y: 200, w: 300, h: 20, vx: 5, minX: 50, maxX: 250 }, { x: 200, y: 400, w: 300, h: 20, vx: -5, minX: 100, maxX: 300 }, { x: 100, y: 600, w: 300, h: 20, vx: 6, minX: 50, maxX: 250 }], hazards: [] },
    { name: "Cross Traffic", par: 4, startInfo: { x: 300, y: 850 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 250, w: 250, h: 30, vx: 6, minX: 0, maxX: 350 }, { x: 350, y: 400, w: 250, h: 30, vx: -7, minX: 0, maxX: 350 }, { x: 50, y: 550, w: 250, h: 30, vx: 8, minX: 0, maxX: 350 }, { x: 350, y: 700, w: 250, h: 30, vx: -9, minX: 0, maxX: 350 }], hazards: [] },
    { name: "The Ring", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 200 }, walls: [{ x: 200, y: 150, w: 200, h: 30, vx: 5, minX: 50, maxX: 350 }, { x: 200, y: 250, w: 200, h: 30, vx: -5, minX: 50, maxX: 350 }, { x: 200, y: 150, w: 30, h: 100, vy: 4, minY: 50, maxY: 350 }, { x: 370, y: 150, w: 30, h: 100, vy: -4, minY: 50, maxY: 350 }], hazards: [] },
    { name: "Double Maze", par: 5, startInfo: { x: 100, y: 850 }, hole: { x: 500, y: 50 }, walls: [{ x: 50, y: 700, w: 400, h: 20 }, { x: 150, y: 500, w: 400, h: 20 }, { x: 50, y: 300, w: 400, h: 20 }], hazards: [] },
    { name: "Water Tunnel", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [], hazards: [{ type: 'water', x: 0, y: 250, w: 600, h: 400 }, { type: 'bridge', x: 50, y: 250, w: 120, h: 400, vx: 1.5, minX: 0, maxX: 480 }] },
    { name: "Speed Trap", par: 3, startInfo: { x: 300, y: 850 }, hole: { x: 300, y: 50 }, walls: [{ x: 50, y: 300, w: 300, h: 30, vx: 8, minX: 0, maxX: 300 }, { x: 250, y: 550, w: 300, h: 30, vx: -8, minX: 0, maxX: 300 }], hazards: [] },
    { name: "Spiral", par: 5, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 50, y: 200, w: 450, h: 30, vx: 5, minX: 0, maxX: 150 }, { x: 100, y: 400, w: 450, h: 30, vx: -6, minX: 0, maxX: 150 }, { x: 50, y: 600, w: 450, h: 30, vx: 7, minX: 0, maxX: 150 }], hazards: [] },
    { name: "Bridge Hero", par: 5, startInfo: { x: 300, y: 850 }, hole: { x: 300, y: 50 }, walls: [], hazards: [{ type: 'water', x: 0, y: 150, w: 600, h: 600 }, { type: 'bridge', x: 250, y: 150, w: 100, h: 600 }] },
    { name: "Block Party", par: 5, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 100, y: 250, w: 60, h: 60 }, { x: 250, y: 350, w: 60, h: 60 }, { x: 400, y: 450, w: 60, h: 60 }, { x: 100, y: 550, w: 60, h: 60 }], hazards: [] },
    { name: "Moving Sand", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 350, w: 200, h: 20, vx: 2, minX: 50, maxX: 150 }, { x: 350, y: 350, w: 200, h: 20, vx: -2, minX: 250, maxX: 350 }], hazards: [{ type: 'sand', x: 0, y: 200, w: 450, h: 100, vx: 1.2, minX: 0, maxX: 150 }, { type: 'sand', x: 150, y: 400, w: 450, h: 100, vx: -1.5, minX: 0, maxX: 150 }, { type: 'sand', x: 0, y: 600, w: 450, h: 100, vx: 1.1, minX: 0, maxX: 150 }] },
    { name: "The Corridors", par: 4, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 200, y: 0, w: 20, h: 600, vy: 2, minY: 0, maxY: 300 }, { x: 400, y: 300, w: 20, h: 600, vy: -2, minY: 0, maxY: 300 }], hazards: [] },
    { name: "Island Queen", par: 4, startInfo: { x: 300, y: 850 }, hole: { x: 300, y: 50 }, walls: [{ x: 100, y: 400, w: 100, h: 20, vx: 2, minX: 50, maxX: 200 }, { x: 400, y: 400, w: 100, h: 20, vx: -2, minX: 300, maxX: 450 }], hazards: [{ type: 'water', x: 0, y: 150, w: 600, h: 600 }, { type: 'bridge', x: 250, y: 150, w: 100, h: 600 }] },
    { name: "Tight Squeeze", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 50 }, walls: [{ x: 0, y: 300, w: 240, h: 40, vx: 5, minX: 0, maxX: 150 }, { x: 360, y: 300, w: 240, h: 40 }, { x: 0, y: 500, w: 240, h: 40, vx: 7, minX: 0, maxX: 200 }, { x: 360, y: 500, w: 240, h: 40 }], hazards: [{ type: 'sand', x: 300, y: 150, w: 100, h: 100 }, { type: 'sand', x: 50, y: 650, w: 150, h: 100 }, { type: 'sand', x: 400, y: 400, w: 100, h: 100 }] },
    { name: "Bouncing Madness", par: 4, startInfo: { x: 100, y: 450 }, hole: { x: 500, y: 450 }, walls: [{ x: 250, y: 50, w: 30, h: 300, vy: 5, minY: 50, maxY: 500 }, { x: 320, y: 550, w: 30, h: 300, vy: -6, minY: 50, maxY: 550 }], hazards: [] },
    { name: "Long Shot", par: 4, startInfo: { x: 300, y: 850 }, hole: { x: 300, y: 50 }, walls: [], hazards: [{ type: 'sand', x: 50, y: 200, w: 500, h: 80 }, { type: 'sand', x: 50, y: 600, w: 500, h: 80 }, { type: 'water', x: 0, y: 350, w: 600, h: 150 }, { type: 'bridge', x: 100, y: 350, w: 100, h: 150, vx: 3, minX: 0, maxX: 500 }, { type: 'bridge', x: 400, y: 350, w: 100, h: 150, vx: -2, minX: 0, maxX: 500 }] },
    { name: "Checkers", par: 5, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 200, y: 300, w: 80, h: 80, vx: 7, minX: 50, maxX: 470 }, { x: 320, y: 500, w: 80, h: 80, vx: -8, minX: 50, maxX: 470 }, { x: 100, y: 400, w: 80, h: 80, vx: 9, minX: 50, maxX: 470 }], hazards: [] },
    { name: "Gravity Pit", par: 5, startInfo: { x: 150, y: 150 }, hole: { x: 450, y: 750 }, walls: [{ x: 350, y: 350, w: 150, h: 30, vx: -3, minX: 100, maxX: 450 }, { x: 100, y: 520, w: 150, h: 30, vx: 3, minX: 100, maxX: 450 }], hazards: [{ type: 'water', x: 0, y: 300, w: 600, h: 300 }, { type: 'bridge', x: 0, y: 300, w: 600, h: 300 }] },
    { name: "Final Lap", par: 6, startInfo: { x: 300, y: 850 }, hole: { x: 300, y: 50 }, walls: [{ x: 0, y: 200, w: 150, h: 20, vx: 2, minX: 0, maxX: 150 }, { x: 450, y: 200, w: 150, h: 20, vx: -2, minX: 300, maxX: 450 }, { x: 0, y: 400, w: 200, h: 20, vx: 3, minX: 0, maxX: 100 }, { x: 400, y: 400, w: 100, h: 20, vx: -3, minX: 300, maxX: 500 }], hazards: [{ type: 'water', x: 0, y: 400, w: 600, h: 200 }, { type: 'bridge', x: 150, y: 400, w: 300, h: 200 }, { type: 'sand', x: 50, y: 250, w: 500, h: 80 }, { type: 'water', x: 50, y: 650, w: 550, h: 80 }, { type: 'bridge', x: 250, y: 650, w: 100, h: 80 }] },
    { name: "The Grand Finale", par: 6, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 450, w: 400, h: 30, vx: 4, minX: 50, maxX: 150 }], hazards: [{ type: 'water', x: 50, y: 150, w: 500, h: 250 }, { type: 'bridge', x: 250, y: 150, w: 100, h: 250 }, { type: 'sand', x: 200, y: 500, w: 200, h: 200 }] }
];

const BALL_TYPES = [
    { id: 'standard', name: "Standard", friction: 0.985, bounce: 0.7, mass: 1 },
    { id: 'pro', name: "Pro Tour", friction: 0.980, bounce: 0.5, mass: 1 },
    { id: 'bouncy', name: "Bouncy", friction: 0.990, bounce: 0.9, mass: 0.8 },
    { id: 'heavy', name: "The Rock", friction: 0.970, bounce: 0.4, mass: 1.5 },
    { id: 'neon', name: "Neon", friction: 0.985, bounce: 0.8, mass: 0.9 }
];

const COLOR_CATALOG = [
    { name: 'Pure White', hex: '#ffffff' }, { name: 'Sunshine', hex: '#ffea00' }, { name: 'Sky Blue', hex: '#00ccff' },
    { name: 'Candy Red', hex: '#ff3333' }, { name: 'Neon Purple', hex: '#cf00ff' }, { name: 'Forest', hex: '#2f855a' },
    { name: 'Midnight', hex: '#1a202c' }, { name: 'Gold', hex: '#d69e2e' }, { name: 'Silver', hex: '#a0aec0' },
    { name: 'Pinky', hex: '#ed64a6' }, { name: 'Orange Juice', hex: '#ed8936' }, { name: 'Turquoise', hex: '#38b2ac' },
    { name: 'Lavender', hex: '#b794f4' }, { name: 'Lime', hex: '#9ae6b4' }, { name: 'Maroon', hex: '#822727' },
    { name: 'Navy', hex: '#2a4365' }, { name: 'Grape', hex: '#553c9a' }, { name: 'Teal', hex: '#2c7a7b' },
    { name: 'Rose', hex: '#f687b3' }, { name: 'Brownie', hex: '#744210' }, { name: 'Mint', hex: '#c6f6d5' },
    { name: 'Cyan', hex: '#0bc5ea' }, { name: 'Peach', hex: '#fbd38d' }, { name: 'Olive', hex: '#707020' },
    { name: 'Indigo', hex: '#434190' }, { name: 'Crimson', hex: '#9b2c2c' }, { name: 'Sand', hex: '#f6e05e' },
    { name: 'Slate', hex: '#4a5568' }, { name: 'Emerald', hex: '#059669' }, { name: 'Salmon', hex: '#fa8072' },
    { name: 'Tan', hex: '#d2b48c' }, { name: 'Plum', hex: '#dda0dd' }, { name: 'Sienna', hex: '#a0522d' },
    { name: 'Khaki', hex: '#f0e68c' }, { name: 'Coral', hex: '#ff7f50' }
];

const CONFIG = { ballRadius: 10, holeRadius: 15, maxPower: 25, powerMultiplier: 0.12, stopVelocity: 0.2, subSteps: 10, courseBaseWidth: 600, courseBaseHeight: 900 };

let state = {
    screen: 'screen-splash',
    mode: 'menu', 
    volume: 80,
    username: 'Guest',
    unlockedBalls: ['standard', 'pro', 'bouncy', 'heavy', 'neon'],
    unlockedColors: ['#ffffff'],
    points: 0,
    levelStars: [], // [0]=3 stars, [1]=2 stars etc.
    missionStats: { holesPlayed: 0, sandHits: 0, levelsFinished: 0, totalStrokes: 0, starsEarned: 0 },
    myRole: 'p1', 
    playersReady: {},
    roomId: null,
    selectedColor: '#ffffff',
    selectedBallIdx: 0,
    activeMissions: [], // { id, type, goal, progress, target }

    game: {
        levelIdx: 0,
        turnIdx: 0, // index in activePlayers
        activePlayers: ['p1'], // e.g. ['p1', 'p2']
        players: {
            p1: { active: false, x: 0, y: 0, vx: 0, vy: 0, strokes: 0, color: '#ffffff', ballIdx: 0, state: 'idle' },
            p2: { active: false, x: 0, y: 0, vx: 0, vy: 0, strokes: 0, color: '#ffea00', ballIdx: 0, state: 'idle' },
            p3: { active: false, x: 0, y: 0, vx: 0, vy: 0, strokes: 0, color: '#00ccff', ballIdx: 0, state: 'idle' },
            p4: { active: false, x: 0, y: 0, vx: 0, vy: 0, strokes: 0, color: '#ff3333', ballIdx: 0, state: 'idle' },
        },
        state: 'idle', // idle, moving, holed, water
        waterTimer: 0
    },

    camera: { x: 0, y: 0, scale: 1 },
    isDragging: false, dragStart: { x: 0, y: 0 }, dragCurrent: { x: 0, y: 0 }
};

let canvas, ctx;

const P_COLORS = { p1: '#ffffff', p2: '#ffea00', p3: '#00ccff', p4: '#ff3333' };

// --- LOCAL STORAGE ---
function loadLocalData() {
    try {
        const d = localStorage.getItem('minigolf_data');
        if (d) {
            const data = JSON.parse(d);
            if (data.username) {
                state.username = data.username;
                const mi = document.getElementById('username-input');
                if (mi) mi.value = state.username;
                const mn = document.getElementById('main-mini-name');
                if (mn) mn.innerText = state.username;
                const ma = document.getElementById('main-mini-avatar');
                if (ma) ma.innerText = (state.username[0] || 'G').toUpperCase();
            }
            state.unlockedBalls = ['standard', 'pro', 'bouncy', 'heavy', 'neon']; // Always unlocked now
            state.unlockedColors = data.unlockedColors || ['#ffffff'];
            state.points = data.points || 0;
            state.levelStars = data.levelStars || [];
            state.missionStats = data.missionStats || { holesPlayed: 0, sandHits: 0, levelsFinished: 0, totalStrokes: 0, starsEarned: 0 };
            state.activeMissions = data.activeMissions || [];
            if (state.activeMissions.length === 0) populateMissions();
            state.selectedColor = data.selectedColor || '#ffffff';
            state.selectedBallIdx = data.selectedBallIdx || 0;
            if (state.game.players.p1) {
                state.game.players.p1.ballIdx = state.selectedBallIdx;
                state.game.players.p1.color = state.selectedColor;
            }
            refreshPointsDisplay();
        }
    } catch(e){}
}

function saveLocalData() {
    try {
        localStorage.setItem('minigolf_data', JSON.stringify({
            username: state.username,
            unlockedColors: state.unlockedColors,
            points: state.points,
            levelStars: state.levelStars,
            missionStats: state.missionStats,
            activeMissions: state.activeMissions,
            selectedColor: state.selectedColor,
            selectedBallIdx: state.selectedBallIdx
        }));
    } catch(e){}
}

function refreshPointsDisplay() {
    const el = document.getElementById('player-points');
    if (el) el.innerText = state.points;
    const btn = document.getElementById('btn-spin');
    if (btn) btn.disabled = (state.points < 100);
    
    if (state.activeMissions.length === 0) populateMissions();
    refreshMissionsUI();
}

const MISSION_POOL = [
    { id: 'm1', title: 'Hole Hunter', desc: 'Finish 3 levels', type: 'holes', target: 3 },
    { id: 'm2', title: 'Sand Specialist', desc: 'Hit 4 sand traps', type: 'sand', target: 4 },
    { id: 'm3', title: 'Star Student', desc: 'Earn 6 stars total', type: 'stars', target: 6 },
    { id: 'm4', title: 'Precision Play', desc: 'Finish a hole in 1 shot', type: 'perfect', target: 1 },
    { id: 'm5', title: 'Power Hitter', desc: 'Hit the ball 20 times', type: 'hits', target: 20 },
    { id: 'm6', title: 'Course Master', desc: 'Finish 8 holes total', type: 'holes', target: 8 },
    { id: 'm7', title: 'Golden Arm', desc: 'Finish with 3 stars', type: 'winStars', target: 1 },
    { id: 'm8', title: 'Avoid the Beach', desc: 'Hit 8 sand traps', type: 'sand', target: 8 }
];

function populateMissions() {
    state.activeMissions = [];
    const pool = [...MISSION_POOL];
    for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const m = pool.splice(idx, 1)[0];
        state.activeMissions.push({ ...m, progress: 0 });
    }
}

function updateMissionProgress(type, val = 1) {
    state.activeMissions.forEach(m => {
        if (m.type === type && m.progress < m.target) {
            m.progress = Math.min(m.target, m.progress + val);
        }
    });
    saveLocalData();
}

function refreshMissionsUI() {
    state.activeMissions.forEach((m, i) => {
        const slot = document.getElementById(`m-slot-${i}`);
        if (!slot) return;
        const isDone = m.progress >= m.target;
        const perc = (m.progress / m.target) * 100;
        
        slot.innerHTML = `
            <div class="m-title">${m.title}</div>
            <div class="m-goal">${m.desc}</div>
            <div class="m-progress-container">
                <div class="m-bar-root"><div class="m-bar-fill" style="width: ${perc}%"></div></div>
                <span class="m-txt">${Math.floor(m.progress)}/${m.target}</span>
            </div>
            <div class="m-footer">
                <span class="m-reward-tag">+25 PTS</span>
                ${isDone ? `<button class="btn-claim" onclick="claimMission(${i})">CLAIM</button>` : ''}
            </div>
        `;
    });
}

window.claimMission = (idx) => {
    state.points += 25;
    // Replace with new mission
    const currentIds = state.activeMissions.map(m => m.id);
    const available = MISSION_POOL.filter(m => !currentIds.includes(m.id));
    const newM = available[Math.floor(Math.random() * available.length)];
    state.activeMissions[idx] = { ...newM, progress: 0 };
    
    saveLocalData();
    refreshPointsDisplay();
};

function refreshLevelGrid() {
    const lg = document.getElementById('level-grid');
    lg.innerHTML = '';
    LEVELS.forEach((lvl, i) => {
        const d = document.createElement('div');
        d.className = 'level-box';
        const stars = state.levelStars[i] || 0;
        let sHtml = '';
        for(let j=0; j<3; j++) sHtml += `<span class="${j < stars ? 'earned' : ''}">★</span>`;
        d.innerHTML = `<div>${i + 1}</div><div class="level-stars">${sHtml}</div>`;
        d.onclick = () => { startSoloGame(i); };
        lg.appendChild(d);
    });
}

function refreshProfileStats() {
    const holes = state.missionStats.holesPlayed || 0;
    const strokes = state.missionStats.totalStrokes || 0;
    const stars = state.missionStats.starsEarned || 0;
    
    document.getElementById('p-holes').innerText = holes;
    document.getElementById('p-strokes').innerText = strokes;
    document.getElementById('p-stars').innerText = stars;

    // Name and Avatar
    const pInput = document.getElementById('p-username-input');
    if (pInput) {
        pInput.value = state.username;
        document.getElementById('p-avatar-circle').innerText = (state.username[0] || 'P').toUpperCase();
    }

    // Progress Bar
    const levelsCleared = state.levelStars.filter(s => s > 0).length;
    const progressPercent = (levelsCleared / LEVELS.length) * 100;
    const fill = document.getElementById('p-progress-fill');
    if (fill) fill.style.width = progressPercent + '%';
    const pText = document.getElementById('p-progress-text');
    if (pText) pText.innerText = `${levelsCleared} / ${LEVELS.length} Levels Cleared`;
}

// --- UI MANAGEMENT ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    state.screen = id;
    if (id === 'screen-profile') refreshProfileStats();
    if (id === 'screen-levels') refreshLevelGrid();
    if (id === 'screen-rewards' || id === 'screen-main-menu' || id === 'screen-missions') refreshPointsDisplay();
    if (id === 'screen-balls') refreshBallsUI();
    if (id === 'screen-leaderboard') {
        const firstGridItem = document.querySelector('.lb-grid-item');
        if (firstGridItem) firstGridItem.click();
    }
}

function initUI() {
    loadLocalData();
    refreshLevelGrid();

    // Nav Buttons
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            if (target === 'screen-main-menu' && state.mode === 'multi') leaveLobby();
            state.mode = 'menu';
            showScreen(target);
        });
    });

    // Splash Play
    document.getElementById('btn-splash-play').addEventListener('click', () => showScreen('screen-main-menu'));

    // Sync Usernames
    const mainNameInput = document.getElementById('username-input');
    const profileNameInput = document.getElementById('p-username-input');
    
    const updateName = (val) => {
        state.username = val.trim() || 'Guest';
        if (mainNameInput) mainNameInput.value = state.username;
        if (profileNameInput) profileNameInput.value = state.username;
        
        const av = document.getElementById('p-avatar-circle');
        if (av) av.innerText = (state.username[0] || 'P').toUpperCase();
        
        const mn = document.getElementById('main-mini-name');
        if (mn) mn.innerText = state.username;
        const ma = document.getElementById('main-mini-avatar');
        if (ma) ma.innerText = (state.username[0] || 'G').toUpperCase();

        saveLocalData();
    };

    if (mainNameInput) mainNameInput.addEventListener('input', (e) => updateName(e.target.value));
    if (profileNameInput) profileNameInput.addEventListener('input', (e) => updateName(e.target.value));

    // Nav Bindings
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.addEventListener('click', () => {
             const target = btn.getAttribute('data-target');
             if (target === 'screen-leaderboard') {
                 // Already handled in showScreen but good to have
             }
        });
    });

    // Leaderboard Grid Selector Logic
    const lbBtn = document.getElementById('btn-lb-level-select');
    const lbOverlay = document.getElementById('lb-grid-overlay');
    const lbGrid = document.getElementById('lb-level-grid');
    const lbLabel = document.getElementById('lb-current-lvl-label');

    if (lbBtn && lbOverlay) {
        lbBtn.onclick = (e) => {
            e.stopPropagation();
            lbOverlay.classList.toggle('hidden');
        };
        // Close if click outside
        window.addEventListener('click', () => lbOverlay.classList.add('hidden'));
        lbOverlay.onclick = (e) => e.stopPropagation();
    }

    if (lbGrid) {
        lbGrid.innerHTML = '';
        LEVELS.forEach((_, i) => {
            const item = document.createElement('div');
            item.className = 'lb-grid-item';
            item.innerText = i + 1;
            item.onclick = () => {
                document.querySelectorAll('.lb-grid-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                lbLabel.innerText = `LEVEL ${i + 1}`;
                lbOverlay.classList.add('hidden');
                refreshLeaderboard(i);
            };
            lbGrid.appendChild(item);
        });
    }

    // --- GEAR WORKSHOP POPULATION ---
    window.refreshBallsUI = () => {
        const bDiv = document.getElementById('ball-inventory');
        if (bDiv) {
            bDiv.innerHTML = '';
            BALL_TYPES.forEach((b, i) => {
                const el = document.createElement('div');
                const isLocked = !state.unlockedBalls.includes(b.id);
                el.className = `ball-icon-modern ${i === state.selectedBallIdx ? 'selected' : ''} ${isLocked ? 'locked' : ''}`;
                el.innerHTML = isLocked ? "🔒" : (b.name[0] || 'G');
                el.onclick = () => {
                    if (isLocked) return;
                    state.selectedBallIdx = i;
                    document.querySelectorAll('.ball-icon-modern').forEach(e => e.classList.remove('selected'));
                    el.classList.add('selected');
                    updateGearVisuals();
                };
                bDiv.appendChild(el);
            });
        }
        refreshColorCatalog();
        updateGearVisuals();
    };

    const refreshColorCatalog = () => {
        const cGrid = document.getElementById('color-catalog-grid');
        if (!cGrid) return;
        cGrid.innerHTML = '';
        COLOR_CATALOG.forEach(c => {
            const el = document.createElement('div');
            const isLocked = !state.unlockedColors.includes(c.hex);
            el.className = `color-chip ${state.selectedColor === c.hex ? 'selected' : ''} ${isLocked ? 'locked' : ''}`;
            el.style.backgroundColor = c.hex;
            el.onclick = () => {
                if (isLocked) return;
                state.selectedColor = c.hex;
                document.querySelectorAll('.color-chip').forEach(e => e.classList.remove('selected'));
                el.classList.add('selected');
                updateGearVisuals();
            };
            cGrid.appendChild(el);
        });
    };

    const updateGearVisuals = () => {
        const b = BALL_TYPES[state.selectedBallIdx];
        const isLocked = !state.unlockedBalls.includes(b.id);
        const col = state.selectedColor;

        document.getElementById('ball-name-display').innerText = b.name.toUpperCase();
        const display = document.getElementById('ball-display-large');
        if (display) {
            display.style.backgroundColor = col;
            display.style.opacity = isLocked ? "0.5" : "1";
        }

        const bounceBar = document.getElementById('bar-bounce');
        if (bounceBar) bounceBar.style.width = (b.bounce * 100) + '%';
        const frictionBar = document.getElementById('bar-friction');
        if (frictionBar) frictionBar.style.width = (b.friction * 100) + '%';
        const weightBar = document.getElementById('bar-weight');
        if (weightBar) weightBar.style.width = (b.mass * 60) + '%';

        state.game.players['p1'].ballIdx = state.selectedBallIdx;
        state.game.players['p1'].color = col;
        saveLocalData();
    };

    // --- REWARDS & SPIN LOGIC ---
    let isSpinning = false;
    const spinRoulette = () => {
        if (isSpinning || state.points < 100) return;
        
        const lockedColors = COLOR_CATALOG.filter(c => !state.unlockedColors.includes(c.hex));
        if (lockedColors.length === 0) {
            alert("Wow! You unlocked ALL colors!");
            return;
        }

        isSpinning = true;
        state.points -= 100;
        refreshPointsDisplay();
        saveLocalData();

        const wheel = document.getElementById('roulette-inner');
        const resultBox = document.getElementById('roulette-result');
        const winColor = lockedColors[Math.floor(Math.random() * lockedColors.length)];

        // Visual "Spin" animation via rotation
        const extraRot = 360 * 5; // 5 full spins
        const finalRot = extraRot + (Math.random() * 360);
        wheel.style.transform = `rotate(${finalRot}deg)`;

        // After 4s (matching CSS transition)
        setTimeout(() => {
            state.unlockedColors.push(winColor.hex);
            saveLocalData();
            resultBox.style.backgroundColor = winColor.hex;
            resultBox.innerText = '✓';
            isSpinning = false;
            alert(`UNLOCKED: ${winColor.name.toUpperCase()}!`);
        }, 4000);
    };

    document.getElementById('btn-spin').addEventListener('click', spinRoulette);

    refreshBallsUI();

    // Multiplayer bindings
    document.getElementById('btn-join-room').addEventListener('click', joinLobby);
    document.getElementById('btn-ready').addEventListener('click', toggleReady);
    
    // Auto-generate a room code when entering the multiplayer screen
    document.querySelector('.btn-nav[data-target="screen-multiplayer"]').addEventListener('click', () => {
        document.getElementById('room-input').value = generateRoomCode();
    });

    const ls = document.getElementById('lobby-level-select');
    LEVELS.forEach((lvl, i) => {
        const o = document.createElement('option'); o.value = i; o.innerText = `Lvl ${i + 1}: ${lvl.name}`;
        ls.appendChild(o);
    });
    ls.addEventListener('change', (e) => {
        if (state.myRole === 'p1') broadcastLobby({ type: 'level', val: e.target.value });
    });

    // In-game Pause/Restart
    document.getElementById('btn-pause').addEventListener('click', () => showScreen('screen-levels')); // back to levels
    document.getElementById('btn-next-level').addEventListener('click', () => {
        if (state.mode === 'multi' && state.myRole === 'p1') {
            broadcastLobby({ type: 'start_level', val: state.game.levelIdx + 1 });
        } else if (state.mode === 'solo') {
            startSoloGame(state.game.levelIdx + 1);
        }
    });

    // Sliders
    const volMaster = document.getElementById('vol-master');
    if (volMaster) volMaster.addEventListener('input', (e) => state.volume = e.target.value);
    
    const volMusic = document.getElementById('vol-music');
    if (volMusic) volMusic.addEventListener('input', (e) => {
        // Logic for music volume if needed
    });
}

// --- LOGIC: SOLO ---
function startSoloGame(lvlIdx) {
    if (lvlIdx >= LEVELS.length) { showScreen('game-over'); return; }
    state.mode = 'solo';
    state.game.levelIdx = lvlIdx;
    state.game.activePlayers = ['p1'];

    const p1 = state.game.players.p1;
    p1.active = true;
    p1.x = LEVELS[lvlIdx].startInfo.x; p1.y = LEVELS[lvlIdx].startInfo.y;
    p1.strokes = 0; p1.state = 'idle'; p1.vx = 0; p1.vy = 0;

    state.game.turnIdx = 0;
    state.game.state = 'idle';
    setupHUD();
    updateCamera();
    showScreen('hud');
}

// --- LOGIC: MULTIPLAYER LOBBY ---
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
}

function updateLobbyUI() {
    const ap = state.game.activePlayers;
    const allReady = ap.every(role => state.playersReady[role]);
    const waitMsg = document.getElementById('lobby-wait-msg');

    if (ap.length === 1 && state.playersReady[state.myRole]) {
        // Solo host: hide wait msg and let checkAllReady trigger start
        if (waitMsg) waitMsg.classList.add('hidden');
    } else if (ap.length > 1 && !allReady) {
        // Multiple players: show wait msg if not all are ready
        if (waitMsg) {
            waitMsg.classList.remove('hidden');
            waitMsg.innerText = "Waiting for other players to be ready...";
        }
    } else {
        if (waitMsg) waitMsg.classList.add('hidden');
    }
}

async function joinLobby() {
    const name = document.getElementById('username-input').value.trim() || 'Guest';
    const code = document.getElementById('room-input').value.trim() || 'party1';
    state.username = name;
    state.roomId = code;
    
    if (!supabaseClient) { alert("Supabase config invalid"); return; }

    document.getElementById('mp-join-section').classList.add('hidden');
    document.getElementById('mp-room-section').classList.remove('hidden');
    document.getElementById('display-room-id').innerText = code;
    document.getElementById('mp-status').innerText = "Connecting...";

    channel = supabaseClient.channel(code, {
        config: { broadcast: { self: true }, presence: { key: Math.random().toString(36).substring(7) } }
    });

    channel
        .on('presence', { event: 'sync' }, () => {
            const pres = channel.presenceState();
            let arr = [];
            // presenceState returns an object where keys are the presence keys we set (random strings)
            for (let k in pres) {
                if (pres[k][0]) arr.push({ key: k, joinedAt: pres[k][0].joinedAt, ballColor: pres[k][0].ballColor, uName: pres[k][0].uName || 'Guest' });
            }
            arr = arr.sort((a, b) => a.joinedAt - b.joinedAt); // Sort by join time
            
            // Assign roles 1-4 based on order
            state.game.activePlayers = [];
            document.querySelectorAll('.player-slot').forEach(el => {
                el.className = 'player-slot';
                el.querySelector('.slot-name').innerText = 'Empty';
                el.querySelector('.status-badge').innerText = '';
            });
            
            arr.forEach((p, idx) => {
                if (idx > 3) return; // Only 4 players max
                const role = `p${idx + 1}`;
                state.game.activePlayers.push(role);
                state.game.players[role].active = true;
                state.game.players[role].color = p.ballColor || P_COLORS[role];
                state.game.players[role].name = p.uName;

                if (p.key === state.myPresenceId) state.myRole = role;

                const slot = document.getElementById(`slot-p${idx + 1}`);
                if (slot) {
                    slot.classList.add('filled');
                    slot.querySelector('.slot-name').innerText = p.uName + (state.myRole === role ? " (YOU)" : "");
                    if (state.playersReady[role]) {
                        slot.classList.add('ready');
                        slot.querySelector('.status-badge').innerText = 'READY';
                    } else {
                        slot.classList.remove('ready');
                        slot.querySelector('.status-badge').innerText = '';
                    }
                }
            });
            
            updateLobbyUI();
            document.getElementById('mp-status').innerText = `You are ${state.myRole?.toUpperCase() || 'Spectating'}`;
            if (state.myRole !== 'p1') document.getElementById('lobby-level-select').disabled = true;
        })
        .on('broadcast', { event: 'lobby' }, ({ payload }) => {
            if (payload.type === 'ready') {
                state.playersReady[payload.role] = payload.val;
                const slot = document.getElementById(`slot-${payload.role}`);
                if (slot) {
                    if (payload.val) { slot.classList.add('ready'); slot.querySelector('.status-badge').innerText = 'READY'; }
                    else { slot.classList.remove('ready'); slot.querySelector('.status-badge').innerText = ''; }
                }
                updateLobbyUI();
                checkAllReady();
            } else if (payload.type === 'level') {
                document.getElementById('lobby-level-select').value = payload.val;
                state.game.levelIdx = parseInt(payload.val);
            } else if (payload.type === 'start_level') {
                startMultiGame(payload.val);
            }
        })
        .on('broadcast', { event: 'game' }, ({ payload }) => {
            handleMultiGameEvent(payload);
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                state.myPresenceId = Math.random().toString(36).substring(7);
                await channel.track({
                    joinedAt: Date.now(),
                    ballColor: state.game.players['p1'].color,
                    uName: state.username
                });
            }
        });
}

function leaveLobby() {
    if (channel) { supabaseClient.removeChannel(channel); channel = null; }
    state.joined = false; state.myRole = 'p1';
    document.getElementById('mp-join-section').classList.remove('hidden');
    document.getElementById('mp-room-section').classList.add('hidden');
}

function toggleReady() {
    if (!state.joined) return;
    const isR = !state.playersReady[state.myRole];
    state.playersReady[state.myRole] = isR;
    broadcastLobby({ type: 'ready', role: state.myRole, val: isR });
}

function broadcastLobby(payload) {
    if (channel) channel.send({ type: 'broadcast', event: 'lobby', payload });
}

function checkAllReady() {
    if (state.myRole !== 'p1') return; // Only host (P1) starts
    
    const joinedRoles = state.game.activePlayers;
    if (joinedRoles.length === 0) return;

    let everyoneReady = true;
    joinedRoles.forEach(role => {
        if (!state.playersReady[role]) everyoneReady = false;
    });

    if (everyoneReady) {
        const lvl = parseInt(document.getElementById('lobby-level-select').value) || 0;
        broadcastLobby({ type: 'start_level', val: lvl });
    }
}

function startMultiGame(lvlIdx) {
    state.mode = 'multi';
    state.game.levelIdx = lvlIdx;

    // Position players around start
    const start = LEVELS[lvlIdx].startInfo;
    const offsets = [{ x: -20, y: 0 }, { x: 20, y: 0 }, { x: 0, y: -20 }, { x: 0, y: 20 }];

    state.game.activePlayers.forEach((r, i) => {
        const p = state.game.players[r];
        p.x = start.x + offsets[i].x; p.y = start.y + offsets[i].y;
        p.strokes = 0; p.state = 'idle'; p.vx = 0; p.vy = 0;
    });

    state.game.turnIdx = 0;
    state.game.state = 'idle';
    setupHUD();
    updateCamera();
    showScreen('hud');
    toastAnnounceTurn();
}

function handleMultiGameEvent(payload) {
    if (payload.action === 'shot') {
        const p = state.game.players[payload.role];
        p.vx = payload.vx; p.vy = payload.vy; p.strokes = payload.strokes; p.state = 'moving';
        state.game.turnIdx = payload.turnIdx;
        refreshHUD();
    } else if (payload.action === 'pos') {
        const p = state.game.players[payload.role];
        p.x = payload.x; p.y = payload.y; p.vx = 0; p.vy = 0; p.state = payload.state;
        state.game.turnIdx = payload.turnIdx;
        refreshHUD();
        checkLevelEnd();
    } else if (payload.action === 'water') {
        const p = state.game.players[payload.role];
        p.x = payload.x; p.y = payload.y; p.strokes = payload.strokes; p.state = 'idle';
        p.vx = 0; p.vy = 0;
        state.game.turnIdx = payload.turnIdx;
        refreshHUD();
    }
}

// --- HUD & GAME LOGIC ---
function setupHUD() {
    const cont = document.getElementById('hud-multi-scores');
    if (!cont) return;
    cont.innerHTML = '';
    state.game.activePlayers.forEach(r => {
        const d = document.createElement('div');
        const pData = state.game.players[r];
        d.className = `hud-p-box`;
        d.id = `scorebox-${r}`;
        d.style.borderColor = P_COLORS[r];
        const labelText = (state.mode === 'solo') ? 'HITS' : (pData.name || r).toUpperCase();
        d.innerHTML = `<span class="p-name" style="color:#000">${labelText}</span><span class="p-score" id="scoreval-${r}">0</span>`;
        cont.appendChild(d);
    });
    const lvlNum = document.getElementById('hud-level-num');
    if (lvlNum) lvlNum.innerText = state.game.levelIdx + 1;
    refreshHUD();
}

function refreshHUD() {
    state.game.activePlayers.forEach(r => {
        const val = document.getElementById(`scoreval-${r}`);
        if (val) val.innerText = state.game.players[r].strokes;

        const box = document.getElementById(`scorebox-${r}`);
        if (box) {
            if (activePlayerKey() === r) box.classList.add('active-turn');
            else box.classList.remove('active-turn');
        }
    });
}

function activePlayerKey() {
    if (state.mode === 'solo') return 'p1';
    return state.game.activePlayers[state.game.turnIdx];
}

function toastAnnounceTurn() {
    if (state.mode === 'solo') return;
    const t = document.getElementById('turn-announcer');
    t.classList.remove('hidden');
    // restart anim
    t.style.animation = 'none';
    t.offsetHeight; // trigger reflow
    t.style.animation = null;
    t.innerText = `${activePlayerKey().toUpperCase()}'s TURN`;
    t.style.backgroundColor = P_COLORS[activePlayerKey()];
}

function advanceTurn() {
    if (state.mode === 'solo') {
        state.game.state = 'idle';
        return;
    }

    // Find next player who is NOT holed
    let nextIdx = state.game.turnIdx;
    for (let i = 0; i < state.game.activePlayers.length; i++) {
        nextIdx = (nextIdx + 1) % state.game.activePlayers.length;
        if (state.game.players[state.game.activePlayers[nextIdx]].state !== 'holed') break;
    }
    state.game.turnIdx = nextIdx;
    toastAnnounceTurn();
}

function checkLevelEnd() {
    let allHoled = true;
    state.game.activePlayers.forEach(r => { if (state.game.players[r].state !== 'holed') allHoled = false; });

    if (allHoled) {
        // Reward 25 Points for finishing
        state.points += 25;
        refreshPointsDisplay();
        saveLocalData();

        setTimeout(() => { 
            showLevelComplete(); 
            saveScoreToSupabase(); // Save local player score
        }, 1000);
    }
}

async function saveScoreToSupabase() {
    if (!supabaseClient) return;
    const p1 = state.game.players['p1'];
    const { error } = await supabaseClient
        .from('scores')
        .insert([{ 
            username: state.username, 
            level_idx: state.game.levelIdx + 1, 
            strokes: p1.strokes 
        }]);
    
    if (error) console.error("Score save error:", error);
}

async function refreshLeaderboard(lvlIdx) {
    if (!supabaseClient) return;
    const list = document.getElementById('lb-list');
    list.innerHTML = `<div class="lb-loading">Searching for champions of Level ${lvlIdx + 1}...</div>`;
    
    const { data, error } = await supabaseClient
        .from('scores')
        .select('*')
        .eq('level_idx', lvlIdx + 1)
        .order('strokes', { ascending: true })
        .limit(20);
    
    if (error) { list.innerHTML = "Error loading leaderboard."; return; }
    
    if (data.length === 0) {
        list.innerHTML = `<div class="lb-loading" style="color: #a0aec0">No one has finished this level yet. Be the first!</div>`;
        return;
    }

    list.innerHTML = '';
    data.forEach((row, i) => {
        const d = document.createElement('div');
        d.className = 'lb-entry';
        const rankClass = (i < 3) ? `entry-rank-${i + 1}` : '';
        d.innerHTML = `
            <div class="entry-rank ${rankClass}">${i + 1}</div>
            <div class="entry-name">${row.username}</div>
            <div class="entry-score">${row.strokes} SHOTS</div>
        `;
        list.appendChild(d);
    });
}

function showLevelComplete() {
    const sb = document.getElementById('lc-scoreboard');
    if (sb) sb.innerHTML = '';

    const parEl = document.getElementById('lc-par');
    const currentPar = LEVELS[state.game.levelIdx].par;
    if (parEl) parEl.innerText = currentPar;

    if (state.mode === 'multi') {
        state.game.activePlayers.forEach(r => {
            const p = state.game.players[r];
            const row = document.createElement('div');
            row.className = 'sb-row';
            row.innerHTML = `<span style="color:${P_COLORS[r]}">${r.toUpperCase()}</span><span>${p.strokes}</span>`;
            if (sb) sb.appendChild(row);
        });
    }

    if (state.mode === 'solo') {
        const strokes = state.game.players['p1'].strokes;
        document.getElementById('lc-score').innerText = strokes;
        let earned = 1;
        if (strokes <= currentPar) earned = 3;
        else if (strokes <= currentPar + 1) earned = 2;
        
        let prevStars = state.levelStars[state.game.levelIdx] || 0;
        if (earned > prevStars) {
            state.missionStats.starsEarned += (earned - prevStars);
            state.levelStars[state.game.levelIdx] = earned;
        }
        state.missionStats.totalStrokes += strokes;
        updateMissionProgress('holes', 1);
        updateMissionProgress('stars', earned);
        if (earned === 3) updateMissionProgress('winStars', 1);
        if (strokes === 1) updateMissionProgress('perfect', 1);
        saveLocalData();
        
        // UI Animated Stars Pop-in (Centered)
        const starsCont = document.getElementById('lc-stars-container');
        if (starsCont) {
            starsCont.innerHTML = '';
            for(let i=1; i<=earned; i++) {
                const s = document.createElement('span');
                s.className = 'v-star s-hidden';
                s.innerText = '★';
                starsCont.appendChild(s);
                setTimeout(() => s.classList.remove('s-hidden'), 600 + (i * 300));
            }
        }
        
        const nextBtn = document.getElementById('btn-next-level');
        if (nextBtn) nextBtn.style.display = 'block';
    } else {
        const nextBtn = document.getElementById('btn-next-level');
        if (nextBtn) nextBtn.style.display = state.myRole === 'p1' ? 'block' : 'none';
    }

    const title = document.getElementById('lc-title');
    if (title) title.innerText = "HOLE COMPLETE";
    showScreen('level-complete');
    triggerConfetti();
}

function triggerConfetti() {
    const cont = document.getElementById('confetti-container');
    if (!cont) return;
    cont.innerHTML = '';
    for(let i=0; i<40; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.left = Math.random()*100 + '%';
        c.style.animationDelay = Math.random()*2 + 's';
        c.style.backgroundColor = `hsl(${Math.random()*360}, 70%, 50%)`;
        cont.appendChild(c);
    }
}

function spawnHoleParticles(x, y, color) {
    for(let i = 0; i < 25; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 12, 
            vy: (Math.random() - 0.5) * 12 - 3,
            life: 1.0, color: color
        });
    }
}

// --- INPUT & PHYSICS ---
function setupInput() {
    const canvas = document.getElementById('game-canvas');
    const down = (e) => {
        if (state.screen !== 'hud') return;
        const cp = activePlayerKey();
        if (state.game.players[cp].state !== 'idle') return;
        if (state.mode === 'multi' && cp !== state.myRole) return; // not your turn

        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        state.dragStart = { x: (clientX - rect.left - state.camera.x) / state.camera.scale, y: (clientY - rect.top - state.camera.y) / state.camera.scale };
        state.isDragging = true;
        state.dragCurrent = { ...state.dragStart };
    };

    const move = (e) => {
        if (!state.isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        state.dragCurrent = { x: (clientX - rect.left - state.camera.x) / state.camera.scale, y: (clientY - rect.top - state.camera.y) / state.camera.scale };
    };

    const up = () => {
        if (!state.isDragging) return;
        state.isDragging = false;

        const dx = state.dragStart.x - state.dragCurrent.x;
        const dy = state.dragStart.y - state.dragCurrent.y;
        const pwr = Math.min(Math.sqrt(dx * dx + dy * dy) * CONFIG.powerMultiplier, CONFIG.maxPower);

        if (pwr > 0.8) {
            const pk = activePlayerKey();
            const p = state.game.players[pk];
            p.prevX = p.x; p.prevY = p.y; // for water
            p.vx = Math.cos(Math.atan2(dy, dx)) * pwr;
            p.vy = Math.sin(Math.atan2(dy, dx)) * pwr;
            p.state = 'moving';
            p.strokes++;
            updateMissionProgress('hits', 1);

            refreshHUD();
            if (state.mode === 'multi') {
                if (channel) channel.send({ type: 'broadcast', event: 'game', payload: { action: 'shot', role: pk, vx: p.vx, vy: p.vy, strokes: p.strokes, turnIdx: state.game.turnIdx } });
            }
        }
    };

    window.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchstart', down, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
}

function updatePhysics() {
    if (state.screen !== 'hud') return;

    const lvl = LEVELS[state.game.levelIdx];

    // Handle moving walls
    lvl.walls.forEach(w => {
        if (w.vx) {
            w.x += w.vx;
            if (w.x > w.maxX || w.x < w.minX) w.vx *= -1;
        }
        if (w.vy) {
            w.y += w.vy;
            if (w.y > w.maxY || w.y < w.minY) w.vy *= -1;
        }
    });

    // Handle moving hazards
    lvl.hazards.forEach(h => {
        if (h.vx) {
            h.x += h.vx;
            if (h.x > h.maxX || h.x < h.minX) h.vx *= -1;
        }
        if (h.vy) {
            h.y += h.vy;
            if (h.y > h.maxY || h.y < h.minY) h.vy *= -1;
        }
    });

    // Only process physics on host in multi, or local if solo, to prevent sync issues causing jitter.
    // ACTUALLY, simpler: process physics locally for active player.
    const pk = activePlayerKey();
    const p = state.game.players[pk];
    if (p.state !== 'moving') return;

    // If multiplayer, only the person WHO SHOT computes it and sends final pos!
    if (state.mode === 'multi' && pk !== state.myRole) return;

    let inWater = false; let inSand = false; let onBridge = false;

    lvl.hazards.forEach(h => {
        if (p.x > h.x && p.x < h.x + h.w && p.y > h.y && p.y < h.y + h.h) {
            if (h.type === 'bridge') onBridge = true;
            else if (h.type === 'sand') {
                if (!p.wasInSand) updateMissionProgress('sand', 1);
                inSand = true;
            }
            else if (h.type === 'water') inWater = true;
        }
    });

    p.wasInSand = inSand;

    if (onBridge) inWater = false;

    if (inWater) {
        // Water Logic
        p.state = 'idle'; p.vx = 0; p.vy = 0; p.x = p.prevX; p.y = p.prevY; p.strokes++;
        advanceTurn(); refreshHUD();
        if (state.mode === 'multi' && channel) {
            channel.send({ type: 'broadcast', event: 'game', payload: { action: 'water', role: pk, x: p.x, y: p.y, strokes: p.strokes, turnIdx: state.game.turnIdx } });
        }
        return;
    }

    const bProps = BALL_TYPES[p.ballIdx];
    let friction = inSand ? 0.93 : bProps.friction;

    const dt = 1 / CONFIG.subSteps;
    for (let i = 0; i < CONFIG.subSteps; i++) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= Math.pow(friction, dt); p.vy *= Math.pow(friction, dt);

        // Wall
        lvl.walls.forEach(w => {
            let cx = Math.max(w.x, Math.min(p.x, w.x + w.w));
            let cy = Math.max(w.y, Math.min(p.y, w.y + w.h));
            let dx = p.x - cx; let dy = p.y - cy;
            if (dx * dx + dy * dy < CONFIG.ballRadius ** 2) {
                let d = Math.sqrt(dx * dx + dy * dy) || 1;
                p.x += (dx / d) * (CONFIG.ballRadius - d); p.y += (dy / d) * (CONFIG.ballRadius - d);
                let dot = p.vx * (dx / d) + p.vy * (dy / d);
                if (dot < 0) { p.vx = (p.vx - 2 * dot * (dx / d)) * bProps.bounce; p.vy = (p.vy - 2 * dot * (dy / d)) * bProps.bounce; }
            }
        });

        // Course Boundary Bounce (Keep ball inside 0-600, 0-900)
        if (p.x < CONFIG.ballRadius) { p.x = CONFIG.ballRadius; p.vx *= -0.7; }
        if (p.x > CONFIG.courseBaseWidth - CONFIG.ballRadius) { p.x = CONFIG.courseBaseWidth - CONFIG.ballRadius; p.vx *= -0.7; }
        if (p.y < CONFIG.ballRadius) { p.y = CONFIG.ballRadius; p.vy *= -0.7; }
        if (p.y > CONFIG.courseBaseHeight - CONFIG.ballRadius) { p.y = CONFIG.courseBaseHeight - CONFIG.ballRadius; p.vy *= -0.7; }
    }

    // Hole
    const dx = p.x - lvl.hole.x; const dy = p.y - lvl.hole.y;
    if (dx * dx + dy * dy < CONFIG.holeRadius ** 2 && (p.vx ** 2 + p.vy ** 2) < 40) {
        p.state = 'holed'; p.vx = 0; p.vy = 0;
        spawnHoleParticles(lvl.hole.x, lvl.hole.y, p.color);
        advanceTurn(); refreshHUD(); checkLevelEnd();
        if (state.mode === 'multi' && channel) {
            channel.send({ type: 'broadcast', event: 'game', payload: { action: 'pos', role: pk, x: p.x, y: p.y, state: p.state, turnIdx: state.game.turnIdx } });
        }
    } else if (p.vx ** 2 + p.vy ** 2 < CONFIG.stopVelocity) {
        p.state = 'idle'; p.vx = 0; p.vy = 0;
        advanceTurn(); refreshHUD();
        if (state.mode === 'multi' && channel) {
            channel.send({ type: 'broadcast', event: 'game', payload: { action: 'pos', role: pk, x: p.x, y: p.y, state: p.state, turnIdx: state.game.turnIdx } });
        }
    }
}

// --- RENDER ---
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (state.screen !== 'hud' && state.screen !== 'level-complete' && state.screen !== 'game-over') return;

    ctx.save();
    ctx.translate(state.camera.x, state.camera.y);
    ctx.scale(state.camera.scale, state.camera.scale);

    const lvl = LEVELS[state.game.levelIdx];

    // Realistic Grass with Border
    ctx.fillStyle = '#2d5a27'; // Dark Earth
    ctx.fillRect(-10, -10, CONFIG.courseBaseWidth + 20, CONFIG.courseBaseHeight + 20);
    ctx.fillStyle = '#4e9c45'; // Lush Grass
    ctx.fillRect(0, 0, CONFIG.courseBaseWidth, CONFIG.courseBaseHeight);
    
    // Grid/Texture effect
    ctx.strokeStyle = 'rgba(0,0,0,0.03)';
    ctx.lineWidth = 1;
    for(let i=0; i<CONFIG.courseBaseWidth; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,CONFIG.courseBaseHeight); ctx.stroke(); }
    for(let i=0; i<CONFIG.courseBaseHeight; i+=40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(CONFIG.courseBaseWidth,i); ctx.stroke(); }

    // Outer Fence
    ctx.strokeStyle = '#3d2516';
    ctx.lineWidth = 10;
    ctx.strokeRect(-5, -5, CONFIG.courseBaseWidth + 10, CONFIG.courseBaseHeight + 10);

    // Realistic Hazards
    lvl.hazards.forEach(h => {
        if (h.type === 'sand') {
            ctx.fillStyle = '#e4cd85'; // Sand beige
            ctx.fillRect(h.x, h.y, h.w, h.h);
        } else if (h.type === 'water') {
            ctx.fillStyle = '#3ca1df'; // Water blue
            ctx.fillRect(h.x, h.y, h.w, h.h);
        } else if (h.type === 'bridge') {
            ctx.fillStyle = '#c29d6d'; // Wood bridge
            ctx.fillRect(h.x, h.y, h.w, h.h);
        }
    });

    // Wooden Walls
    ctx.fillStyle = '#8c4e0b';
    lvl.walls.forEach(w => {
        ctx.fillRect(w.x, w.y, w.w, w.h);
        // Subtle wood grain/shadow effect
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    // Deep Hole
    ctx.beginPath();
    ctx.arc(lvl.hole.x, lvl.hole.y, CONFIG.holeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1a0f';
    ctx.fill();
    // Inner shadow of the hole
    ctx.beginPath();
    ctx.arc(lvl.hole.x, lvl.hole.y, CONFIG.holeRadius - 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.stroke();

    // Red Golf Flag
    ctx.fillStyle = '#e2e8f0'; // Flag pole
    ctx.fillRect(lvl.hole.x - 2, lvl.hole.y - 45, 4, 45);
    ctx.fillStyle = '#e53e3e'; // Red flag
    ctx.beginPath();
    ctx.moveTo(lvl.hole.x + 2, lvl.hole.y - 42);
    ctx.lineTo(lvl.hole.x + 24, lvl.hole.y - 32);
    ctx.lineTo(lvl.hole.x + 2, lvl.hole.y - 22);
    ctx.fill();

    // Aiming Visual (Scale with power)
    const pk = activePlayerKey();
    if (state.isDragging && (state.mode === 'solo' || pk === state.myRole)) {
        const p = state.game.players[pk];
        const rawDx = state.dragStart.x - state.dragCurrent.x;
        const rawDy = state.dragStart.y - state.dragCurrent.y;
        const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
        const power = Math.min(dist * CONFIG.powerMultiplier, CONFIG.maxPower);
        
        // Clamp visual arrow length to max 120px
        const maxLen = 140;
        const angle = Math.atan2(rawDy, rawDx);
        const drawLen = Math.min(dist, maxLen);
        const dx = Math.cos(angle) * drawLen;
        const dy = Math.sin(angle) * drawLen;

        ctx.lineCap = 'round';


        // Main Arrow
        ctx.strokeStyle = `rgb(${power * 10}, ${255 - power * 10}, 0)`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + dx, p.y + dy);
        ctx.stroke();
        
        // Arrow Head
        const head = 15;
        ctx.beginPath();
        ctx.moveTo(p.x + dx, p.y + dy);
        ctx.lineTo(p.x + dx - head * Math.cos(angle - Math.PI/6), p.y + dy - head * Math.sin(angle - Math.PI/6));
        ctx.moveTo(p.x + dx, p.y + dy);
        ctx.lineTo(p.x + dx - head * Math.cos(angle + Math.PI/6), p.y + dy - head * Math.sin(angle + Math.PI/6));
        ctx.stroke();
    }

    // Players with realistic shadows
    state.game.activePlayers.forEach(r => {
        const p = state.game.players[r];
        if (p.state === 'holed') return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, CONFIG.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        if (r === pk) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'white';
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ball detail/gloss
        ctx.beginPath();
        ctx.arc(p.x - 3, p.y - 3, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();

        // Only draw player name if it's multiplayer
        if (state.mode === 'multi') {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px Nunito';
            ctx.textAlign = 'center';
            const displayName = (p.name || r).toUpperCase();
            ctx.fillText(displayName, p.x, p.y - 15);
        }
    });

    // Draw Particles
    if (particles.length > 0) {
        particles.forEach((pt, i) => {
            ctx.globalAlpha = Math.max(0, pt.life);
            ctx.fillStyle = pt.color;
            ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
            pt.x += pt.vx; pt.y += pt.vy;
            pt.vy += 0.3; // gravity
            pt.life -= 0.03;
            if (pt.life <= 0) particles.splice(i, 1);
        });
        ctx.globalAlpha = 1.0;
    }

    ctx.restore();
}

function updateCamera() {
    state.camera.scale = Math.min(canvas.width / (CONFIG.courseBaseWidth + 50), canvas.height / (CONFIG.courseBaseHeight + 50));
    state.camera.x = (canvas.width - CONFIG.courseBaseWidth * state.camera.scale) / 2;
    state.camera.y = (canvas.height - CONFIG.courseBaseHeight * state.camera.scale) / 2;
}

function loop() {
    updatePhysics();
    render();
    requestAnimationFrame(loop);
}

window.onload = () => {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    initUI(); setupInput(); updateCamera();
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; updateCamera(); });
    loop();
};
