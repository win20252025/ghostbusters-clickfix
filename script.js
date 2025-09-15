document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on pages with a game-container
    const gameContainer = document.querySelector('.game-container');
    if (!gameContainer) {
        return;
    }

    const hiddenButton = document.getElementById('hidden-malicious-button');
    const logMessage = document.getElementById('log-message');
    const popUp = document.getElementById('pop-up-message');
    const initialPrompt = document.getElementById('initial-prompt');
    const promptOkButton = document.getElementById('prompt-ok-button');
    const defenseLink = document.getElementById('defense-link');
    const mazeContainer = document.getElementById('maze-container');
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
            frontImg.src = `${imageName}.png`; // Corrected filename
            frontImg.alt = imageName;
            cardFront.appendChild(frontImg);

            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            const backImg = document.createElement('img');
            backImg.src = 'card_back.png'; // Corrected filename
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
        const isMatch = firstCard.dataset.name === secondCard.dataset
