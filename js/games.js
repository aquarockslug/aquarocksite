export const games = [
	{
		name: "Star Checkers",
		url: "games/star-checkers/star-checkers.png",
		type: "board",
		description:
			"be the first to move all 10 of your marbles from your starting triangle to the opposite corner",
	},
	{
		name: "Gas Mask",
		url: "games/gas-game/gas-game.png",
		type: "puzzle",
		description: "I haven't added this game to the site yet",
	},
];

export const getRandomGame = () =>
	games[Math.floor(Math.random() * games.length)];

export const filterGamesBySearch = (searchTerm) =>
	games.filter((game) =>
		game.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

export const filterGamesByType = (types) =>
	types.length === 0
		? games
		: games.filter((game) => types.includes(game.type));

export const filterGames = (searchTerm, types) =>
	games
		.filter((game) => filterBySearch(game, searchTerm))
		.filter((game) => filterByType(game, types));

const filterBySearch = (game, searchTerm) =>
	searchTerm === "" ||
	game.name.toLowerCase().includes(searchTerm.toLowerCase());

const filterByType = (game, types) =>
	types.length === 0 || types.includes(game.type);
