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
	gameArea: $("#gameArea"),
	playGameBtn: $("#playGameBtn"),
	closeModalBtn: $("#closeModalBtn"),
	themeSelect: $("#themeSelect"),
};

const state = {
	currentGame: null,
};

const createGameElement = (game) => {
	const gameTags = Array.isArray(game.tags) ? game.tags.join(", ") : game.tags;
	const el = createEl("div");
	el.className = "item box";
	el.innerHTML = `<div class="item-image">
  <img src="${game.img}" alt="${game.name}" />
  <span class="item-status ${gameTags}">Play</span>
</div>
<h3>${game.name}</h3>
<small>${gameTags}</small>`;

	el.querySelector(".item-image").addEventListener("click", () => openModal(game));

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
	elements.gameArea.innerHTML = `<p class="loading-text">Loading...</p>`;
	elements.modal.classList.remove("hidden");
	startGame(game);
};

const closeModal = () => {
	elements.modal.classList.add("hidden");
	elements.gameArea.innerHTML = "";
	elements.gameArea.removeAttribute("style");
	stopGame();
};

const stopGame = () => {
	state.currentGame = null;
};

const loadGame = (game) => {
	const url = game.url.includes(".html") ? game.url : `${game.url}/index.html`;
	elements.gameArea.innerHTML = `<iframe src="${url}" class="game-iframe"></iframe>`;
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

	const savedTheme = localStorage.getItem("theme") || "light";
	document.documentElement.setAttribute("data-theme", savedTheme);
	elements.themeSelect.value = savedTheme;

	elements.themeSelect.addEventListener("change", (e) => {
		const theme = e.target.value;
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	});
};

init();
