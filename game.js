// Config and Setup
const sbConfig = {
    url: window.PROJECT_CONFIG?.SUPABASE_URL || "",
    anonKey: window.PROJECT_CONFIG?.SUPABASE_ANON_KEY || ""
};

let supabaseClient; let channel;
try { supabaseClient = supabase.createClient(sbConfig.url, sbConfig.anonKey); } catch (e) { console.warn("Supabase configuration missing or invalid"); }

// --- DATA ---
const LEVELS = [
    { name: "Straight Shot", par: 2, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 20, h: 800 }, { x: 530, y: 50, w: 20, h: 800 }, { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }], hazards: [] },
    { name: "The Dogleg", par: 3, startInfo: { x: 150, y: 800 }, hole: { x: 450, y: 150 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 800 }, { x: 530, y: 70, w: 20, h: 800 }, { x: 250, y: 300, w: 300, h: 20 }, { x: 50, y: 600, w: 300, h: 20 }], hazards: [] },
    { name: "Sand Pit", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 }, { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 }], hazards: [{ type: 'sand', x: 200, y: 300, w: 200, h: 300 }] },
    { name: "The Bridge", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }], hazards: [{ type: 'water', x: 70, y: 350, w: 460, h: 250 }, { type: 'bridge', x: 250, y: 350, w: 100, h: 250 }] },
    { name: "Pillars", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 150 }, walls: [{ x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 }, { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 }, { x: 220, y: 400, w: 40, h: 40 }, { x: 340, y: 400, w: 40, h: 40 }, { x: 220, y: 250, w: 40, h: 40 }, { x: 340, y: 250, w: 40, h: 40 }], hazards: [] },
    { name: "Zig-Zag Alley", par: 5, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }, { x: 50, y: 600, w: 400, h: 20 }, { x: 150, y: 400, w: 400, h: 20 }, { x: 50, y: 200, w: 400, h: 20 }], hazards: [] },
    { name: "Water Islands", par: 4, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }], hazards: [{ type: 'water', x: 70, y: 300, w: 200, h: 200 }, { type: 'water', x: 330, y: 300, w: 200, h: 200 }, { type: 'sand', x: 250, y: 150, w: 100, h: 100 }] },
    { name: "The Maze", par: 5, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 800 }, walls: [{ x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }, { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 820 }, { x: 200, y: 200, w: 20, h: 650 }, { x: 350, y: 50, w: 20, h: 650 }], hazards: [] },
    { name: "Bounce Pass", par: 3, startInfo: { x: 300, y: 800 }, hole: { x: 300, y: 100 }, walls: [{ x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 }, { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 }, { x: 200, y: 400, w: 200, h: 20 }], hazards: [{ type: 'sand', x: 120, y: 100, w: 360, h: 100 }] },
    { name: "Grand Finale", par: 6, startInfo: { x: 100, y: 800 }, hole: { x: 500, y: 100 }, walls: [{ x: 30, y: 30, w: 540, h: 20 }, { x: 30, y: 870, w: 540, h: 20 }, { x: 30, y: 50, w: 20, h: 820 }, { x: 550, y: 50, w: 20, h: 820 }], hazards: [{ type: 'water', x: 50, y: 400, w: 180, h: 250 }, { type: 'water', x: 370, y: 400, w: 180, h: 250 }, { type: 'bridge', x: 230, y: 350, w: 140, h: 180 }, { type: 'bridge', x: 230, y: 550, w: 140, h: 180 }, { type: 'sand', x: 450, y: 50, w: 100, h: 100 }, { type: 'sand', x: 350, y: 150, w: 150, h: 50 }] }
];

const BALL_TYPES = [
    { id: 'standard', name: "Standard", color: '#ffffff', friction: 0.985, bounce: 0.7, mass: 1 },
    { id: 'pro', name: "Pro Tour", color: '#ffea00', friction: 0.980, bounce: 0.5, mass: 1 },
    { id: 'bouncy', name: "Bouncy Blue", color: '#00ccff', friction: 0.990, bounce: 0.9, mass: 0.8 },
    { id: 'heavy', name: "The Rock", color: '#ff3333', friction: 0.970, bounce: 0.4, mass: 1.5 },
    { id: 'neon', name: "Neon Violet", color: '#cf00ff', friction: 0.985, bounce: 0.8, mass: 0.9 }
];

