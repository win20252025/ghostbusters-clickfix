document.addEventListener('DOMContentLoaded', () => {
    // Select all the elements we need from the HTML
    const hiddenButton = document.getElementById('hidden-malicious-button');
    const logMessage = document.getElementById('log-message');
    const popUp = document.getElementById('pop-up-message');
    const initialPrompt = document.getElementById('initial-prompt');
    const promptOkButton = document.getElementById('prompt-ok-button');
    const gameContainer = document.querySelector('.game-container');
    const gameChoiceContainer = document.getElementById('game-choice-container');
    const commandElement = document.getElementById('ghostly-command');
    const blinkingCursor = document.getElementById('blinking-cursor');
    const visibleZapButton = document.getElementById('visible-zap-button');
    
    // The command that will be typed out
    const commandToType = '--release_all_ghosts';

    // This function types out the command one character at a time
    const typeWriter = (text, i, fnCallback) => {
        if (i < text.length) {
            commandElement.textContent += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, i, fnCallback), 75);
        } else if (typeof fnCallback === 'function') {
            // This runs after the typing is finished
            fnCallback();
        }
    };

    // This function starts the whole experience
    const initializeGame = () => {
        // Clear everything to start fresh
        commandElement.textContent = '';
        logMessage.innerHTML = 'Mission Log: A new mission has been activated! Your goal is to bust the spooky ghosts of the internet!';
        
        // Start the typewriter effect
        typeWriter(commandToType, 0, () => {
            // Once typing is done, make the button pulse to show it's ready
            blinkingCursor.style.animation = 'blink 1s step-end infinite';
            promptOkButton.classList.add('pulse-animation');
        });
    };

    // Event listener for the "Copy and Run" button
    promptOkButton.addEventListener('click', () => {
        initialPrompt.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        logMessage.innerHTML = 'Mission Log: The command has been entered. Awaiting results...';
        promptOkButton.classList.remove('pulse-animation');
        visibleZapButton.classList.add('pulse-animation');
    });

    // Event listener for the "Zap Slimer!" button
    visibleZapButton.addEventListener('click', () => {
        // Trigger the hidden button's click event
        hiddenButton.click();
        visibleZapButton.classList.remove('pulse-animation');
    });

    // Event listener for the hidden "malicious" button
    hiddenButton.addEventListener('click', () => {
        // Show the pop-up warning
        popUp.classList.remove('hidden');
        logMessage.innerHTML = 'Mission Log: Ghosts have been released! Initializing log investigation...';
        
        // Wait 3 seconds, then hide the pop-up and show the game choices
        setTimeout(() => {
            popUp.classList.add('hidden');
            investigateLogs();
        }, 3000);
    });
    
    // This function shows the game choice buttons
    const investigateLogs = () => {
        logMessage.innerHTML = `
            <p style="color: yellow; font-weight: bold;">Mission Update 1: You tried to zap the Slimer!</p>
            <p style="color: red; font-weight: bold;">Mission Update 2: Whoa! The system ran "Release the captured ghosts" instead!</p>
            <br>
            <p style="color: red; font-weight: bold;">A sneaky ghost trick was used!</p>
            <p>You have to trap the ghosts! Choose your next action:</p>
        `;
        // Hide the main game area and show the buttons
        gameContainer.classList.add('hidden');
        gameChoiceContainer.classList.remove('hidden');
    };

    // Start the game!
    initializeGame();
});
