// --- Maze Configuration ---
const MAZE_WIDTH = 21;
const MAZE_HEIGHT = 15;

// --- DOM Elements ---
const mazeContainer = document.getElementById('maze-container');
const winMessage = document.getElementById('win-message');
const winSound = document.getElementById('win-sound');
const restartBtn = document.getElementById('restart-btn');

// --- Game State ---
let maze, playerPos, exitPos;

// --- Maze Generation ---
function generateMaze(width, height) {
    // 0 = wall, 1 = path
    const maze = Array.from({ length: height }, () => Array(width).fill(0));
    function carve(x, y) {
        const dirs = [
            [0, -2], [2, 0], [0, 2], [-2, 0]
        ].sort(() => Math.random() - 0.5);
        maze[y][x] = 1;
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (ny > 0 && ny < height && nx > 0 && nx < width && maze[ny][nx] === 0) {
                maze[y + dy / 2][x + dx / 2] = 1;
                carve(nx, ny);
            }
        }
    }
    carve(1, 1);
    // Add extra openings for multiple solutions
    for (let i = 1; i < height - 1; i += 2) {
        if (Math.random() < 0.3) maze[i][Math.floor(Math.random() * (width - 2)) + 1] = 1;
    }
    // Ensure start and end are open
    maze[1][1] = 1;
    maze[height - 2][width - 2] = 1;
    return maze;
}

// --- Maze Rendering ---
function renderMaze() {
    mazeContainer.innerHTML = '';
    mazeContainer.style.gridTemplateColumns = `repeat(${MAZE_WIDTH}, minmax(16px, 38px))`;
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.classList.add('maze-cell');
            if (maze[y][x] === 0) cell.classList.add('wall');
            else cell.classList.add('path');
            if (playerPos.x === x && playerPos.y === y) {
                cell.classList.add('player-ball');
                const ball = document.createElement('div');
                ball.className = 'ball-shape';
                cell.appendChild(ball);
            } else if (exitPos.x === x && exitPos.y === y) {
                cell.classList.add('ghost-exit');
                const ghost = document.createElement('span');
                ghost.className = 'ghost-emoji';
                ghost.textContent = '👻';
                cell.appendChild(ghost);
            }
            mazeContainer.appendChild(cell);
        }
    }
}

// --- Game Logic ---
function isPath(x, y) {
    return x >= 0 && y >= 0 && x < MAZE_WIDTH && y < MAZE_HEIGHT && maze[y][x] === 1;
}

function movePlayer(dx, dy) {
    const nx = playerPos.x + dx, ny = playerPos.y + dy;
    if (isPath(nx, ny)) {
        playerPos.x = nx;
        playerPos.y = ny;
        renderMaze();
        checkWin();
    }
}

function checkWin() {
    if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
        winMessage.style.display = 'block';
        winSound.play();
        document.removeEventListener('keydown', handleKeydown);
        setTimeout(() => {
            window.location.href = "mission-complete.html";
        }, 1500);
    }
}

// --- Controls ---
function handleKeydown(e) {
    if (winMessage.style.display === 'block') return;
    switch (e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
    }
}

function handleMobile(dir) {
    switch (dir) {
        case 'up': movePlayer(0, -1); break;
        case 'down': movePlayer(0, 1); break;
        case 'left': movePlayer(-1, 0); break;
        case 'right': movePlayer(1, 0); break;
    }
}

function setupMobileControls() {
    const addFastEvent = (id, dir) => {
        const btn = document.getElementById(id);
        btn.ontouchstart = (e) => { e.preventDefault(); handleMobile(dir); };
        btn.onmousedown = () => handleMobile(dir); // fallback for desktop
    };
    addFastEvent('up-btn', 'up');
    addFastEvent('down-btn', 'down');
    addFastEvent('left-btn', 'left');
    addFastEvent('right-btn', 'right');
}

// --- Utility ---
function findFarthestExit(maze, start) {
    // BFS to find farthest open cell from start
    const visited = Array.from({ length: MAZE_HEIGHT }, () => Array(MAZE_WIDTH).fill(false));
    let queue = [{ ...start, dist: 0 }];
    let farthest = { ...start, dist: 0 };
    visited[start.y][start.x] = true;
    while (queue.length) {
        const { x, y, dist } = queue.shift();
        if (dist > farthest.dist) farthest = { x, y, dist };
        for (const [dx, dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < MAZE_WIDTH && ny < MAZE_HEIGHT && maze[ny][nx] === 1 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                queue.push({ x: nx, y: ny, dist: dist + 1 });
            }
        }
    }
    return { x: farthest.x, y: farthest.y };
}

// --- Game Initialization ---
function init() {
    maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    playerPos = { x: 1, y: 1 };
    exitPos = findFarthestExit(maze, playerPos);
    renderMaze();
    winMessage.style.display = 'none';
    document.addEventListener('keydown', handleKeydown);
    setupMobileControls();
}

window.onload = init;

// --- Restart Button ---
if (restartBtn) {
    restartBtn.onclick = () => {
        document.removeEventListener('keydown', handleKeydown);
        init();
    };
}

// --- Visual Animation Styles ---
const style = document.createElement('style');
style.textContent = `
    .player-ball, .ghost-exit {
        transition: box-shadow 0.2s, transform 0.2s;
    }
    .player-ball:active, .ghost-exit:active {
        transform: scale(1.1);
        box-shadow: 0 0 16px #39f, 0 0 8px #fff;
    }
`;
document.head.appendChild(style);

