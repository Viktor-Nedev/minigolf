// Game Data
const LEVELS = [
    {   // Level 1: Straight Shot
        par: 2,
        startInfo: { x: 300, y: 800 },
        hole: { x: 300, y: 100 },
        walls: [
            { x: 50, y: 50, w: 20, h: 800 }, { x: 530, y: 50, w: 20, h: 800 }, // Sides
            { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 }  // Top/Bottom
        ],
        hazards: []
    },
    {   // Level 2: The Dogleg
        par: 3,
        startInfo: { x: 150, y: 800 },
        hole: { x: 450, y: 150 },
        walls: [
            { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 },
            { x: 50, y: 70, w: 20, h: 800 }, { x: 530, y: 70, w: 20, h: 800 },
            { x: 250, y: 300, w: 300, h: 20 }, // Corner block
            { x: 50, y: 600, w: 300, h: 20 }
        ],
        hazards: []
    },
    {   // Level 3: Sand Pit
        par: 3,
        startInfo: { x: 300, y: 800 },
        hole: { x: 300, y: 100 },
        walls: [
            { x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 },
            { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 }
        ],
        hazards: [
            { type: 'sand', x: 200, y: 300, w: 200, h: 300 }
        ]
    },
    {   // Level 4: The Bridge
        par: 4,
        startInfo: { x: 300, y: 800 },
        hole: { x: 300, y: 100 },
        walls: [
            { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 },
            { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }
        ],
        hazards: [
            { type: 'water', x: 70, y: 350, w: 460, h: 250 },
            { type: 'bridge', x: 250, y: 350, w: 100, h: 250 }
        ]
    },
    {   // Level 5: Pillars
        par: 4,
        startInfo: { x: 300, y: 800 },
        hole: { x: 300, y: 150 },
        walls: [
            { x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 },
            { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 },
            { x: 220, y: 400, w: 40, h: 40 }, { x: 340, y: 400, w: 40, h: 40 },
            { x: 220, y: 250, w: 40, h: 40 }, { x: 340, y: 250, w: 40, h: 40 }
        ],
        hazards: []
    },
    {   // Level 6: Zig-Zag Alley
        par: 5,
        startInfo: { x: 100, y: 800 },
        hole: { x: 500, y: 100 },
        walls: [
            { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 },
            { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 },
            { x: 50, y: 600, w: 400, h: 20 },
            { x: 150, y: 400, w: 400, h: 20 },
            { x: 50, y: 200, w: 400, h: 20 }
        ],
        hazards: []
    },
    {   // Level 7: Water Islands
        par: 4,
        startInfo: { x: 300, y: 800 },
        hole: { x: 300, y: 100 },
        walls: [
            { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 },
            { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 }
        ],
        hazards: [
            { type: 'water', x: 70, y: 300, w: 200, h: 200 },
            { type: 'water', x: 330, y: 300, w: 200, h: 200 },
            { type: 'sand', x: 250, y: 150, w: 100, h: 100 }
        ]
    },
    {   // Level 8: The Maze
        par: 5,
        startInfo: { x: 100, y: 800 },
        hole: { x: 500, y: 800 },
        walls: [
            { x: 50, y: 50, w: 500, h: 20 }, { x: 50, y: 850, w: 500, h: 20 },
            { x: 50, y: 70, w: 20, h: 780 }, { x: 530, y: 70, w: 20, h: 780 },
            { x: 200, y: 200, w: 20, h: 650 },
            { x: 350, y: 50, w: 20, h: 650 }
        ],
        hazards: []
    },
    {   // Level 9: Bounce Pass
        par: 3,
        startInfo: { x: 300, y: 800 },
        hole: { x: 300, y: 100 },
        walls: [
            { x: 100, y: 50, w: 400, h: 20 }, { x: 100, y: 850, w: 400, h: 20 },
            { x: 100, y: 70, w: 20, h: 780 }, { x: 480, y: 70, w: 20, h: 780 },
            { x: 200, y: 400, w: 200, h: 20 } // Barrier in middle
        ],
        hazards: [
            { type: 'sand', x: 120, y: 100, w: 360, h: 100 }
        ]
    },
    {   // Level 10: The Grand Finale (Unblocked path)
        par: 6,
        startInfo: { x: 100, y: 800 },
        hole: { x: 500, y: 100 },
        walls: [
            { x: 30, y: 30, w: 540, h: 20 }, { x: 30, y: 870, w: 540, h: 20 },
            { x: 30, y: 50, w: 20, h: 820 }, { x: 550, y: 50, w: 20, h: 820 }
            // Removed the blocking separator wall
        ],
        hazards: [
            // Water on the sides
            { type: 'water', x: 50, y: 400, w: 180, h: 250 },
            { type: 'water', x: 370, y: 400, w: 180, h: 250 },
            // Wide Bridges in the center area
            { type: 'bridge', x: 230, y: 350, w: 140, h: 180 },
            { type: 'bridge', x: 230, y: 550, w: 140, h: 180 },
            // Sand traps (not blocking)
            { type: 'sand', x: 450, y: 50, w: 100, h: 100 },
            { type: 'sand', x: 350, y: 150, w: 150, h: 50 }
        ]
    }
];

