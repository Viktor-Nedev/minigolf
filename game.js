// Supabase Config - Reading from config.js
const sbConfig = {
    url: window.PROJECT_CONFIG?.SUPABASE_URL || "",
    anonKey: window.PROJECT_CONFIG?.SUPABASE_ANON_KEY || ""
};

let supabase;
let channel;
try {
    supabase = supabase.createClient(sbConfig.url, sbConfig.anonKey);
} catch (e) {
    console.error("Supabase not initialized properly:", e);
}

// Global Levels Data (Same as 10 refined levels)
const LEVELS = [
    { par: 2, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 20, h: 800 }, { x: 530, y: 50, w: 20, h: 800 }, { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }], hazards: [] },
    { par: 3, startInfo: { x: 150, y: 800 }, hole: { x: 450, y: 150 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 800 }, { x: 530, y: 70, w: 20, h: 800 }, { x: 250, y: 300, w: 300, h: 20 }, { x: 50, y: 600, w: 300, h: 20 }], hazards: [] },
    { par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 }, { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 }], hazards: [{ type: 'sand', x: 200, y: 300, w: 200, h: 300 }] },
    { par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }], hazards: [{ type: 'water', x: 70, y: 350, w: 460, h: 250 }, { type: 'bridge', x: 250, y: 350, w: 100, h: 250 }] },
    { par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 150 }, walls: [{ x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 }, { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 }, { x: 220, y: 400, w: 40, h: 40 }, { x: 340, y: 400, w: 40, h: 40 }, { x: 220, y: 250, w: 40, h: 40 }, { x: 340, y: 250, w: 40, h: 40 }], hazards: [] },
    { par: 5, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 50, y: 600, w: 400, h: 20 }, { x: 150, y: 400, w: 400, h: 20 }, { x: 50, y: 200, w: 400, h: 20 }], hazards: [] },
    { par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }], hazards: [{ type: 'water', x: 70, y: 300, w: 200, h: 200 }, { type: 'water', x: 330, y: 300, w: 200, h: 200 }, { type: 'sand', x: 250, y: 150, w: 100, h: 100 }] },
    { par: 5, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 800 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 820 }, { x: 200, y: 200, w: 20, h: 650 }, { x: 350, y: 50, w: 20, h: 650 }], hazards: [] },
    { par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 }, { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 }, { x: 200, y: 400, w: 200, h: 20 }], hazards: [{ type: 'sand', x: 120, y: 100, w: 360, h: 100 }] },
    { par: 6, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 30, y: 30, w: 540, h: 20 }, { x: 30, y: 870, w: 540, h: 20 }, { x: 30, y: 50, w: 20, h: 820 }, { x: 550, y: 50, w: 20, h: 820 }], hazards: [{ type: 'water', x: 50, y: 400, w: 180, h: 250 }, { type: 'water', x: 370, y: 400, w: 180, h: 250 }, { type: 'bridge', x: 230, y: 350, w: 140, h: 180 }, { type: 'bridge', x: 230, y: 550, w: 140, h: 180 }, { type: 'sand', x: 450, y: 50, w: 100, h: 100 }, { type: 'sand', x: 350, y: 150, w: 150, h: 50 }] }
];

const BALL_TYPES = [
    { id: 'standard', color: '#ffffff', friction: 0.985, bounce: 0.7 },
    { id: 'pro', color: '#ffea00', friction: 0.980, bounce: 0.5 },
    { id: 'bouncy', color: '#00ccff', friction: 0.990, bounce: 0.9 },
    { id: 'heavy', color: '#ff3333', friction: 0.975, bounce: 0.4 }
];

// Config & State
const CONFIG = {
    ballRadius: 10,
    holeRadius: 15,
    maxPower: 25,
    powerMultiplier: 0.12,
    stopVelocity: 0.2,
    subSteps: 10,
    courseBaseWidth: 600,
    courseBaseHeight: 900
};

