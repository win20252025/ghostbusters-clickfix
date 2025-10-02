const images = [
    "proton-pack.png",
    "pke-meter.png",
    "ghost_icon.png",
    "ghost-trap.png",
    "slimer.png"
];

// 5 pairs, 10 cards
let cards = [...images, ...images];

// Sound effects
const sounds = {
    flip: new Audio("sounds/flip.mp3"),
    match: new Audio("sounds/powerup.mp3"),
    mismatch: new Audio("sounds/buzz.mp3"),
    win: new Audio("sounds/ghostbusters-theme.mp3")
};

function playSound(name) {
    if (sounds[name]) {
        // Reset sound in case it's still playing
        sounds[name].currentTime = 0;
        sounds[name].play();
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    const game = document.getElementById('memory-game');
    game.innerHTML = '';
    shuffle(cards);
    cards.forEach((img, idx) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.image = img;
        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">
                    <img src="images/${img}" alt="">
                </div>
                <div class="memory-card-back">
                    <img src="images/card_back.png" alt="">
                </div>
            </div>
        `;
        game.appendChild(card);
    });
}

let flippedCards = [];
let lockBoard = false;
let matched = 0;

function flipCard(e) {
    const card = e.currentTarget;
    if (lockBoard || card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    playSound('flip');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        lockBoard = true;
        const [first, second] = flippedCards;
        if (first.dataset.image === second.dataset.image) {
            matched += 1;
            playSound('match');
            flippedCards = [];
            lockBoard = false;
            if (matched === cards.length / 2) {
                setTimeout(() => {
                    playSound('win');
                    setTimeout(() => {
                        window.location.href = "mission-complete.html";
                    }, 2000); // Let the win sound play for 2 seconds
                }, 500);
            }
        } else {
            playSound('mismatch');
            setTimeout(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                flippedCards = [];
                lockBoard = false;
            }, 1000);
        }
    }
}

function addCardListeners() {
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', flipCard);
    });
}

function restartGame() {
    matched = 0;
    flippedCards = [];
    lockBoard = false;
    createBoard();
    addCardListeners();
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    addCardListeners();
    document.getElementById('restart-btn').addEventListener('click', restartGame);
});