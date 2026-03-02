const games = [
  {
    name: 'Star Checkers',
    url: 'games/star-checkers/star-checkers.png',
    type: 'board',
    description: 'A simple game of Chinese Checkers',
  },
  {
    name: 'Gas Mask',
    url: 'games/star-checkers/star-checkers.png',
    type: 'puzzle',
    description: 'A simple game of Chinese Checkers',
  }
];

const products = games;

const productsWrapperEl = document.getElementById('products-wrapper');
const checkEls = document.querySelectorAll('.check');
const filtersContainer = document.getElementById('filters-container');
const searchInput = document.getElementById('search');
const playRandomBtn = document.getElementById('playRandomBtn');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameModal = document.getElementById('gameModal');
const gameTitle = document.getElementById('gameTitle');
const gameDescription = document.getElementById('gameDescription');
const gameArea = document.getElementById('gameArea');
const playGameBtn = document.getElementById('playGameBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

let score = 0;
let currentGame = null;
let gameInterval = null;

const productsEls = [];

games.forEach((game) => {
  const productEl = createProductElement(game);
  productsEls.push(productEl);
  productsWrapperEl.appendChild(productEl);
});

filtersContainer.addEventListener('change', filterProducts);
searchInput.addEventListener('input', filterProducts);
playRandomBtn.addEventListener('click', playRandomGame);
closeModalBtn.addEventListener('click', closeModal);
playGameBtn.addEventListener('click', startGame);

function createProductElement(game) {
  const productEl = document.createElement('div');

  productEl.className = 'item';

  productEl.innerHTML = `<div class="item-image">
  <img src="${game.url}" alt="${game.name}" />
  <span class="item-status ${game.type}">Play</span>
</div>
<h3>${game.name}</h3>
<small>${game.type}</small>`;

  productEl.querySelector('.item-status').addEventListener('click', () => openGameModal(game));

  return productEl;
}

function openGameModal(game) {
  currentGame = game;
  gameTitle.textContent = game.name;
  gameDescription.textContent = game.description;
  gameArea.innerHTML = `<p class="loading-text">Click "Play Now" to start!</p>`;
  gameModal.classList.remove('hidden');
}

function closeModal() {
  gameModal.classList.add('hidden');
  stopGame();
}

function playRandomGame() {
  const randomGame = games[Math.floor(Math.random() * games.length)];
  openGameModal(randomGame);
}

function startGame() {
  if (!currentGame) return;

  score = 0;
  updateScore();
  gameArea.innerHTML = `
    <div style="text-align: center;">
      <p style="font-size: 3rem;">🎮</p>
      <p style="color: #22c55e; margin-bottom: 0.5rem;">Playing: ${currentGame.name}</p>
      <p style="color: #facc15; font-size: 1.5rem;">Score: <span id="liveScore">0</span></p>
      <p style="color: #6b7280; font-size: 0.875rem; margin-top: 1rem;">Click the button to earn points!</p>
      <button id="clickBtn" class="click-btn">
        +10 Points
      </button>
    </div>
  `;

  document.getElementById('clickBtn').addEventListener('click', () => {
    score += 10;
    updateScore();
    document.getElementById('liveScore').textContent = score;
  });
}

function stopGame() {
  currentGame = null;
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function filterProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const checkedCategories = Array.from(checkEls)
    .filter((check) => check.checked)
    .map((check) => check.id);

  productsEls.forEach((productEl, index) => {
    const game = games[index];

    const matchesSearchTerm = game.name.toLowerCase().includes(searchTerm);
    const isInCheckedCategory =
      checkedCategories.length === 0 ||
      checkedCategories.includes(game.type);

    if (matchesSearchTerm && isInCheckedCategory) {
      productEl.classList.remove('hidden');
    } else {
      productEl.classList.add('hidden');
    }
  });
}
