import { filterGames, games, getRandomGame } from "./games.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const createEl = (tag) => document.createElement(tag);

const elements = {
	wrapper: $("#games-wrapper"),
	filters: $$(".check"),
	search: $("#search"),
	playRandomBtn: $("#playRandomBtn"),
	modal: $("#gameModal"),
	title: $("#gameTitle"),
	description: $("#gameDescription"),
	area: $("#gameArea"),
	playGameBtn: $("#playGameBtn"),
	closeModalBtn: $("#closeModalBtn"),
};

const state = {
	currentGame: null,
};

const createGameElement = (game) => {
	const el = createEl("div");
	el.className = "item box";
	el.innerHTML = `<div class="item-image">
  <img src="${game.img}" alt="${game.name}" />
  <span class="item-status ${game.type}">Play</span>
</div>
<h3>${game.name}</h3>
<small>${game.type}</small>`;

	el.querySelector(".item-status").addEventListener("click", () => openModal(game));

	return el;
};

const renderGames = (gamesList) => {
	elements.wrapper.innerHTML = "";
	gamesList.map(createGameElement).forEach((el) => {
		elements.wrapper.appendChild(el);
	});
};

const openModal = (game) => {
	state.currentGame = game;
	elements.title.textContent = game.name;
	elements.description.textContent = game.description;
	elements.area.innerHTML = `<p class="loading-text">Click "Play Now" to start!</p>`;
	elements.modal.classList.remove("hidden");
};

const closeModal = () => {
	elements.modal.classList.add("hidden");
	stopGame();
};

const stopGame = () => {
	state.currentGame = null;
};

const loadGame = (game) => {
	const singleFileGame = (game) => {
		elements.area.innerHTML = '<p class="loading-text">Loading game...</p>';
		fetch(game.url)
			.then((response) => response.text())
			.then((html) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");
				const scripts = doc.querySelectorAll("script");

				elements.area.innerHTML = "";

				Array.from(scripts)
					.map((script) => {
						const newScript = createEl("script");
						if (script.src) newScript.src = script.src;
						else newScript.textContent = script.textContent;
						return newScript;
					})
					.forEach((newScript) => {
						elements.area.appendChild(newScript);
					});
			})
			.catch((err) => {
				elements.area.innerHTML = `<p class="loading-text">Error loading game: ${err.message}</p>`;
			});
	};
	const multipleFileGame = (game) => {
		// TODO put a border around the game to keep it at the correct size
		const url = game.url + "/index.html";
		console.log(url);
		// TODO embed the game into the game area modal
		window.location.href = url;
	};

	if (game.url.includes(".html")) singleFileGame(game);
	else multipleFileGame(game);
};

const handleFilter = () => {
	const searchTerm = elements.search.value.trim().toLowerCase();
	const checkedTypes = Array.from(elements.filters)
		.filter((check) => check.checked)
		.map((check) => check.id);

	const filteredGames = filterGames(searchTerm, checkedTypes);
	renderGames(filteredGames);
};

const playRandomGame = () => openModal(getRandomGame());

const startGame = () => {
	if (!state.currentGame) return;
	loadGame(state.currentGame);
};

const init = () => {
	renderGames(games);

	elements.filters.forEach((filter) => {
		filter.addEventListener("change", handleFilter);
	});
	elements.search.addEventListener("input", handleFilter);
	elements.playRandomBtn.addEventListener("click", playRandomGame);
	elements.closeModalBtn.addEventListener("click", closeModal);
	elements.playGameBtn.addEventListener("click", startGame);
};

init();
