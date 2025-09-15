document.addEventListener('DOMContentLoaded', () => {
    const hiddenButton = document.getElementById('hidden-malicious-button');
    const logMessage = document.getElementById('log-message');
    const popUp = document.getElementById('pop-up-message');
    const initialPrompt = document.getElementById('initial-prompt');
    const promptOkButton = document.getElementById('prompt-ok-button');
    const gameContainer = document.querySelector('.game-container');
    const gameChoiceContainer = document.getElementById('game-choice-container');
    const commandToType = '--release_all_ghosts';
    const commandElement = document.getElementById('ghostly-command');
    const blinkingCursor = document.getElementById('blinking-cursor');
    const visibleZapButton = document.getElementById('visible-zap-button');
    
    // Typewriter effect function
    const typeWriter = (text, i, fnCallback) => {
        if (i < text.length) {
            commandElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, i, fnCallback), 100);
        } else if (typeof fnCallback == 'function') {
            fnCallback();
        }
    };

    // Initialize the game state when the page loads
    const initializeGame = () => {
        logMessage.innerHTML = 'Mission Log: A new mission has been activated! Your goal is to bust the spooky ghosts of the internet!';
        typeWriter(commandToType, 0, () => {
            blinkingCursor.style.animation = 'blink 1s step-end infinite';
            promptOkButton.classList.add('pulse-animation');
        });
    };

    // Event listeners
    promptOkButton.addEventListener('click', () => {
        initialPrompt.style.display = 'none';
        gameContainer.classList.remove('hidden');
        logMessage.innerHTML = 'Mission Log: The command has been entered. Awaiting results...';
        promptOkButton.classList.remove('pulse-animation');
        visibleZapButton.classList.add('pulse-animation');
    });

    visibleZapButton.addEventListener('click', () => {
        hiddenButton.click();
        visibleZapButton.classList.remove('pulse-animation');
    });

    hiddenButton.addEventListener('click', () => {
        popUp.classList.remove('hidden');
        logMessage.innerHTML = 'Mission Log: Ghosts have been released! Initializing log investigation...';
        setTimeout(() => {
            popUp.classList.add('hidden');
            investigateLogs();
        }, 3000);
    });
    
    // Function to show game choices after the attack
    const investigateLogs = () => {
        logMessage.innerHTML = `
            <p style="color: yellow; font-weight: bold;">Mission Update 1: You tried to zap the Slimer!</p>
            <p style="color: red; font-weight: bold;">Mission Update 2: Whoa! The system ran "Release the captured ghosts" instead!</p>
            <br>
            <p style="color: red; font-weight: bold;">A sneaky ghost trick was used!</p>
            <p>You have to trap the ghosts! Choose your next action:</p>
        `;
        gameContainer.classList.add('hidden');
        gameChoiceContainer.classList.remove('hidden');
    };

    // Start the game initialization
    initializeGame();
});
