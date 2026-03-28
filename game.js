// Game Data
const LEVELS = [
    {   // Level 1: Simple straight
        par: 2,
        startInfo: { x: 200, y: 700 },
        hole: { x: 200, y: 150 },
        walls: [
            { x: 100, y: 100, w: 200, h: 20 }, // Top
            { x: 100, y: 120, w: 20, h: 630 }, // Left
            { x: 280, y: 120, w: 20, h: 630 }, // Right
            { x: 100, y: 750, w: 200, h: 20 }  // Bottom
        ]
    },
    {   // Level 2: L-shape
        par: 3,
        startInfo: { x: 150, y: 700 },
        hole: { x: 450, y: 150 },
        walls: [
            { x: 50, y: 600, w: 20, h: 150 },   // Left lower
            { x: 50, y: 750, w: 200, h: 20 },   // Bottom
            { x: 230, y: 300, w: 20, h: 450 },  // Inner corner right
            { x: 250, y: 300, w: 270, h: 20 },  // Inner corner top
            { x: 50, y: 100, w: 470, h: 20 },   // Top overall
            { x: 50, y: 120, w: 20, h: 480 },   // Left upper
            { x: 520, y: 120, w: 20, h: 200 },  // Right upper
            { x: 520, y: 320, w: 20, h: 20 },   // Right cap
        ]
    },
    {   // Level 3: Funnel with obstacle
        par: 4,
        startInfo: { x: 300, y: 700 },
        hole: { x: 300, y: 150 },
        walls: [
            // Bounds
            { x: 100, y: 100, w: 400, h: 20 },
            { x: 100, y: 120, w: 20, h: 630 },
            { x: 480, y: 120, w: 20, h: 630 },
            { x: 100, y: 750, w: 400, h: 20 },
            // Obstacles
            { x: 120, y: 400, w: 150, h: 20 },
            { x: 330, y: 400, w: 150, h: 20 },
            { x: 250, y: 250, w: 100, h: 20 }
        ]
    }
];

const BALL_TYPES = [
    { id: 'standard', name: 'Standard', color: '#ffea00', friction: 0.985, bounce: 0.7, mass: 1, glow: 'hsl(55, 100%, 50%)' },
    { id: 'bouncy', name: 'Bouncy', color: '#00f7ff', friction: 0.99, bounce: 0.9, mass: 0.8, glow: 'hsl(182, 100%, 50%)' },
    { id: 'heavy', name: 'Heavy', color: '#ff2a2a', friction: 0.97, bounce: 0.4, mass: 1.5, glow: 'hsl(0, 100%, 50%)' },
];

// Config & State
const CONFIG = {
    ballRadius: 10,
    holeRadius: 15,
    maxPower: 25,
    powerMultiplier: 0.1,
    stopVelocity: 0.1,
    subSteps: 10,
    courseBaseWidth: 600,
    courseBaseHeight: 800
};

let state = {
    currentScreen: 'main-menu', // main-menu, hud, level-complete, game-over
    level: 0,
    strokes: 0,
    totalStrokes: 0,
    totalScore: 0,
    
    ballType: BALL_TYPES[0],
    
    ball: { x: 0, y: 0, vx: 0, vy: 0 },
    hole: { x: 0, y: 0 },
    walls: [],
    
    camera: { x: 0, y: 0, scale: 1 },
    
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    dragCurrent: { x: 0, y: 0 },
    
    gameState: 'idle' // idle, moving, holed
};

// DOM Elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const uiLayer = document.getElementById('ui-layer');

const screens = {
    'main-menu': document.getElementById('main-menu'),
    'hud': document.getElementById('hud'),
    'level-complete': document.getElementById('level-complete'),
    'game-over': document.getElementById('game-over')
};

// UI Initialization
function initUI() {
    // Ball Selector
    const ballOptionsContainer = document.getElementById('ball-options');
    BALL_TYPES.forEach((ball, idx) => {
        const el = document.createElement('div');
        el.className = `ball-option ${idx === 0 ? 'selected' : ''}`;
        el.style.backgroundColor = ball.color;
        el.style.color = ball.color; // for box-shadow currentColor
        el.onclick = () => selectBall(idx, el);
        ballOptionsContainer.appendChild(el);
    });
    updateBallStats(BALL_TYPES[0]);

    // Buttons
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
    
    // update theme color based on ball
    document.documentElement.style.setProperty('--c-primary', state.ballType.glow);
}

