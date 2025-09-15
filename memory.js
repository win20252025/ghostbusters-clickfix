document.addEventListener('DOMContentLoaded', () => {
    const memoryGameContainer = document.querySelector('.memory-game-container');
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
            frontImg.src = `${imageName}_small.png`;
            frontImg.alt = imageName;
            cardFront.appendChild(frontImg);

            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            const backImg = document.createElement('img');
            backImg.src = 'ghostbusters_logo_small.png';
            backImg.alt = 'Ghostbusters Logo';
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
                alert('You trapped all the ghosts! Now, read about how to defend your home.');
                window.location.href = "defense.html";
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

    createCards();
});
