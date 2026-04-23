export const games = [
	{
		name: "Star Checkers",
		url: "games/star-checkers/star-checkers.html",
		img: "games/star-checkers/star-checkers.png",
		tags: ["board", "touch"],
		description:
			"be the first to move all 10 of your marbles from your starting triangle to the opposite corner",
	},
	{
		name: "Mancala",
		url: "games/mancala/mancala.html",
		img: "games/mancala/mancala.png",
		tags: ["board", "touch"],
		description:
			"Click a pocket to place marbles counter-clockwise. \nCapture if last marble lands in an empty pocket. \nGo again if last marble lands in your home.",
	},
	{
		name: "Gasworks",
		url: "games/gasworks/index.html",
		img: "games/gasworks/gasworks.png",
		tags: ["puzzle", "touch"],
		description: "Navigate a maze of pipes and toxic gas",
	},
	{
		name: "Trivia",
		url: "games/trivia-cubes/index.html",
		img: "games/trivia-cubes/screenshot.png",
		tags: "puzzle",
		description: "Trivia questions from https://opentdb.com/",
	},
	{
		name: "Fungal Escape",
		url: "games/fungal-escape/index.html",
		img: "games/fungal-escape/assets/titleart.png",
		tags: "action",
		description: "Dodge bullets with the arrow keys",
	},
	{
		name: "Cosmic Critters",
		url: "games/cosmic-critters/index.html",
		img: "games/cosmic-critters/ufo.png",
		tags: "action",
		description: "Scan each species of animal",
	},
	{
		name: "Mega Man & Bass Queen's Gambit",
		url: "games/mmqg/index.html",
		img: "games/mmqg/index.png",
		tags: "action",
		description: "Take on the role of Mega man and defeat Queen's forces, challenging 10 new robot masters and eventually the queen herself!",
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
