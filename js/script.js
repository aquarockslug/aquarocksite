import games from "./games.js";

const gamesWrapperEl = document.getElementById("games-wrapper");
const checkEls = document.querySelectorAll(".check");
const filtersContainer = document.getElementById("filters-container");
const searchInput = document.getElementById("search");
const playRandomBtn = document.getElementById("playRandomBtn");
const gameModal = document.getElementById("gameModal");
const gameTitle = document.getElementById("gameTitle");
const gameDescription = document.getElementById("gameDescription");
const gameArea = document.getElementById("gameArea");
const playGameBtn = document.getElementById("playGameBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

let currentGame = null;

const gamesEls = [];

games.forEach((game) => {
	const gameEl = createGameElement(game);
	gamesEls.push(gameEl);
	gamesWrapperEl.appendChild(gameEl);
});

filtersContainer.addEventListener("change", filterGames);
searchInput.addEventListener("input", filterGames);
playRandomBtn.addEventListener("click", playRandomGame);
closeModalBtn.addEventListener("click", closeModal);
playGameBtn.addEventListener("click", startGame);

function createGameElement(game) {
	const gameEl = document.createElement("div");

	gameEl.className = "item box";

	gameEl.innerHTML = `<div class="item-image">
  <img src="${game.url}" alt="${game.name}" />
  <span class="item-status ${game.type}">Play</span>
</div>
<h3>${game.name}</h3>
<small>${game.type}</small>`;

	gameEl
		.querySelector(".item-status")
		.addEventListener("click", () => openGameModal(game));

	return gameEl;
}

function openGameModal(game) {
	currentGame = game;
	gameTitle.textContent = game.name;
	gameDescription.textContent = game.description;
	gameArea.innerHTML = `<p class="loading-text">Click "Play Now" to start!</p>`;
	gameModal.classList.remove("hidden");
}

function closeModal() {
	gameModal.classList.add("hidden");
	stopGame();
}

function playRandomGame() {
	const randomGame = games[Math.floor(Math.random() * games.length)];
	openGameModal(randomGame);
}

function startGame() {
	if (!currentGame) return;

	const htmlPath = currentGame.url.replace(".png", ".html");

	gameArea.innerHTML = '<p class="loading-text">Loading game...</p>';

	fetch(htmlPath)
		.then((response) => response.text())
		.then((html) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");
			const scripts = doc.querySelectorAll("script");

			gameArea.innerHTML = "";

			scripts.forEach((script) => {
				const newScript = document.createElement("script");
				if (script.src) {
					newScript.src = script.src;
				} else {
					newScript.textContent = script.textContent;
				}
				gameArea.appendChild(newScript);
			});
		})
		.catch((err) => {
			gameArea.innerHTML = `<p class="loading-text">Error loading game: ${err.message}</p>`;
		});
}

function stopGame() {
	currentGame = null;
}

function filterGames() {
	const searchTerm = searchInput.value.trim().toLowerCase();
	const checkedCategories = Array.from(checkEls)
		.filter((check) => check.checked)
		.map((check) => check.id);

	gamesEls.forEach((gameEl, index) => {
		const game = games[index];

		const matchesSearchTerm = game.name.toLowerCase().includes(searchTerm);
		const isInCheckedCategory =
			checkedCategories.length === 0 || checkedCategories.includes(game.type);

		if (matchesSearchTerm && isInCheckedCategory) {
			gameEl.classList.remove("hidden");
		} else {
			gameEl.classList.add("hidden");
		}
	});
}