function updateBallStats(ball) {
    let speed = ball.friction > 0.98 ? (ball.friction > 0.985 ? 'High' : 'Normal') : 'Low';
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
        // Game Over
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
    state.walls = levelData.walls.map(w => ({ ...w })); // copy
    
    updateHUD();
    state.gameState = 'idle';
    
    // Center camera on level center roughly
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
        highlight.style.borderColor = '#00ff3c';
        highlight.querySelector('.value').style.color = '#00ff3c';
        highlight.querySelector('.value').style.textShadow = '0 0 10px #00ff3c';
    } else if (score > 0) {
        highlight.style.borderColor = '#ff2a2a';
        highlight.querySelector('.value').style.color = '#ff2a2a';
        highlight.querySelector('.value').style.textShadow = '0 0 10px #ff2a2a';
    } else {
        highlight.style.borderColor = 'var(--c-primary)';
        highlight.querySelector('.value').style.color = 'var(--c-primary)';
        highlight.querySelector('.value').style.textShadow = '0 0 10px var(--c-primary)';
    }

    setTimeout(() => {
        showScreen('level-complete');
    }, 500);
}

// Input Handling
function setupInput() {
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Convert screen to world
        const screenX = clientX - rect.left;
        const screenY = clientY - rect.top;
        
        return {
            x: (screenX - state.camera.x) / state.camera.scale,
            y: (screenY - state.camera.y) / state.camera.scale
        };
    };

    const down = (e) => {
        if (state.currentScreen !== 'hud' || state.gameState !== 'idle') return;
        const pos = getPos(e);
        // check if clicked ball roughly
        const dx = pos.x - state.ball.x;
        const dy = pos.y - state.ball.y;
        if (dx*dx + dy*dy < 2500) { // big hit area
            state.isDragging = true;
            state.dragStart = { ...pos };
            state.dragCurrent = { ...pos };
        }
    };
    
    const move = (e) => {
        if (!state.isDragging) return;
        state.dragCurrent = getPos(e);
        if(e.touches) e.preventDefault(); // prevent scrolling
    };
    
    const up = () => {
        if (!state.isDragging) return;
        state.isDragging = false;
        
        // Shoot
        const dx = state.dragStart.x - state.dragCurrent.x;
        const dy = state.dragStart.y - state.dragCurrent.y;
        
        const force = Math.min(Math.sqrt(dx*dx + dy*dy) * CONFIG.powerMultiplier, CONFIG.maxPower);
        
        if (force > 0.5) {
            const angle = Math.atan2(dy, dx);
            state.ball.vx = Math.cos(angle) * force;
            state.ball.vy = Math.sin(angle) * force;
            state.gameState = 'moving';
            state.strokes++;
            updateHUD();
        }
    };

    canvas.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    
    canvas.addEventListener('touchstart', down, {passive: false});
    window.addEventListener('touchmove', move, {passive: false});
    window.addEventListener('touchend', up);
}

// Physics & Update
function checkCollision() {
    const ball = state.ball;
    const radius = CONFIG.ballRadius;
    const bounce = state.ballType.bounce;

    // AABB vs Circle
    for (let wall of state.walls) {
        // Find closest point to the circle center on the rectangle
        let closestX = Math.max(wall.x, Math.min(ball.x, wall.x + wall.w));
        let closestY = Math.max(wall.y, Math.min(ball.y, wall.y + wall.h));

        // Calculate distance
        let dx = ball.x - closestX;
        let dy = ball.y - closestY;
        let distanceSq = dx * dx + dy * dy;

        if (distanceSq < radius * radius) {
            let distance = Math.sqrt(distanceSq);
            let overlap = radius - distance;

            if (distance === 0) {
               // Circle is exactly inside edge, push arbitrarily
               overlap = radius;
               dx = 0; dy = 1; distance = 1;
            }

            // Normal vector
            let nx = dx / distance;
            let ny = dy / distance;

            // Resolve penetration
            ball.x += nx * overlap;
            ball.y += ny * overlap;

            // Reflect velocity
            // Vnew = V - 2(V.N)N
            let dot = ball.vx * nx + ball.vy * ny;
            
            // Only reflect if moving towards wall
            if (dot < 0) {
                ball.vx = (ball.vx - 2 * dot * nx) * bounce;
                ball.vy = (ball.vy - 2 * dot * ny) * bounce;
            }
        }
    }
}