const BALL_TYPES = [
    { id: 'standard', name: 'Golf', color: '#ffffff', friction: 0.985, bounce: 0.7, mass: 1 },
    { id: 'pro', name: 'Pro', color: '#ffea00', friction: 0.980, bounce: 0.5, mass: 1 },
    { id: 'bouncy', name: 'Bouncy', color: '#00ccff', friction: 0.990, bounce: 0.9, mass: 0.8 },
    { id: 'heavy', name: 'Heavy', color: '#ff3333', friction: 0.975, bounce: 0.4, mass: 1.5 },
    { id: 'light', name: 'Light', color: '#ff99cc', friction: 0.988, bounce: 0.8, mass: 0.6 }
];

// Config & State
const CONFIG = {
    ballRadius: 8,
    holeRadius: 14,
    maxPower: 25,
    powerMultiplier: 0.12,
    stopVelocity: 0.1,
    subSteps: 10,
    courseBaseWidth: 600,
    courseBaseHeight: 900
};

let state = {
    currentScreen: 'main-menu',
    level: 0,
    strokes: 0,
    totalStrokes: 0,
    totalScore: 0,
    
    ballType: BALL_TYPES[0],
    
    ball: { x: 0, y: 0, vx: 0, vy: 0 },
    hole: { x: 0, y: 0 },
    walls: [],
    hazards: [],
    
    lastValidPos: { x: 0, y: 0 }, // For water hazard resets
    
    camera: { x: 0, y: 0, scale: 1 },
    
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    dragCurrent: { x: 0, y: 0 },
    
    gameState: 'idle', // idle, moving, holed, water
    waterTimer: 0
};

// DOM Elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const screens = {
    'main-menu': document.getElementById('main-menu'),
    'hud': document.getElementById('hud'),
    'level-complete': document.getElementById('level-complete'),
    'game-over': document.getElementById('game-over')
};

// UI Initialization
function initUI() {
    const ballOptionsContainer = document.getElementById('ball-options');
    BALL_TYPES.forEach((ball, idx) => {
        const el = document.createElement('div');
        el.className = `ball-option ${idx === 0 ? 'selected' : ''}`;
        el.style.backgroundColor = ball.color;
        el.onclick = () => selectBall(idx, el);
        ballOptionsContainer.appendChild(el);
    });
    updateBallStats(BALL_TYPES[0]);

    document.getElementById('btn-play').addEventListener('click', startGame);
    document.getElementById('btn-next-level').addEventListener('click', loadNextLevel);
    document.getElementById('btn-home').addEventListener('click', backToMenu);
    document.getElementById('btn-restart').addEventListener('click', restartLevel);
}

