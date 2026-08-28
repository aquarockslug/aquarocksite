// Written by Aquarocks

function gameInit() {
	// returns a move function which changes the value of the target square
	damage = (targetIndex, amount) => (i) =>
		targetIndex === i ? squareValue(i) + amount : squareValue(i);

	[boardWidth, boardHeight] = initCamera(
		settings.columnCount,
		settings.rowCount,
	);
	board = calcBoard(boardWidth, boardHeight);
	// these functions control the state of the game
	[squarePosition, squareValue] = board((square) => 0);

	// every square has gold at a random depth, square => depth
	goldPositions = [];
	for (let i = 0; i < boardWidth * boardHeight; i++) {
		goldPositions[i] = Math.round(
			rand(settings.minGoldDepth, settings.stoneDepth - 1),
		);
	}

	// true if the mouse is on the board
	mouseOnBoard = () =>
		// WARN hard coded board positions
		mousePos.x >= 1 && mousePos.y >= 0 && mousePos.x <= 134 && mousePos.y <= 96;

	drillTimer = new Timer(1);
	bombTimer = new Timer(1);
}
function gameStart() {}
function gameUpdate() {
	moves = [];
	goldDisplay.textContent = playerGold;

	if (bombLevel > 0 && bombTimer.elapsed()) {
		if (rand() > 0.9) sfx.bomb.play();
		target = Math.round(rand(1, boardWidth * boardHeight));
		moves = useShovel(target);
		bombTimer.set((settings.maxBombLevel - bombLevel) * 0.1);
	}
	if (moves.length > 0 && rand() > 0.9) sfx.bomb.play();
	for (move of moves) if (move) [squarePosition, squareValue] = board(move);
	moves = []

	// return if the board wasn't clicked
	if (!started || !mouseOnBoard()) return;

	// use shovel
	if (drillLevel === 0 && mouseWasPressed(0))
		moves = useShovel(findSquare(mousePos));

	// use drill
	if (drillLevel > 0 && mouseIsDown(0)) {
		if (drillTimer.elapsed()) {
			moves = useShovel(findSquare(mousePos));
			drillTimer.set((settings.maxDrillLevel - drillLevel) * 0.05);
		}
	}

	// execute all valid moves in the moves list
	if (moves.length > 0 && rand() > 0.5) sfx.shovel.play();
	for (move of moves) if (move) [squarePosition, squareValue] = board(move);
}
function gameUpdatePost() {}
function gameRender() {
	drawRect(vec2(0), vec2(10000), colors.bg);

	// board shadow
	drawRect(
		squarePosition(0).add(vec2(boardWidth / 2 + 0.5, boardHeight / 2 - 1.5)),
		vec2(boardWidth, boardHeight),
		rgb(0.0, 0.0, 0.0),
	);

	for (let i = 0; i < boardWidth * boardHeight; i++) {
		depth = squareValue(i);

		// get the correct texture and damage level based on the value of the square
		color = colors.grass;
		if (depth >= settings.grassDepth) color = colors.dirt;
		if (depth >= settings.dirtDepth) color = colors.stone;
		if (depth >= settings.stoneDepth) color = colors.bedrock;
		if (goldPositions[i] === depth) color = colors.gold;

		// TODO let damage = value % 3

		drawRect(squarePosition(i), vec2(1), color);
	}
}
function gameRenderPost() {}
function initCamera(width, height) {
	cameraOffset = settings.cameraOffset;
	[cameraPos, cameraScale] = [
		vec2(width, height).scale(0.5).add(cameraOffset),
		settings.cameraScale,
	];
	return [width, height];
}
// the index of the squares all around the given square index
function calcNeighbors(width, height) {
	return (homeIndex) =>
		!homeIndex
			? Object.keys(neighbors(width * height * 0.5)) // return direction names if no homeIndex was given
			: {
					up: homeIndex + 1,
					down: homeIndex - 1,
					right: homeIndex + height,
					left: homeIndex - height,
					upperRight: homeIndex + height + 1,
					lowerRight: homeIndex + height - 1,
					upperLeft: homeIndex - height + 1,
					lowerLeft: homeIndex - height - 1,
				};
}
function calcBoard(width, height) {
	// a move function takes a squares index and returns what its value should be
	return (move, positions = [], values = []) => {
		for (let x = 0.5; x < width; x++)
			for (let y = 0.5; y < height; y++) positions.push(vec2(x, y));
		for (let i = 0; i < width * height; i++) values[i] = move(i);
		return [(i) => vec2(positions[i]), (i) => values[i]];
	};
}
function findSquare(pos) {
	let targetIndex = -1;
	squarePos = vec2(
		Math.floor(mousePos.x),
		Math.abs(Math.floor(mousePos.y)),
	).add(vec2(0.5)); // inverted y required
	for (let i = boardWidth * boardHeight; i--; )
		if (
			squarePos.x === squarePosition(i).x &&
			squarePos.y === squarePosition(i).y
		)
			targetIndex = i;
	return targetIndex;
}
// gets the neighbors of the square while checking for the edge of the board
function getNeighbors(square) {
	neighbors = calcNeighbors(boardWidth, boardHeight);

	// returns true if there is a border in the given direction
	function isBorder(square, direction, moves) {
		[onBottomEdge, onTopEdge] = [
			(square) => !(square % boardHeight),
			(square) => !((square + 1) % boardHeight),
		];

		if (
			(onTopEdge(square) &&
				(direction === "up" ||
					direction === "upperLeft" ||
					direction === "upperRight")) ||
			(onBottomEdge(square) &&
				(direction === "down" ||
					direction === "lowerLeft" ||
					direction === "lowerRight"))
		)
			return true;

		// check if index is valid
		neighborIndex = neighbors(square)[direction];
		return neighborIndex < 0 || neighborIndex > boardWidth * boardHeight;
	}

	// only return valid neighbors
	out = [];
	for (direction of neighbors())
		if (!isBorder(square, direction)) out.push(neighbors(square)[direction]);
	return out;
}
// add moves which damage the clickedSquare and surrounding pieces
function useShovel(square, moves = []) {
	if (goldPositions[square] === squareValue(square)) {
		playerGold++;
		sfx.gold.play();
	}
	moves.push(damage(square, Math.round(rand(5, 10))));

	for (neighbor of getNeighbors(square)) {
		if (goldPositions[neighbor] === squareValue(neighbor)) {
			playerGold++;
			sfx.gold.play();
		}
		moves.push(damage(neighbor, Math.round(rand(1, 5))));
	}
	return moves;
}
function upgradeDrill() {
	if (drillLevel >= settings.maxDrillLevel) return false;
	if (playerGold < drillPrice) return false;

	playerGold -= drillPrice;
	drillLevel++;

	if (drillLevel >= settings.maxDrillLevel) {
		drillDisplay.textContent = "Drill Fully upgraded";
		drillPrice = -1;
		drillPriceDisplay.textContent = drillPrice;
		return false;
	}

	drillDisplay.textContent = "Drill " + (drillLevel + 1);
	drillPrice = drillLevel * 20;
	drillPriceDisplay.textContent = drillPrice;
	return true;
}
function upgradeBomb() {
	if (bombLevel >= settings.maxBombLevel) return false;
	if (playerGold < bombPrice) return false;

	playerGold -= bombPrice;
	bombLevel++;

	if (bombLevel >= settings.maxBombLevel) {
		bombDisplay.textContent = "Dynamite Fully upgraded";
		bombPrice = -1;
		bombPriceDisplay.textContent = bombPrice;
		return false;
	}

	bombLevel++;
	bombDisplay.textContent = "Dynamite " + (bombLevel + 1);
	bombPrice = bombLevel * 20;
	bombPriceDisplay.textContent = bombPrice;
	return true
}