function updatePhysics() {
    if (state.gameState !== 'moving') return;

    const friction = state.ballType.friction;
    
    // Sub-steps for better collision stability
    const dt = 1 / CONFIG.subSteps;
    
    for (let i = 0; i < CONFIG.subSteps; i++) {
        state.ball.x += state.ball.vx * dt;
        state.ball.y += state.ball.vy * dt;
        
        // Continuous friction
        state.ball.vx *= Math.pow(friction, dt);
        state.ball.vy *= Math.pow(friction, dt);
        
        checkCollision();
    }

    // Check Hole
    const dx = state.ball.x - state.hole.x;
    const dy = state.ball.y - state.hole.y;
    const distSq = dx*dx + dy*dy;
    const holeGrabDist = CONFIG.holeRadius;

    // Check if slow enough and close to hole
    const speedSq = state.ball.vx*state.ball.vx + state.ball.vy*state.ball.vy;
    
    if (distSq < holeGrabDist * holeGrabDist && speedSq < (CONFIG.maxPower * 0.4)*(CONFIG.maxPower * 0.4)) {
        // Gravity towards hole center to suck it in visually
        state.ball.vx += -dx * 0.05;
        state.ball.vy += -dy * 0.05;
        
        if (distSq < 10) { // close enough to center
            stopBall();
            state.ball.x = state.hole.x;
            state.ball.y = state.hole.y;
            showLevelComplete();
        }
    } else {
        // Stop if slow enough
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
    // Basic camera centered on the course (600x800)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Fit to screen
    const scaleX = canvas.width / (CONFIG.courseBaseWidth + 100);
    const scaleY = canvas.height / (CONFIG.courseBaseHeight + 100);
    state.camera.scale = Math.min(scaleX, scaleY);
    
    // Center it
    state.camera.x = canvas.width / 2 - (CONFIG.courseBaseWidth / 2) * state.camera.scale;
    state.camera.y = canvas.height / 2 - (CONFIG.courseBaseHeight / 2) * state.camera.scale;
}


// Rendering
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Camera Transform
    ctx.save();
    ctx.translate(state.camera.x, state.camera.y);
    ctx.scale(state.camera.scale, state.camera.scale);

    // Grid / Background (optional subtle texture)
    if (state.currentScreen === 'hud' || state.gameState === 'holed') {
         // Draw walls
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#000000';
        for (let wall of state.walls) {
            // Neon edge style walls
            ctx.fillStyle = '#0a101d'; // dark filling
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
            
            ctx.strokeStyle = '#22385a';
            ctx.lineWidth = 2;
            ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);

            // Glow logic could go here but limits perf
        }
        ctx.shadowBlur = 0;

        // Draw hole
        ctx.beginPath();
        ctx.arc(state.hole.x, state.hole.y, CONFIG.holeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#050a10';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // Draw aiming line
        if (state.isDragging && state.gameState === 'idle') {
            const dx = state.dragStart.x - state.dragCurrent.x;
            const dy = state.dragStart.y - state.dragCurrent.y;
            const forceDist = Math.sqrt(dx*dx + dy*dy);
            const force = Math.min(forceDist * CONFIG.powerMultiplier, CONFIG.maxPower);
            
            if (force > 0.5) {
                const angle = Math.atan2(dy, dx);
                
                // Draw dots
                const aimLength = force * 15; // Visual length
                ctx.beginPath();
                ctx.setLineDash([5, 15]);
                ctx.moveTo(state.ball.x, state.ball.y);
                ctx.lineTo(state.ball.x + Math.cos(angle) * aimLength, state.ball.y + Math.sin(angle) * aimLength);
                
                // Coloring based on power
                const ratio = force / CONFIG.maxPower;
                ctx.strokeStyle = `hsl(${(1-ratio) * 120}, 100%, 50%)`;
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Draw Ball
        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, CONFIG.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = state.ballType.color;
        
        // Ball Neon Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = state.ballType.glow;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ball highlight
        ctx.beginPath();
        ctx.arc(state.ball.x - 3, state.ball.y - 3, CONFIG.ballRadius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
    } else {
         // Main menu background deco maybe?
    }

    ctx.restore();
}

function loop() {
    updatePhysics();
    render();
    requestAnimationFrame(loop);
}

// Boot
window.onload = () => {
    initUI();
    setupInput();
    window.addEventListener('resize', resize);
    resize();
    showScreen('main-menu');
    loop();
};