let state = {
    currentScreen: 'main-menu',
    roomId: 'room1',
    playerRole: null, // "p1" or "p2"
    turn: "p1",
    level: 0,

    p1: { x: 0, y: 0, vx: 0, vy: 0, strokes: 0, color: '#ffffff', ballIdx: 0, status: 'idle' },
    p2: { x: 0, y: 0, vx: 0, vy: 0, strokes: 0, color: '#ffea00', ballIdx: 0, status: 'idle' },

    camera: { x: 0, y: 0, scale: 1 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    dragCurrent: { x: 0, y: 0 },
    gameState: 'play'
};

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const screens = { 'main-menu': document.getElementById('main-menu'), 'hud': document.getElementById('hud'), 'level-complete': document.getElementById('level-complete') };

// Initialization
function initUI() {
    const ballOptionsContainer = document.getElementById('ball-options');
    BALL_TYPES.forEach((ball, idx) => {
        const el = document.createElement('div');
        el.className = `ball-option ${idx === 0 ? 'selected' : ''}`;
        el.style.backgroundColor = ball.color;
        el.onclick = () => {
            document.querySelectorAll('.ball-option').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            const myP = state.playerRole || 'p1';
            state[myP].ballIdx = idx;
            state[myP].color = ball.color;
        };
        ballOptionsContainer.appendChild(el);
    });
    document.getElementById('btn-create-game').addEventListener('click', joinMultiplayer);
}

// Supabase Multiplayer Logic
async function joinMultiplayer() {
    state.roomId = document.getElementById('room-id').value || 'room1';

    if (!supabase) {
        alert("Supabase Client Error. Config missing!");
        return;
    }

    channel = supabase.channel(state.roomId, {
        config: { broadcast: { self: true }, presence: { key: 'players' } }
    });

    channel
        .on('presence', { event: 'sync' }, () => {
            const presenceState = channel.presenceState();
            const players = presenceState.players || [];
            if (players.length <= 1) state.playerRole = 'p1';
            else if (players.length === 2) state.playerRole = state.playerRole || 'p2';

            document.getElementById('connection-status').innerText = `Role: ${state.playerRole.toUpperCase()} | Room: ${state.roomId}`;
        })
        .on('broadcast', { event: 'shot' }, ({ payload }) => {
            // Received shot from opponent
            if (payload.playerRole !== state.playerRole) {
                const p = state[payload.playerRole];
                p.vx = payload.vx;
                p.vy = payload.vy;
                p.status = 'moving';
                p.strokes = payload.strokes;
                state.turn = payload.nextTurn;
                updateHUD();
            }
        })
        .on('broadcast', { event: 'pos' }, ({ payload }) => {
            // Received final position after ball stops
            if (payload.playerRole !== state.playerRole) {
                const p = state[payload.playerRole];
                p.x = payload.x;
                p.y = payload.y;
                p.vx = 0; p.vy = 0;
                p.status = payload.status;
                state.turn = payload.nextTurn;
                updateHUD();
            }
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ role: 'player', joinedAt: new Date().toISOString() });
                startGame();
            }
        });
}

function sendShot(vx, vy) {
    if (!channel) return;
    const nextT = state.playerRole === 'p1' ? 'p2' : 'p1';
    channel.send({
        type: 'broadcast',
        event: 'shot',
        payload: { playerRole: state.playerRole, vx, vy, strokes: state[state.playerRole].strokes, nextTurn: nextT }
    });
}

function sendFinalPos() {
    if (!channel) return;
    const nextT = state.playerRole === 'p1' ? 'p2' : 'p1';
    const p = state[state.playerRole];
    channel.send({
        type: 'broadcast',
        event: 'pos',
        payload: { playerRole: state.playerRole, x: p.x, y: p.y, status: p.status, nextTurn: nextT }
    });
}

// Game Play Logic
function startGame() {
    state.level = 0;
    loadLevel(state.level);
    showScreen('hud');
}

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
    state.currentScreen = screenId;
}

function loadLevel(idx) {
    const lvl = LEVELS[idx];
    state.p1.x = lvl.startInfo.x - 20;
    state.p1.y = lvl.startInfo.y;
    state.p2.x = lvl.startInfo.x + 20;
    state.p2.y = lvl.startInfo.y;
    state.p1.vx = 0; state.p1.vy = 0;
    state.p2.vx = 0; state.p2.vy = 0;
    state.p1.status = 'idle';
    state.p2.status = 'idle';
    state.turn = 'p1';
    updateHUD();
    updateCamera();
}

function updateHUD() {
    document.getElementById('hud-p1-strokes').innerText = state.p1.strokes;
    document.getElementById('hud-p2-strokes').innerText = state.p2.strokes;
    document.getElementById('hud-turn-name').innerText = state.turn === state.playerRole ? "YOUR TURN" : "OPPONENT";
    document.getElementById('hud-level-num').innerText = state.level + 1;
}

