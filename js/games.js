export const games = [
	{
		name: "Star Checkers",
		url: "games/star-checkers/star-checkers.html",
		img: "games/star-checkers/star-checkers.png",
		tags: ["board", "touch", "JS"],
		description:
			"be the first to move all 10 of your marbles from your starting triangle to the opposite corner",
	},
	{
		name: "Mancala",
		url: "games/mancala/mancala.html",
		img: "games/mancala/mancala.png",
		tags: ["board", "touch", "JS"],
		description:
			"Click a pocket to place marbles counter-clockwise. \nCapture if last marble lands in an empty pocket. \nGo again if last marble lands in your home.",
	},
	{
		name: "Gasworks",
		url: "games/gasworks/index.html",
		img: "games/gasworks/docs/screenshot.jpg",
		tags: ["puzzle", "touch", "JS"],
		description: "Navigate a maze of pipes and toxic gas",
	},
	{
		name: "Trivia",
		url: "games/trivia-cubes/index.html",
		img: "games/trivia-cubes/screenshot.png",
		tags: ["puzzle", "touch", "JS"],
		description: "Trivia questions from https://opentdb.com/",
	},
	{
		name: "Fungal Escape",
		url: "games/fungal-escape/index.html",
		img: "games/fungal-escape/assets/titleart.png",
		tags: ["action", "JS"],
		description: "Dodge bullets with the arrow keys",
	},
	{
		name: "Cosmic Critters",
		url: "games/cosmic-critters/index.html",
		img: "games/cosmic-critters/ufo.png",
		tags: ["action", "JS"],
		description: "Scan each species of animal",
	},
	{
		name: "Mega Man & Bass Queen's Gambit",
		url: "games/mmqg/index.html",
		img: "games/mmqg/index.png",
		tags: ["action", "touch"],
		description:
			"Take on the role of Mega man and defeat Queen's forces, challenging 10 new robot masters and eventually the queen herself!",
	},
	// {
	// 	name: "Mega Man & Bass Queen's Gambit Development Version",
	// 	url: "https://itch.io/embed-upload/15566474?color=5c0823",
	// 	img: "https://img.itch.zone/aW1nLzI0MTI1ODkxLnBuZw==/180x143%23c/ZuuOko.png",
	// 	tags: ["action", "touch"],
	// 	description: "The most current version of the game including unfinished content.",
	// },
	{
		name: "Snail Mail",
		url: "https://itch.io/embed-upload/12174491?color=333333",
		img: "https://img.itch.zone/aW1hZ2UvMzE0OTU4NS8xODgxNTgwMS5wbmc=/347x500/bHf3S8.png",
		tags: ["puzzle"],
		description:
			"Find and deliver lost packages while you explore a unique, cozy little island.",
	},
	{
		name: "Sling It",
		url: "https://itch.io/embed-upload/12060386?color=000000",
		img: "https://img.itch.zone/aW1hZ2UvMzAxODI1NS8xODEzMzA0NC5wbmc=/original/3BUKhz.png",
		tags: ["puzzle"],
		description: "Click and drag anywhere to launch objects.",
	},
	{
		name: "Pokemon Binder",
		url: "games/pokemon_book/dist/index.html",
		img: "games/pokemon_book/dist/pages/0.png",
		tags: ["puzzle"],
		description: "Use the mouse to flip the pages of this binder of Pokemon cards",
	},
];
export const getRandomGame = () => games[Math.floor(Math.random() * games.length)];

export const filterGamesBySearch = (searchTerm) =>
	games.filter((game) => game.name.toLowerCase().includes(searchTerm.toLowerCase()));

export const filterGamesByType = (types) =>
	types.length === 0
		? games
		: games.filter((game) => {
				const gameTags = Array.isArray(game.tags) ? game.tags : [game.tags];
				return types.some((type) => gameTags.includes(type));
			});

export const filterGames = (searchTerm, types) =>
	games
		.filter((game) => filterBySearch(game, searchTerm))
		.filter((game) => filterByType(game, types));

const filterBySearch = (game, searchTerm) =>
	searchTerm === "" || game.name.toLowerCase().includes(searchTerm.toLowerCase());

const filterByType = (game, types) => {
	if (types.length === 0) return true;
	const gameTags = Array.isArray(game.tags) ? game.tags : [game.tags];
	return types.some((type) => gameTags.includes(type));
};