function selectBall(index, element) {
    document.querySelectorAll('.ball-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    state.ballType = BALL_TYPES[index];
    updateBallStats(BALL_TYPES[index]);
}

function updateBallStats(ball) {
    let speed = ball.friction > 0.985 ? 'High' : (ball.friction > 0.98 ? 'Normal' : 'Low');
    let bounce = ball.bounce > 0.6 ? (ball.bounce > 0.8 ? 'High' : 'Normal') : 'Low';
    let weight = ball.mass > 1 ? 'Heavy' : (ball.mass < 1 ? 'Light' : 'Normal');
    
    document.getElementById('stat-speed').innerText = speed;
    document.getElementById('stat-bounce').innerText = bounce;
    document.getElementById('stat-weight').innerText = weight;
}

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
    state.currentScreen = screenId;
}

// Game Flow
function startGame() {
    state.totalStrokes = 0;
    state.totalScore = 0;
    state.level = 0;
    loadLevel(state.level);
    showScreen('hud');
}

function stopBall() {
    state.ball.vx = 0;
    state.ball.vy = 0;
    state.gameState = 'idle';
}

function loadLevel(index) {
    if (index >= LEVELS.length) {
        document.getElementById('go-score').innerText = state.totalScore > 0 ? `+${state.totalScore}` : state.totalScore;
        showScreen('game-over');
        return;
    }

    const levelData = LEVELS[index];
    state.strokes = 0;
    state.ball.x = levelData.startInfo.x;
    state.ball.y = levelData.startInfo.y;
    stopBall();
    
    state.hole = { ...levelData.hole };
    state.walls = levelData.walls.map(w => ({ ...w }));
    state.hazards = levelData.hazards ? levelData.hazards.map(h => ({ ...h })) : [];
    
    updateHUD();
    state.gameState = 'idle';
    updateCamera();
}

function restartLevel() {
    if (state.gameState === 'holed') return;
    loadLevel(state.level);
}

function loadNextLevel() {
    state.level++;
    loadLevel(state.level);
    showScreen('hud');
}

function backToMenu() {
    showScreen('main-menu');
}

function updateHUD() {
    document.getElementById('hud-level').innerText = `${state.level + 1}/${LEVELS.length}`;
    document.getElementById('hud-strokes').innerText = state.strokes;
    document.getElementById('hud-par').innerText = LEVELS[state.level].par;
}

function showLevelComplete() {
    state.gameState = 'holed';
    const par = LEVELS[state.level].par;
    const score = state.strokes - par;
    state.totalStrokes += state.strokes;
    state.totalScore += score;
    
    let title = "HOLE IN ONE!";
    if (state.strokes > 1) {
        if (score <= -2) title = "EAGLE!";
        else if (score === -1) title = "BIRDIE!";
        else if (score === 0) title = "PAR";
        else if (score === 1) title = "BOGEY";
        else title = "LEVEL COMPLETE";
    }
    
    document.getElementById('lc-title').innerText = title;
    document.getElementById('lc-par').innerText = par;
    document.getElementById('lc-strokes').innerText = state.strokes;
    document.getElementById('lc-score').innerText = score > 0 ? `+${score}` : score;
    
    const highlight = document.querySelector('.stat-box.highlight');
    if (score < 0) {
        highlight.style.borderColor = '#13ce32';
        highlight.querySelector('.value').style.color = '#13ce32';
    } else if (score > 0) {
        highlight.style.borderColor = '#ff3b30';
        highlight.querySelector('.value').style.color = '#ff3b30';
    } else {
        highlight.style.borderColor = 'var(--c-primary)';
        highlight.querySelector('.value').style.color = 'var(--c-primary)';
    }

    showScreen('level-complete');
}

