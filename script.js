document.addEventListener('DOMContentLoaded', () => {
    const hiddenButton = document.getElementById('hidden-malicious-button');
    const logMessage = document.getElementById('log-message');
    const popUp = document.getElementById('pop-up-message');
    const initialPrompt = document.getElementById('initial-prompt');
    const promptOkButton = document.getElementById('prompt-ok-button');
    const gameContainer = document.querySelector('.game-container');
    const defenseLink = document.getElementById('defense-link');
    const mazeContainer = document.getElementById('maze-container');
    const commandToType = '--release_all_ghosts';
    const commandElement = document.getElementById('ghostly-command');
    const blinkingCursor = document.getElementById('blinking-cursor');
    const visibleZapButton = document.getElementById('visible-zap-button');
    const mobileControls = document.querySelector('.mobile-controls');

    // Maze Game Variables
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    const mazeSize = 20;
    const cellSize = canvas.width / mazeSize;
    let playerX = 0;
    let playerY = 0;
    let maze = [];

    // Create a ghost icon directly on a hidden canvas
    const ghostCanvas = document.createElement('canvas');
    ghostCanvas.width = cellSize;
    ghostCanvas.height = cellSize;
    const gctx = ghostCanvas.getContext('2d');

    // Draw the ghost icon
    const drawGhostIcon = () => {
        gctx.clearRect(0, 0, cellSize, cellSize);
        gctx.fillStyle = '#2ecc71';
        gctx.beginPath();
        // Body
        gctx.arc(cellSize / 2, cellSize * 0.4, cellSize * 0.3, 0, 2 * Math.PI);
        // Feet
        gctx.arc(cellSize * 0.3, cellSize * 0.7, cellSize * 0.1, 0, 2 * Math.PI);
        gctx.arc(cellSize * 0.7, cellSize * 0.7, cellSize * 0.1, 0, 2 * Math.PI);
        gctx.arc(cellSize * 0.5, cellSize * 0.7, cellSize * 0.1, 0, 2 * Math.PI);
        gctx.fill();
        gctx.strokeStyle = '#000';
        gctx.stroke();
        // Eyes
        gctx.fillStyle = '#fff';
        gctx.beginPath();
        gctx.arc(cellSize * 0.4, cellSize * 0.35, cellSize * 0.05, 0, 2 * Math.PI);
        gctx.arc(cellSize * 0.6, cellSize * 0.35, cellSize * 0.05, 0, 2 * Math.PI);
        gctx.fill();
        // Mouth
        gctx.beginPath();
        gctx.strokeStyle = '#c0392b';
        gctx.lineWidth = 2;
        gctx.arc(cellSize * 0.5, cellSize * 0.5, cellSize * 0.1, 0, Math.PI);
        gctx.stroke();
    };

    // Corrected maze generation
    const generateMaze = () => {
        maze = [];
        for (let y = 0; y < mazeSize; y++) {
            maze[y] = [];
            for (let x = 0; x < mazeSize; x++) {
                maze[y][x] = 1; // Start with all walls
            }
        }
        
        let path = [];
        let visited = new Set();

        function carvePath(x, y) {
            visited.add(`${x},${y}`);
            maze[y][x] = 0; // Carve a path
            path.push({x, y});

            const directions = shuffle([
                {dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0}
            ]);

            for (const {dx, dy} of directions) {
                const newX = x + dx;
                const newY = y + dy;

                if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && !visited.has(`${newX},${newY}`)) {
                    carvePath(newX, newY);
                }
            }
        }
        
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        carvePath(0, 0);
        maze[0][0] = 2; // Player start
        maze[mazeSize - 1][mazeSize - 1] = 3; // Ghost end
    };
    
    // Draw the maze
    const drawMaze = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < mazeSize; y++) {
            for (let x = 0; x < mazeSize; x++) {
                if (maze[y][x] === 1) {
                    ctx.fillStyle = '#2c3e50';
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(playerX * cellSize + cellSize / 2, playerY * cellSize + cellSize / 2, cellSize / 2 - 5, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.drawImage(ghostCanvas, (mazeSize - 1) * cellSize, (mazeSize - 1) * cellSize, cellSize, cellSize);
    };

    // Handle player movement
    const movePlayer = (e) => {
        let newX = playerX;
        let newY = playerY;
        
        if (e.key === 'ArrowUp') newY = playerY - 1;
        if (e.key === 'ArrowDown') newY = playerY + 1;
        if (e.key === 'ArrowLeft') newX = playerX - 1;
        if (e.key === 'ArrowRight') newX = playerX + 1;

        if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] !== 1) {
            playerX = newX;
            playerY = newY;
            drawMaze();
        }

        if (playerX === mazeSize - 1 && playerY === mazeSize - 1) {
            logMessage.innerHTML = 'Mission log: Maze completed! You have trapped the ghostly malware! Now, read about how to defend your home.';
            defenseLink.classList.remove('hidden');
            defenseLink.classList.add('pulse-animation');
            window.removeEventListener('keydown', movePlayer);
        }
    };
    
    // Function to type the command
    const typeWriter = (text, i, fnCallback) => {
        if (i < text.length) {
            commandElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, i, fnCallback), 100);
        } else if (typeof fnCallback == 'function') {
            fnCallback();
        }
    };

    // A simple function to reset the game state
    const resetGameState = () => {
        initialPrompt.style.display = 'flex';
        gameContainer.classList.add('hidden');
        popUp.classList.add('hidden');
        defenseLink.classList.add('hidden');
        mazeContainer.classList.add('hidden');
        logMessage.innerText = 'Awaiting next action...';
        commandElement.innerHTML = '';
        playerX = 0;
        playerY = 0;
        promptOkButton.classList.remove('pulse-animation');
        visibleZapButton.classList.remove('pulse-animation');
        defenseLink.classList.remove('pulse-animation');
        window.removeEventListener('keydown', movePlayer);
    };

    const startIntro = () => {
        resetGameState();
        logMessage.innerHTML = 'Mission Log: A new mission has been activated! Your goal is to bust the spooky ghosts of the internet!';
        typeWriter(commandToType, 0, () => {
            blinkingCursor.style.animation = 'blink 1s step-end infinite';
            promptOkButton.classList.add('pulse-animation');
        });
    };
