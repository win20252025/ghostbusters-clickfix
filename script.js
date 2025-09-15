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
    const mobileControls = document.querySelector('.mobile-controls'); // New: Get the mobile controls container

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

    // Maze generation (simplified for example)
    const generateMaze = () => {
        maze = [];
        for (let y = 0; y < mazeSize; y++) {
            maze[y] = [];
            for (let x = 0; x < mazeSize; x++) {
                maze[y][x] = (Math.random() < 0.2) ? 1 : 0;
            }
        }
        maze[0][0] = 2;
        maze[mazeSize - 1][mazeSize - 1] = 3;
        maze[0][1] = 0;
        maze[1][0] = 0;
        maze[mazeSize - 1][mazeSize - 2] = 0;
        maze[mazeSize - 2][mazeSize - 1] = 0;
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
        
        // Draw the ghost icon from the pre-rendered canvas
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
        window.removeEventListener('keydown', movePlayer);
    };

    const startIntro = () => {
        resetGameState();
        logMessage.innerHTML = 'Mission Log: A new mission has been activated! Your goal is to bust the spooky ghosts of the internet!';
        typeWriter(commandToType, 0, () => {
            blinkingCursor.style.animation = 'blink 1s step-end infinite';
        });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const isReset = urlParams.get('reset');
    
    if (isReset) {
        startIntro();
    } else {
        startIntro();
    }
    
    promptOkButton.addEventListener('click', () => {
        initialPrompt.style.display = 'none';
        gameContainer.classList.remove('hidden');
        logMessage.innerHTML = 'Mission Log: The command has been entered. Awaiting results...';
    });

    // The new listener for the visible button
    visibleZapButton.addEventListener('click', () => {
        // The visible button's click should now trigger the hidden button's action
        hiddenButton.click();
    });

    hiddenButton.addEventListener('click', () => {
        popUp.classList.remove('hidden');
        logMessage.innerHTML = 'Mission Log: Ghosts have been released! Initializing log investigation...';
        setTimeout(() => {
            popUp.classList.add('hidden');
            investigateLogs();
        }, 3000);
    });
    
    const investigateLogs = () => {
        logMessage.innerHTML = `
            <p style="color: yellow; font-weight: bold;">Mission Update 1: You tried to zap the Slimer!</p>
            <p style="color: red; font-weight: bold;">Mission Update 2: Whoa! The system ran "Release the captured ghosts" instead!</p>
            <br>
            <p style="color: red; font-weight: bold;">A sneaky ghost trick was used!</p>
            <p>A sneaky ghost hijacked your click! It's hiding in the maze. Chase it down to trap it and fix the problem!</p>
        `;

        gameContainer.classList.add('hidden');
        mazeContainer.classList.remove('hidden');
        generateMaze();
        drawMaze(); 
        window.addEventListener('keydown', movePlayer);
    };

    // New: Handle mobile button clicks
    mobileControls.addEventListener('click', (e) => {
        const direction = e.target.dataset.direction;
        if (direction) {
            let key;
            switch (direction) {
                case 'up': key = 'ArrowUp'; break;
                case 'down': key = 'ArrowDown'; break;
                case 'left': key = 'ArrowLeft'; break;
                case 'right': key = 'ArrowRight'; break;
            }
            // Create a mock event object to pass to the existing movePlayer function
            const mockEvent = { key: key };
            movePlayer(mockEvent);
        }
    });

    drawGhostIcon();
});
