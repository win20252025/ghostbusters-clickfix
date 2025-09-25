document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero-section');
    const startButton = document.getElementById('start-button');
    const gameChoiceContainer = document.getElementById('game-choice-container');
    const header = document.querySelector('header');
    
    // The maze game button logic
    const mazeGameButton = document.getElementById('maze-game-button');
    const mazeContainer = document.getElementById('maze-container');
    const logMessage = document.getElementById('log-message');

    // Hide the game choices initially
    gameChoiceContainer.classList.add('hidden');

    // Event listener to start the game
    if (startButton) {
        startButton.addEventListener('click', () => {
            heroSection.classList.add('hidden');
            gameChoiceContainer.classList.remove('hidden');
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
