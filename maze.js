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
    let finishX = 18; // X-coordinate of the ghost's position
    let finishY = 1;  // Y-coordinate of the ghost's position

    // Load the ghost image
    const ghostImage = new Image();
    ghostImage.src = 'ghost_icon.png'; // Make sure this path is correct!
    const ghostImageSize = gridSize * 0.9; // Adjust size if needed

    // Function to draw the maze walls
    const drawMaze = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas first
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 1) {
                    ctx.fillStyle = '#bdc3c7'; // Wall color
                    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                }
            }
        }
    };

    // Function to draw the player (Ghostbuster)
    const drawPlayer = () => {
        ctx.fillStyle = '#f1c40f'; // Player color (Ghostbuster yellow)
        ctx.beginPath();
        ctx.arc(playerX * gridSize + gridSize/2, playerY * gridSize + gridSize/2, playerSize, 0, Math.PI * 2);
        ctx.fill();
    };

    // Function to draw the ghost icon at the finish line
    const drawFinish = () => {
        // Draw the image centered in the grid cell
        const imgX = finishX * gridSize + (gridSize - ghostImageSize) / 2;
        const imgY = finishY * gridSize + (gridSize - ghostImageSize) / 2;
        ctx.drawImage(ghostImage, imgX, imgY, ghostImageSize, ghostImageSize);
    };

    // Function to check if the player has reached the ghost
    const checkWin = () => {
        if (playerX === finishX && playerY === finishY) {
            alert("You found the ghost! Mission complete!");
            // Redirect to defense.html or the main game choice
            window.location.href = "index.html"; // Changed to go back to main menu
        }
    };

    // Function to handle player movement
    const handleMovement = (dx, dy) => {
        const newX = playerX + dx;
        const newY = playerY + dy;
        // Check if the new position is within bounds and not a wall
        if (newY >= 0 && newY < maze.length && newX >= 0 && newX < maze[newY].length && maze[newY][newX] === 0) {
            playerX = newX;
            playerY = newY;
            // Redraw everything after movement
            drawMaze();
            drawFinish(); // Redraw ghost so player doesn't draw over it permanently
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
});
