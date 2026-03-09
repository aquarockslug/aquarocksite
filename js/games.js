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
		description: "Navigate a maze of pipes while avoiding breathing in toxic gas",
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
	{
		name: "Boop",
		url: "games/Boop",
		img: "games/Boop/tiles.png",
		type: "board",
		description: "Knock cats off the board",
	},
	{
		name: "Mini Mega Maker",
		url: "games/mini_mega",
		img: "games/mini_mega/assets/images/megaman.png",
		type: "action",
		description: "Make a Megaman level",
	},
	{
		name: "Mega Man Queen's Gambit",
		url: "games/mmqg-html5",
		img: "games/mmqg-html5/index.png",
		type: "action",
		description: "Mega Man fangame",
	},
	{
		name: "Trivia Cubes",
		url: "games/trivia_cubes",
		img: "games/trivia_cubes/images/cube.svg",
		type: "puzzle",
		description: "Trivia",
	},
	{
		name: "Snail Mail",
		url: "games/snail_mail",
		img: "games/trivia_cubes/images/cube.svg",
		type: "puzzle",
		description: "Deliver packages",
	},
	{
		name: "Dimension Drop",
		url: "games/dimension_drop",
		img: "games/dimension_drop/screenshot.png",
		type: "action",
		description: "Find the exit",
	},
	{
		name: "Space Flight",
		url: "games/space_game",
		img: "games/space_game/screenshot.png",
		type: "action",
		description: "Fly through rings",
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
