document.addEventListener('DOMContentLoaded', () => {
    const splashPage = document.getElementById('splash-page');
    const startButton = document.getElementById('start-button');
    const gameChoiceContainer = document.getElementById('game-choice-container');
    const header = document.querySelector('header');
    
    // The maze game button logic
    const mazeGameButton = document.getElementById('maze-game-button');
    const mazeContainer = document.getElementById('maze-container');
    const logMessage = document.getElementById('log-message');

    // Show the splash page initially
    splashPage.classList.remove('hidden');

    // Event listener to start the game
    if (startButton) {
        startButton.addEventListener('click', () => {
            // Start the fade-out animation
            splashPage.classList.add('fade-out');

            // After the animation, hide the splash page and show the game content
            setTimeout(() => {
                splashPage.classList.add('hidden');
                header.classList.remove('hidden');
                gameChoiceContainer.classList.remove('hidden');
            }, 1000); // The delay should match the transition duration in CSS
        });
    }

    if (mazeGameButton) {
        mazeGameButton.addEventListener('click', () => {
            if (gameChoiceContainer) gameChoiceContainer.classList.add('hidden');
            if (mazeContainer) mazeContainer.classList.remove('hidden');
            if (logMessage) logMessage.innerHTML = 'Mission Log: Maze protocol activated...';
        });
    }
});
