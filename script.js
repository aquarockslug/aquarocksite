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

  const htmlPath = currentGame.url.replace('.png', '.html');
  
  gameArea.innerHTML = '<p class="loading-text">Loading game...</p>';

  fetch(htmlPath)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const scripts = doc.querySelectorAll('script');
      
      gameArea.innerHTML = '';
      
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        gameArea.appendChild(newScript);
      });
    })
    .catch(err => {
      gameArea.innerHTML = `<p class="loading-text">Error loading game: ${err.message}</p>`;
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
