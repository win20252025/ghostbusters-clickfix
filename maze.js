document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20; // Size of each cell in the maze
    const playerSize = 10; // Radius of the player circle
    let playerX = 1;
    let playerY = 1;
    let maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,1,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    let finishX; // The ghost's final position
    let finishY;

    // Load the ghost image
    const ghostImage = new Image();
    ghostImage.src = 'ghost_icon.png';
    const ghostImageSize = gridSize * 0.9;

    // Function to find a random open cell for the ghost
    const findRandomOpenCell = () => {
        let openCells = [];
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                // Check if the cell is a path and not the start position
                if (maze[y][x] === 0 && (x !== playerX || y !== playerY)) {
                    openCells.push({ x, y });
                }
            }
        }
        // Select a random cell from the list
        const randomIndex = Math.floor(Math.random() * openCells.length);
        const randomCell = openCells[randomIndex];
        finishX = randomCell.x;
        finishY = randomCell.y;
    };

    // Function to draw the maze walls
    const drawMaze = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 1) {
                    ctx.fillStyle = '#bdc3c7';
                    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                }
            }
        }
    };

    // Function to draw the player (Ghostbuster)
    const drawPlayer = () => {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(playerX * gridSize + gridSize/2, playerY * gridSize + gridSize/2, playerSize, 0, Math.PI * 2);
        ctx.fill();
    };

    // Function to draw the ghost icon at the finish line
    const drawFinish = () => {
        const imgX = finishX * gridSize + (gridSize - ghostImageSize) / 2;
        const imgY = finishY * gridSize + (gridSize - ghostImageSize) / 2;
        ctx.drawImage(ghostImage, imgX, imgY, ghostImageSize, ghostImageSize);
    };

    // Function to check if the player has reached the ghost
    const checkWin = () => {
        if (playerX === finishX && playerY === finishY) {
            alert("You found the ghost! Mission complete!");
            window.location.href = "defense.html";
        }
    };

    // Function to handle player movement
    const handleMovement = (dx, dy) => {
        const newX = playerX + dx;
        const newY = playerY + dy;
        if (newY >= 0 && newY < maze.length && newX >= 0 && newX < maze[newY].length && maze[newY][newX] === 0) {
            playerX = newX;
            playerY = newY;
            drawMaze();
            drawFinish();
            drawPlayer();
            checkWin();
        }
    };

    // Keyboard controls for movement
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': handleMovement(0, -1); break;
            case 'ArrowDown': handleMovement(0, 1); break;
            case 'ArrowLeft': handleMovement(-1, 0); break;
            case 'ArrowRight': handleMovement(1, 0); break;
        }
    });

    // Mobile controls for movement
    document.querySelectorAll('.mobile-controls button').forEach(button => {
        button.addEventListener('click', (e) => {
            const direction = e.target.textContent.toLowerCase();
            switch(direction) {
                case 'up': handleMovement(0, -1); break;
                case 'down': handleMovement(0, 1); break;
                case 'left': handleMovement(-1, 0); break;
                case 'right': handleMovement(1, 0); break;
            }
        });
    });

    // Initial drawing of the maze, ghost, and player once the ghost image is loaded
    ghostImage.onload = () => {
        drawMaze();
        drawFinish();
        drawPlayer();
    };

    // Find the random ghost position when the page loads
    findRandomOpenCell();
});
