export const games = [
	{
		name: "Star Checkers",
		url: "games/star-checkers/star-checkers.html",
		img: "games/star-checkers/star-checkers.png",
		type: "board",
		description:
			"be the first to move all 10 of your marbles from your starting triangle to the opposite corner",
	},
	{
		name: "Mancala",
		url: "games/mancala/mancala.html",
		img: "games/mancala/mancala.png",
		type: "board",
		description: "Mancala in JS",
	},
	{
		name: "Gas Mask",
		url: "games/gas-game",
		img: "games/gas-game/screenshot.png",
		type: "puzzle",
		description: "Navigate the maze while avoiding breathing in toxic gas",
	},
	{
		name: "Fungal Escape",
		url: "games/Fungal-Escape",
		img: "games/Fungal-Escape/assets/fungal-escape-titleart.png",
		type: "action",
		description: "Dodge the bullets",
	},
	{
		name: "Cosmic Critters",
		url: "games/Cosmic-Critters",
		img: "games/Cosmic-Critters/rock.png",
		type: "action",
		description: "Dodge the bullets",
	},
];

export const getRandomGame = () => games[Math.floor(Math.random() * games.length)];

export const filterGamesBySearch = (searchTerm) =>
	games.filter((game) => game.name.toLowerCase().includes(searchTerm.toLowerCase()));

export const filterGamesByType = (types) =>
	types.length === 0 ? games : games.filter((game) => types.includes(game.type));

export const filterGames = (searchTerm, types) =>
	games
		.filter((game) => filterBySearch(game, searchTerm))
		.filter((game) => filterByType(game, types));

const filterBySearch = (game, searchTerm) =>
	searchTerm === "" || game.name.toLowerCase().includes(searchTerm.toLowerCase());

const filterByType = (game, types) => types.length === 0 || types.includes(game.type);
