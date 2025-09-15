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
    
    // Memory Game Variables
    const memoryGameContainer = document.createElement('div');
    memoryGameContainer.className = 'memory-game-container hidden';
    
    const ghostImages = ['slimer', 'pke-meter', 'proton-pack', 'ghost-trap']; 
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchesFound = 0;
    
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const createCards = () => {
        const doubledImages = [...ghostImages, ...ghostImages];
        shuffle(doubledImages);
        memoryGameContainer.innerHTML = '';
        cards = [];

        doubledImages.forEach(imageName => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.name = imageName;
            
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';

            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            const frontImg = document.createElement('img');
            frontImg.src = `${imageName}.png`;
            frontImg.alt = imageName;
            cardFront.appendChild(frontImg);

            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            const backImg = document.createElement('img');
            backImg.src = 'card_back.png';
            backImg.alt = 'Card Back';
            cardBack.appendChild(backImg);

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);
            
            cardElement.addEventListener('click', flipCard);
            memoryGameContainer.appendChild(cardElement);
            cards.push(cardElement);
        });
    };

    const flipCard = (e) => {
        if (lockBoard) return;
        const clickedCard = e.currentTarget;
        if (clickedCard === firstCard) return;

        clickedCard.classList.add('flipped');

        if (!firstCard) {
            firstCard = clickedCard;
            return;
        }

        secondCard = clickedCard;
        checkForMatch();
    };

    const checkForMatch = () => {
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;
        isMatch ? disableCards() : unflipCards();
    };

    const disableCards = () => {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchesFound++;
        if (matchesFound === ghostImages.length) {
            setTimeout(() => {
                logMessage.innerHTML = 'Mission log: You trapped all the ghosts! Now, read about how to defend your home.';
                defenseLink.classList.remove('hidden');
                defenseLink.classList.add('pulse-animation');
            }, 500);
        }
        resetBoard();
    };

    const unflipCards = () => {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    };

    const resetBoard = () => {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    };

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
        
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        matchesFound = 0;
        
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
                <p style="color: red; font-weight: bold;">A sneaky ghost trick was used!</