const CONFIG = { ballRadius: 10, holeRadius: 15, maxPower: 25, powerMultiplier: 0.12, stopVelocity: 0.2, subSteps: 10, courseBaseWidth: 600, courseBaseHeight: 900 };

// --- GLOBAL STATE ---
let state = {
    screen: 'screen-splash',
    mode: 'menu', // menu, solo, multi
    volume: 80,
    username: 'Guest',
    unlockedBalls: ['standard'], // Only first ball unlocked by default
    missionStats: { holesInOne: 0, sandHits: 0, levelsFinished: 0, totalShots: 0 },
    myRole: 'p1', // p1, p2, p3, p4
    playersReady: {},
    roomId: null,

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

// --- UI MANAGEMENT ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    state.screen = id;
}

function initUI() {
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

    // Nav Bindings
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.addEventListener('click', () => {
             const target = btn.getAttribute('data-target');
             if (target === 'screen-leaderboard') refreshLeaderboard();
        });
    });

    // Levels Generation
    const lg = document.getElementById('level-grid');
    LEVELS.forEach((lvl, i) => {
        const d = document.createElement('div');
        d.className = 'level-box';
        d.innerHTML = i + 1;
        d.onclick = () => { startSoloGame(i); };
        lg.appendChild(d);
    });

    // Balls Generation
    const bDiv = document.getElementById('ball-inventory');
    const updateBallVisuals = (idx) => {
        const b = BALL_TYPES[idx];
        const isLocked = !state.unlockedBalls.includes(b.id);

        document.getElementById('ball-name-display').innerText = b.name + (isLocked ? " (LOCKED)" : "");
        document.getElementById('ball-display-large').style.backgroundColor = isLocked ? "#333" : b.color;
        document.getElementById('ball-display-large').style.opacity = isLocked ? "0.5" : "1";

        document.getElementById('bar-bounce').style.width = (b.bounce * 100) + '%';
        document.getElementById('bar-friction').style.width = (b.friction * 100) + '%';
        document.getElementById('bar-weight').style.width = (b.mass * 60) + '%';

        if (!isLocked) {
            state.game.players['p1'].ballIdx = idx;
            state.game.players['p1'].color = b.color;
        }
    };

    BALL_TYPES.forEach((b, i) => {
        const el = document.createElement('div');
        const isLocked = !state.unlockedBalls.includes(b.id);
        el.className = `ball-icon ${i === 0 ? 'selected' : ''} ${isLocked ? 'locked-ball' : ''}`;
        el.style.backgroundColor = isLocked ? "#555" : b.color;
        el.innerHTML = isLocked ? "🔒" : "";
        el.onclick = () => {
            if (!state.unlockedBalls.includes(b.id)) return; // Can't select locked
            document.querySelectorAll('.ball-icon').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            updateBallVisuals(i);
        };
        bDiv.appendChild(el);
    });
    updateBallVisuals(0);

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
    document.getElementById('btn-pause').addEventListener('click', () => showScreen('screen-main-menu')); // lazy pause
    document.getElementById('btn-next-level').addEventListener('click', () => {
        if (state.mode === 'multi' && state.myRole === 'p1') {
            broadcastLobby({ type: 'start_level', val: state.game.levelIdx + 1 });
        } else if (state.mode === 'solo') {
            startSoloGame(state.game.levelIdx + 1);
        }
    });

    // Sliders
    document.querySelector('.fun-slider').addEventListener('input', (e) => state.volume = e.target.value);
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
        d.innerHTML = `<span class="p-name" style="color:${P_COLORS[r]}">${(pData.name || r).toUpperCase()}</span><span class="p-score" id="scoreval-${r}">0</span>`;
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

