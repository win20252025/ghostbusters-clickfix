document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const playerSize = 10;
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
    let finishX = 18;
    let finishY = 1;

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

    const drawPlayer = () => {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(playerX * gridSize + gridSize/2, playerY * gridSize + gridSize/2, playerSize, 0, Math.PI * 2);
        ctx.fill();
    };

    const drawFinish = () => {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(finishX * gridSize, finishY * gridSize, gridSize, gridSize);
    };

    const checkWin = () => {
        if (playerX === finishX && playerY === finishY) {
            alert("You found the ghost! Mission complete!");
            window.location.href = "defense.html";
        }
    };

    const handleMovement = (dx, dy) => {
        const newX = playerX + dx;
        const newY = playerY + dy;
        if (maze[newY][newX] === 0) {
            playerX = newX;
            playerY = newY;
            drawMaze();
            drawFinish();
            drawPlayer();
            checkWin();
        }
    };

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': handleMovement(0, -1); break;
            case 'ArrowDown': handleMovement(0, 1); break;
            case 'ArrowLeft': handleMovement(-1, 0); break;
            case 'ArrowRight': handleMovement(1, 0); break;
        }
    });

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

    drawMaze();
    drawFinish();
    drawPlayer();
});