// Input Handling
function setupInput() {
    const down = (e) => {
        if (state.currentScreen !== 'hud' || state.turn !== state.playerRole) return;
        if (state[state.playerRole].status !== 'idle') return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        state.dragStart = {
            x: (clientX - rect.left - state.camera.x) / state.camera.scale,
            y: (clientY - rect.top - state.camera.y) / state.camera.scale
        };
        state.isDragging = true;
        state.dragCurrent = { ...state.dragStart };
    };

    const move = (e) => {
        if (!state.isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        state.dragCurrent = {
            x: (clientX - rect.left - state.camera.x) / state.camera.scale,
            y: (clientY - rect.top - state.camera.y) / state.camera.scale
        };
    };

    const up = () => {
        if (!state.isDragging) return;
        state.isDragging = false;

        const dx = state.dragStart.x - state.dragCurrent.x;
        const dy = state.dragStart.y - state.dragCurrent.y;
        const power = Math.min(Math.sqrt(dx * dx + dy * dy) * CONFIG.powerMultiplier, CONFIG.maxPower);

        if (power > 0.8) {
            const p = state[state.playerRole];
            const angle = Math.atan2(dy, dx);
            p.vx = Math.cos(angle) * power;
            p.vy = Math.sin(angle) * power;
            p.status = 'moving';
            p.strokes++;
            sendShot(p.vx, p.vy);
            updateHUD();
        }
    };

    window.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
}

// Physics Loop
function updatePhysics() {
    const players = ['p1', 'p2'];
    players.forEach(pk => {
        const p = state[pk];
        if (p.status !== 'moving') return;

        const ballProps = BALL_TYPES[p.ballIdx];
        const dt = 1 / CONFIG.subSteps;
        for (let i = 0; i < CONFIG.subSteps; i++) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= Math.pow(ballProps.friction, dt);
            p.vy *= Math.pow(ballProps.friction, dt);
            checkWallCollision(p, ballProps.bounce);
        }

        const lvl = LEVELS[state.level];
        const h = lvl.hole;
        const distSq = (p.x - h.x) ** 2 + (p.y - h.y) ** 2;
        if (distSq < CONFIG.holeRadius ** 2 && (p.vx ** 2 + p.vy ** 2) < 40) {
            p.status = 'holed';
            p.vx = 0; p.vy = 0;
            if (pk === state.playerRole) {
                state.turn = state.playerRole === 'p1' ? 'p2' : 'p1';
                sendFinalPos();
            }
        } else if ((p.vx ** 2 + p.vy ** 2) < CONFIG.stopVelocity) {
            p.status = 'idle';
            p.vx = 0; p.vy = 0;
            if (pk === state.playerRole) {
                state.turn = state.playerRole === 'p1' ? 'p2' : 'p1';
                sendFinalPos();
            }
        }
    });
}

function checkWallCollision(p, bounce) {
    const radius = CONFIG.ballRadius;
    const walls = LEVELS[state.level].walls;
    walls.forEach(w => {
        let cx = Math.max(w.x, Math.min(p.x, w.x + w.w));
        let cy = Math.max(w.y, Math.min(p.y, w.y + w.h));
        let dx = p.x - cx; let dy = p.y - cy;
        if (dx * dx + dy * dy < radius * radius) {
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;
            let overlap = radius - dist;
            p.x += (dx / dist) * overlap; p.y += (dy / dist) * overlap;
            let nx = dx / dist; let ny = dy / dist;
            let dot = p.vx * nx + p.vy * ny;
            if (dot < 0) { p.vx = (p.vx - 2 * dot * nx) * bounce; p.vy = (p.vy - 2 * dot * ny) * bounce; }
        }
    });
}

// Rendering
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(state.camera.x, state.camera.y);
    ctx.scale(state.camera.scale, state.camera.scale);

    const lvl = LEVELS[state.level];
    ctx.fillStyle = '#5ebd3e'; ctx.fillRect(50, 50, 500, 850);
    lvl.hazards.forEach(h => {
        if (h.type === 'sand') ctx.fillStyle = '#e4cd85';
        else if (h.type === 'water') ctx.fillStyle = '#3ca1df';
        else if (h.type === 'bridge') ctx.fillStyle = '#c29d6d';
        ctx.fillRect(h.x, h.y, h.w, h.h);
    });
    ctx.fillStyle = '#8c4e0b'; lvl.walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));
    ctx.beginPath(); ctx.arc(lvl.hole.x, lvl.hole.y, CONFIG.holeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1a0f'; ctx.fill();

    // Aiming
    if (state.isDragging && state.turn === state.playerRole) {
        const p = state[state.playerRole];
        const dx = state.dragStart.x - state.dragCurrent.x;
        const dy = state.dragStart.y - state.dragCurrent.y;
        const power = Math.min(Math.sqrt(dx * dx + dy * dy) * CONFIG.powerMultiplier, CONFIG.maxPower);
        ctx.strokeStyle = '#ff0'; ctx.lineWidth = 3; ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + dx, p.y + dy); ctx.stroke();
    }

    // Players
    ['p1', 'p2'].forEach(pk => {
        const p = state[pk];
        if (p.status === 'holed') return;
        ctx.beginPath(); ctx.arc(p.x, p.y, CONFIG.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.shadowBlur = pk === state.playerRole ? 10 : 0; ctx.shadowColor = 'white';
        ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = 'black'; ctx.font = '12px Outfit'; ctx.textAlign = 'center';
        ctx.fillText(pk.toUpperCase(), p.x, p.y - 15);
    });

    ctx.restore();
}

function updateCamera() {
    state.camera.scale = Math.min(canvas.width / 650, canvas.height / 950);
    state.camera.x = (canvas.width - 600 * state.camera.scale) / 2;
    state.camera.y = (canvas.height - 900 * state.camera.scale) / 2;
}

function loop() {
    updatePhysics();
    render();
    requestAnimationFrame(loop);
}

window.onload = () => {
    initUI();
    setupInput();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    loop();
};