async function refreshLeaderboard() {
    if (!supabaseClient) return;
    const list = document.getElementById('lb-list');
    list.innerHTML = "<p>Loading top scores...</p>";
    
    const { data, error } = await supabaseClient
        .from('scores')
        .select('*')
        .order('strokes', { ascending: true })
        .limit(10);
    
    if (error) { list.innerHTML = "Error loading leaderboard."; return; }
    
    list.innerHTML = '';
    data.forEach((row, i) => {
        const d = document.createElement('div');
        d.className = 'lb-row';
        d.innerHTML = `
            <span class="lb-rank">#${i + 1}</span>
            <span class="lb-name">${row.username}</span>
            <span class="lb-level">Lvl ${row.level_idx}</span>
            <span class="lb-strokes">${row.strokes} shots</span>
        `;
        list.appendChild(d);
    });
}

function showLevelComplete() {
    const sb = document.getElementById('lc-scoreboard');
    sb.innerHTML = '';

    const par = document.getElementById('lc-par');
    par.innerText = LEVELS[state.game.levelIdx].par;

    state.game.activePlayers.forEach(r => {
        const p = state.game.players[r];
        const row = document.createElement('div');
        row.className = 'sb-row';
        row.innerHTML = `<span style="color:${P_COLORS[r]}">${r.toUpperCase()}</span><span>${p.strokes}</span>`;
        sb.appendChild(row);
    });

    if (state.mode === 'solo') document.getElementById('btn-next-level').style.display = 'inline-block';
    else document.getElementById('btn-next-level').style.display = state.myRole === 'p1' ? 'inline-block' : 'none';

    document.getElementById('lc-title').innerText = "HOLE COMPLETE";
    showScreen('level-complete');
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

    // Only process physics on host in multi, or local if solo, to prevent sync issues causing jitter.
    // ACTUALLY, simpler: process physics locally for active player.
    const pk = activePlayerKey();
    const p = state.game.players[pk];
    if (p.state !== 'moving') return;

    // If multiplayer, only the person WHO SHOT computes it and sends final pos!
    if (state.mode === 'multi' && pk !== state.myRole) return;

    let inWater = false; let inSand = false; let onBridge = false;
    const lvl = LEVELS[state.game.levelIdx];

    lvl.hazards.forEach(h => {
        if (p.x > h.x && p.x < h.x + h.w && p.y > h.y && p.y < h.y + h.h) {
            if (h.type === 'bridge') onBridge = true;
            else if (h.type === 'sand') inSand = true;
            else if (h.type === 'water') inWater = true;
        }
    });

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
    }

    // Hole
    const dx = p.x - lvl.hole.x; const dy = p.y - lvl.hole.y;
    if (dx * dx + dy * dy < CONFIG.holeRadius ** 2 && (p.vx ** 2 + p.vy ** 2) < 40) {
        p.state = 'holed'; p.vx = 0; p.vy = 0;
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

    // Realistic Grass
    ctx.fillStyle = '#5ebd3e';
    ctx.fillRect(0, 0, CONFIG.courseBaseWidth, CONFIG.courseBaseHeight);

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

    // Aiming Visual (Scale with power)
    const pk = activePlayerKey();
    if (state.isDragging && (state.mode === 'solo' || pk === state.myRole)) {
        const p = state.game.players[pk];
        const dx = state.dragStart.x - state.dragCurrent.x;
        const dy = state.dragStart.y - state.dragCurrent.y;
        const power = Math.min(Math.sqrt(dx * dx + dy * dy) * CONFIG.powerMultiplier, CONFIG.maxPower);

        // Gradient color for power
        ctx.strokeStyle = `rgb(${power * 10}, ${255 - power * 10}, 0)`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + dx, p.y + dy);
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

        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Nunito';
        ctx.textAlign = 'center';
        const displayName = (p.name || r).toUpperCase();
        ctx.fillText(displayName, p.x, p.y - 15);
    });

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