function handleWaterHazard() {
    state.gameState = 'water';
    state.waterTimer = 60; // 1 second roughly at 60fps
}

function resetFromWater() {
    state.strokes++; // Penalty stroke
    state.ball.x = state.lastValidPos.x;
    state.ball.y = state.lastValidPos.y;
    state.ball.vx = 0;
    state.ball.vy = 0;
    updateHUD();
    state.gameState = 'idle';
}

// Input Handling
function setupInput() {
    const down = (e) => {
        if (state.currentScreen !== 'hud' || state.gameState !== 'idle') return;
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
        
        const dragDist = Math.sqrt(dx*dx + dy*dy);
        const power = Math.min(dragDist * CONFIG.powerMultiplier, CONFIG.maxPower);
        
        if (power > 0.5) {
            state.lastValidPos = { x: state.ball.x, y: state.ball.y };
            const angle = Math.atan2(dy, dx);
            state.ball.vx = Math.cos(angle) * power;
            state.ball.vy = Math.sin(angle) * power;
            state.gameState = 'moving';
            state.strokes++;
            updateHUD();
        }
    };

    // Robust event binding
    window.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchstart', down, {passive: false});
    window.addEventListener('touchmove', move, {passive: false});
    window.addEventListener('touchend', up);
}

// Physics & Update
function checkCollision() {
    const ball = state.ball;
    const radius = CONFIG.ballRadius;
    const bounce = state.ballType.bounce;

    for (let wall of state.walls) {
        let closestX = Math.max(wall.x, Math.min(ball.x, wall.x + wall.w));
        let closestY = Math.max(wall.y, Math.min(ball.y, wall.y + wall.h));

        let dx = ball.x - closestX;
        let dy = ball.y - closestY;
        let distanceSq = dx * dx + dy * dy;

        if (distanceSq < radius * radius) {
            let distance = Math.sqrt(distanceSq);
            let overlap = radius - distance;
            if (distance === 0) { overlap = radius; dx = 0; dy = 1; distance = 1; }

            let nx = dx / distance;
            let ny = dy / distance;

            ball.x += nx * overlap;
            ball.y += ny * overlap;

            let dot = ball.vx * nx + ball.vy * ny;
            if (dot < 0) {
                ball.vx = (ball.vx - 2 * dot * nx) * bounce;
                ball.vy = (ball.vy - 2 * dot * ny) * bounce;
            }
        }
    }
}

function updatePhysics() {
    if (state.gameState === 'water') {
        state.waterTimer--;
        if (state.waterTimer <= 0) resetFromWater();
        return;
    }

    if (state.gameState !== 'moving') return;

    let currentFriction = state.ballType.friction;
    let inWater = false;
    let inSand = false;
    let onBridge = false;

    // Check hazards based on ball center
    for (let h of state.hazards) {
        if (state.ball.x > h.x && state.ball.x < h.x + h.w &&
            state.ball.y > h.y && state.ball.y < h.y + h.h) {
            if (h.type === 'bridge') onBridge = true;
            else if (h.type === 'sand') inSand = true;
            else if (h.type === 'water') inWater = true;
        }
    }

    if (onBridge) {
        inWater = false; // Bridge cancels water
    }

    if (inWater) {
        // Splash!
        handleWaterHazard();
        return;
    }

    if (inSand) {
        currentFriction = 0.93; // High friction for sand
    }

    const dt = 1 / CONFIG.subSteps;
    
    for (let i = 0; i < CONFIG.subSteps; i++) {
        state.ball.x += state.ball.vx * dt;
        state.ball.y += state.ball.vy * dt;
        
        state.ball.vx *= Math.pow(currentFriction, dt);
        state.ball.vy *= Math.pow(currentFriction, dt);
        
        checkCollision();
    }

    // Checking hole
    const dx = state.ball.x - state.hole.x;
    const dy = state.ball.y - state.hole.y;
    const distSq = dx*dx + dy*dy;
    const speedSq = state.ball.vx*state.ball.vx + state.ball.vy*state.ball.vy;
    
    if (distSq < CONFIG.holeRadius * CONFIG.holeRadius && speedSq < (CONFIG.maxPower * 0.4)*(CONFIG.maxPower * 0.4)) {
        state.ball.vx *= 0.8; // dampen heavily
        state.ball.vy *= 0.8;
        state.ball.vx += -dx * 0.08;
        state.ball.vy += -dy * 0.08;
        
        if (distSq < 15 && speedSq < 2) { 
            stopBall();
            state.ball.x = state.hole.x;
            state.ball.y = state.hole.y;
            showLevelComplete();
        }
    } else if (!inWater) {
        if (speedSq < CONFIG.stopVelocity * CONFIG.stopVelocity) {
            stopBall();
        }
    }
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateCamera();
}

