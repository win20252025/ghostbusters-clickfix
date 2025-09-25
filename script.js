document.addEventListener('DOMContentLoaded', () => {
    const hiddenButton = document.getElementById('hidden-malicious-button');
    const logMessage = document.getElementById('log-message');
    const popUp = document.getElementById('pop-up-message');
    const initialPrompt = document.getElementById('initial-prompt');
    const promptOkButton = document.getElementById('prompt-ok-button');
    const gameContainer = document.querySelector('.game-container');
    const defenseLink = document.getElementById('defense-link');
    const mazeContainer = document.getElementById('maze-container');
    const gameChoiceContainer = document.getElementById('game-choice-container');
    const memoryGameButton = document.getElementById('memory-game-button');
    const mazeGameButton = document.getElementById('maze-game-button');
    const commandToType = '--release_all_ghosts';
    const commandElement = document.getElementById('ghostly-command');
    const blinkingCursor = document.getElementById('blinking-cursor');
    const visibleZapButton = document.getElementById('visible-zap-button');
    
    const typeWriter = (text, i, fnCallback) => {
        if (i < text.length) {
            commandElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, i, fnCallback), 100);
        } else if (typeof fnCallback == 'function') {
            fnCallback();
        }
    };

    const initializeGame = () => {
        if (initialPrompt) initialPrompt.style.display = 'flex';
        if (gameContainer) gameContainer.classList.add('hidden');
        if (gameChoiceContainer) gameChoiceContainer.classList.add('hidden');
        if (popUp) popUp.classList.add('hidden');
        if (defenseLink) defenseLink.classList.add('hidden');
        if (mazeContainer) mazeContainer.classList.add('hidden');
        if (logMessage) logMessage.innerText = 'Awaiting next action...';
        if (commandElement) commandElement.innerHTML = '';
        
        if (promptOkButton) promptOkButton.classList.remove('pulse-animation');
        if (visibleZapButton) visibleZapButton.classList.remove('pulse-animation');
        if (defenseLink) defenseLink.classList.remove('pulse-animation');

        if (logMessage) logMessage.innerHTML = 'Mission Log: A new mission has been activated! Your goal is to bust the spooky ghosts of the internet!';
        if (commandElement && blinkingCursor && promptOkButton) {
            typeWriter(commandToType, 0, () => {
                blinkingCursor.style.animation = 'blink 1s step-end infinite';
                promptOkButton.classList.add('pulse-animation');
            });
        }
    };

    initializeGame();

    if (promptOkButton) {
        promptOkButton.addEventListener('click', () => {
            if (initialPrompt) initialPrompt.style.display = 'none';
            if (gameContainer) gameContainer.classList.remove('hidden');
            if (logMessage) logMessage.innerHTML = 'Mission Log: The command has been entered. Awaiting results...';
            if (promptOkButton) promptOkButton.classList.remove('pulse-animation');
            if (visibleZapButton) visibleZapButton.classList.add('pulse-animation');
        });
    }

    if (visibleZapButton) {
        visibleZapButton.addEventListener('click', () => {
            if (hiddenButton) hiddenButton.click();
            if (visibleZapButton) visibleZapButton.classList.remove('pulse-animation');
        });
    }

    if (hiddenButton) {
        hiddenButton.addEventListener('click', () => {
            if (popUp) popUp.classList.remove('hidden');
            if (logMessage) logMessage.innerHTML = 'Mission Log: Ghosts have been released! Initializing log investigation...';
            setTimeout(() => {
                if (popUp) popUp.classList.add('hidden');
                investigateLogs();
            }, 3000);
        });
    }
    
    const investigateLogs = () => {
        if (logMessage) {
            logMessage.innerHTML = `
                <p style="color: yellow; font-weight: bold;">Mission Update 1: You tried to zap the Slimer!</p>
                <p style="color: red; font-weight: bold;">Mission Update 2: Whoa! The system ran "Release the captured ghosts" instead!</p>
                <br>
                <p style="color: red; font-weight: bold;">A sneaky ghost trick was used!</p>
                <p>You have to trap the ghosts! Choose your next mission!</p>
            `;
        }

        if (gameContainer) gameContainer.classList.add('hidden');
        if (gameChoiceContainer) gameChoiceContainer.classList.remove('hidden');
    };

    if (mazeGameButton) {
        mazeGameButton.addEventListener('click', () => {
            if (gameChoiceContainer) gameChoiceContainer.classList.add('hidden');
            if (mazeContainer) mazeContainer.classList.remove('hidden');
            if (logMessage) logMessage.innerHTML = 'Mission Log: Maze protocol activated...';
        });
    }
});