function updateCamera() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Fit course vertically with padding
    const scaleX = canvas.width / (CONFIG.courseBaseWidth + 50);
    const scaleY = canvas.height / (CONFIG.courseBaseHeight + 50);
    state.camera.scale = Math.min(scaleX, scaleY);
    
    state.camera.x = canvas.width / 2 - (CONFIG.courseBaseWidth / 2) * state.camera.scale;
    state.camera.y = canvas.height / 2 - (CONFIG.courseBaseHeight / 2) * state.camera.scale;
}


// Rendering Helpers
function drawRoundedRect(x, y, w, h, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.arcTo(x + w, y, x + w, y + radius, radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
    ctx.lineTo(x + radius, y + h);
    ctx.arcTo(x, y + h, x, y + h - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Rendering
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(state.camera.x, state.camera.y);
    ctx.scale(state.camera.scale, state.camera.scale);

    if (state.currentScreen === 'hud' || state.gameState === 'holed') {
        
        // Draw Grass bounding box based on walls extents
        let minX = 9999, minY = 9999, maxX = -9999, maxY = -9999;
        state.walls.forEach(w => {
            if(w.x < minX) minX = w.x; if(w.y < minY) minY = w.y;
            if(w.x+w.w > maxX) maxX = w.x+w.w; if(w.y+w.h > maxY) maxY = w.y+w.h;
        });
        
        // Base grass playing area (light green)
        if (minX < maxX) {
             drawRoundedRect(minX, minY, maxX - minX, maxY - minY, 10, '#5ebd3e', false);
        }

        // Hazards
        for (let h of state.hazards) {
            if (h.type === 'sand') {
                drawRoundedRect(h.x, h.y, h.w, h.h, 15, '#e4cd85', '#d4bc74');
                // Sand texture dots
                ctx.fillStyle = '#c7b068';
                for(let i=0; i<h.w*h.h/500; i++){
                    ctx.fillRect(h.x + Math.random()*h.w, h.y + Math.random()*h.h, 2, 2);
                }
            } else if (h.type === 'water') {
                drawRoundedRect(h.x, h.y, h.w, h.h, 10, '#3ca1df', '#288ec9');
            } else if (h.type === 'bridge') {
                drawRoundedRect(h.x, h.y, h.w, h.h, 0, '#c29d6d', '#8b663b');
                // wooden planks
                ctx.strokeStyle = '#a68254';
                for (let yy = h.y; yy < h.y + h.h; yy += 20) {
                    ctx.beginPath(); ctx.moveTo(h.x, yy); ctx.lineTo(h.x + h.w, yy); ctx.stroke();
                }
            }
        }

        // Walls (Brick / Wood look)
        for (let wall of state.walls) {
            ctx.fillStyle = '#8c4e0b'; // wood/brick tone
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
            ctx.strokeStyle = '#5c3205';
            ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
            
            // Texture
            ctx.fillStyle = '#a35a0c';
            if (wall.w > wall.h) {
                // horizontal
                ctx.fillRect(wall.x, wall.y + 4, wall.w, 4);
                ctx.fillRect(wall.x, wall.y + 12, wall.w, 4);
            } else {
                // vertical
                ctx.fillRect(wall.x + 4, wall.y, 4, wall.h);
                ctx.fillRect(wall.x + 12, wall.y, 4, wall.h);
            }
        }

        // Hole
        ctx.beginPath();
        ctx.arc(state.hole.x, state.hole.y, CONFIG.holeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0a1a0f';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#224a27';
        ctx.stroke();

        // Flag (if not holed)
        if (state.gameState !== 'holed') {
            ctx.fillStyle = '#ccc';
            ctx.fillRect(state.hole.x - 2, state.hole.y - 35, 4, 35);
            ctx.fillStyle = '#ff2a2a';
            ctx.beginPath();
            ctx.moveTo(state.hole.x + 2, state.hole.y - 35);
            ctx.lineTo(state.hole.x + 20, state.hole.y - 25);
            ctx.lineTo(state.hole.x + 2, state.hole.y - 15);
            ctx.fill();
        }

        // Aiming Arrow
        if (state.isDragging && state.gameState === 'idle') {
            const dx = state.dragStart.x - state.dragCurrent.x;
            const dy = state.dragStart.y - state.dragCurrent.y;
            const dragDist = Math.sqrt(dx*dx + dy*dy);
            const power = Math.min(dragDist * CONFIG.powerMultiplier, CONFIG.maxPower);
            
            if (power > 0.5) {
                const angle = Math.atan2(dy, dx);
                
                const arrowLen = power * 6; // visual scaling
                const endX = state.ball.x + Math.cos(angle) * arrowLen;
                const endY = state.ball.y + Math.sin(angle) * arrowLen;
                
                // Color based on power
                const ratio = power / CONFIG.maxPower;
                let r = Math.min(255, ratio * 2 * 255);
                let g = Math.min(255, (1 - ratio) * 2 * 255);
                ctx.strokeStyle = `rgb(${r}, ${g}, 0)`;
                ctx.fillStyle = `rgb(${r}, ${g}, 0)`;
                ctx.lineWidth = 4;
                
                // Line
                ctx.beginPath();
                ctx.moveTo(state.ball.x, state.ball.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                
                // Arrowhead
                ctx.beginPath();
                ctx.moveTo(endX, endY);
                ctx.lineTo(endX - Math.cos(angle - 0.5) * 15, endY - Math.sin(angle - 0.5) * 15);
                ctx.lineTo(endX - Math.cos(angle + 0.5) * 15, endY - Math.sin(angle + 0.5) * 15);
                ctx.fill();
            }
        }

        // Ball with shadow
        if (state.gameState !== 'water') { // hide ball if sunk? Or show splash.
            // Shadow
            ctx.beginPath();
            ctx.arc(state.ball.x + 2, state.ball.y + 4, CONFIG.ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fill();

            // Ball
            ctx.beginPath();
            ctx.arc(state.ball.x, state.ball.y, CONFIG.ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = state.ballType.color;
            ctx.fill();

            // Highlight
            ctx.beginPath();
            ctx.arc(state.ball.x - 2, state.ball.y - 2, CONFIG.ballRadius * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
        } else {
            // Splash effect
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.beginPath(); ctx.arc(state.ball.x, state.ball.y, 10 + (60-state.waterTimer)*0.5, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#3ca1df';
            ctx.beginPath(); ctx.arc(state.ball.x, state.ball.y, 8 + (60-state.waterTimer)*0.4, 0, Math.PI*2);
            ctx.fill();
        }
    }

    ctx.restore();
}

function loop() {
    updatePhysics();
    render();
    requestAnimationFrame(loop);
}

window.onload = () => {
    initUI();
    setupInput();
    window.addEventListener('resize', resize);
    resize();
    showScreen('main-menu');
    loop();
};
