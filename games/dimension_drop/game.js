// Written by Aquarocks
// the lines represent cracks, you must find the broken spot and drop through it

let floorNum = 1;
let goalParticles;
const worldSize = fn.constant(100);
const worldBounds = () => ({ xl: -worldSize, xr: worldSize, yb: -worldSize, yt: worldSize });
const randomPlace = (size) => ({
	x: rand(-worldSize(), worldSize()),
	y: rand(-worldSize(), worldSize()),
});
const randomPlaces = (i, sites = []) =>
	i ? randomPlaces(i - 1, [...sites, randomPlace(worldSize())]) : sites;
const computeVoronoi = (sites) => new Voronoi().compute(sites, worldBounds());
const toVec2 = (obj) => (obj ? vec2(obj.x, obj.y) : null);
const staticSites = (sites = []) => [
	...sites,
	{ x: 5, y: 0 },
	{ x: -5, y: 0 },
	{ x: 0, y: 5 },
	{ x: 0, y: -5 },
	{ x: -2.5, y: 0 },
	{ x: 2.5, y: 0 },
];
const movePlayer = (speed = settings.initSpeed) => {
	if (keyIsDown('ArrowUp')) {
		cameraPos = cameraPos.add(vec2(0, 1 * speed));
		bgPos = bgPos.add(vec2(0, 1 * speed * settings.bgScroll));
	}
	if (keyIsDown('ArrowDown')) {
		cameraPos = cameraPos.add(vec2(0, -1 * speed));
		bgPos = bgPos.add(vec2(0, -1 * speed * settings.bgScroll));
	}
	if (keyIsDown('ArrowLeft')) {
		cameraPos = cameraPos.add(vec2(-1 * speed, 0));
		bgPos = bgPos.add(vec2(-1 * speed * settings.bgScroll, 0));
	}
	if (keyIsDown('ArrowRight')) {
		cameraPos = cameraPos.add(vec2(1 * speed, 0));
		bgPos = bgPos.add(vec2(1 * speed * settings.bgScroll, 0));
	}
};
// edge color functions will return a color or call the next function
const defaultColor = (i) => (randInt(0, 2) ? rgb(0, 0, 0, 0) : rgb(0.15, 0, 0.15)); // default has no next color
const nearStartColor = (i, nextColor) => (startDistances[i] < 10 ? rgb(0.2, 0, 0.2) : nextColor(i));
const nearGoalColor = (i, range, color, nextColor) =>
	goalDistances[i] < range ? color : nextColor(i);
const applyColorsToEdges = (getColor) => fn.map(getColor, [...Array(edges.length).keys()]);
const bgColor = () => rgb(0.05, 0, 0.05, 1 - percent(floorNum, 0, settings.goalCount));
// returns the position of the goal, chooses a site that is far enough away
const setupGoal = () => {
	goalSite = vec2(0);
	while (cameraPos.distance(toVec2(goalSite)) < worldSize() - 10)
		goalSite = sites[randInt(0, sites.length - 1)];
	return goalSite;
};
// put boosters on some of the verts, spread is the minimum distance between boosters
const setupBoosters = (verts, spread) =>
	verts
		.filter((vert) => toVec2(vert).distance(vec2(0)) > 25)
		.filter((vert) => randInt(0, 2) === 0)
		.reduce((acc, vert) => {
			if (acc.every((vert2) => toVec2(vert).distance(toVec2(vert2)) > spread)) acc.push(vert);
			return acc;
		}, []);

// loads a new floor
function gameInit() {
	cameraPos = vec2(0)
	cameraScale = 16;
	document.getElementById('floorLabel').innerText = `Floor Number ${floorNum}`;
	setCanvasFixedSize(settings.screenResolution);
	sites = staticSites(randomPlaces(100));
	diagram = computeVoronoi(sites);
	[bgAngle, bgIndex, bgPos] = [(Math.PI / 2) * randInt(1, 4), randInt(1, 3), vec2(0)];
	[verts, edges, goalSite] = [diagram.vertices, diagram.edges, setupGoal()];
	boosterSites = setupBoosters(verts, 25);
	console.warn('DEBUGPRINT[24]: game.js:70: boosterSites=', boosterSites);

	const calcDistances = (target) =>
		fn.map((e) => target.distance(toVec2(Math.random > 0.5 ? e.lSite : e.rSite)), edges);
	[goalDistances, startDistances] = [calcDistances(toVec2(goalSite)), calcDistances(vec2(0))];

	edgeColor = applyColorsToEdges((i) =>
		nearGoalColor(i, 25, randInt(0, 9) ? rgb(0.9, 0, 0.9) : rgb(0, 0, 0, 0), (i) =>
			nearGoalColor(i, 50, randInt(0, 6) ? rgb(0.5, 0, 0.5) : rgb(0, 0, 0, 0), (i) =>
				nearGoalColor(i, 100, randInt(0, 3) ? rgb(0.25, 0, 0.25) : rgb(0, 0, 0, 0), (i) =>
					nearStartColor(i, defaultColor),
				),
			),
		),
	);

	let goalParticleParam = [0.02, 0.05, 1, 1, 0, 3.14, 1, 0.2, 0, 0, 1];
	if (goalParticles) goalParticles.destroy();
	// biome-ignore format:
	goalParticles = new ParticleEmitter(toVec2(goalSite), 0, 5, 0, 10, 3.14, tile(0, 32), new Color(1, 1, 1, 1), new Color(1, 1, 1, 1), new Color(1, 1, 1, 0), new Color(1, 1, 1, 0), 4, 1, 5, ...goalParticleParam);

	// biome-ignore format:
	backgroundParticles = new ParticleEmitter(vec2(0), 0, 5, 0, 10, 3.14, tile(0, 32), new Color(1, 1, 1, 1), new Color(1, 1, 1, 1), new Color(1, 1, 1, 0), new Color(1, 1, 1, 0), 2, 3, 5, ...goalParticleParam);
	// biome-ignore format:
	backgroundParticles2 = new ParticleEmitter(vec2(0), 0, 5, 0, 10, 3.14, tile(0, 32), new Color(1, 1, 1, 1), new Color(1, 1, 1, 1), new Color(1, 1, 1, 0), new Color(1, 1, 1, 0), 10, 3, 0, ...goalParticleParam);
}
function start() {
	started = true;
	floorNum = 1;
	boosterCount = 0
	speed = settings.initSpeed;
	scoreTimer = new Timer(0);
	if (backgroundParticles) backgroundParticles.destroy();
	if (backgroundParticles2) backgroundParticles2.destroy();
	sfx.void.play();
	gameInit();
}
function gameUpdate() {
	if (!started) return;
	if (cameraPos.distance(toVec2(goalSite)) > 1.5) {
		// looking for an exit
		for (booster of boosterSites) {
			if (cameraPos.distance(toVec2(booster)) < 2.5) {
				if (speed === settings.initSpeed) {
					sfx.void.play();
					boosterCount++
				}
				speed = settings.initSpeed * 2;
				// TODO stop boost early if direction changes
				setTimeout(() => {
					speed = settings.initSpeed;
				}, 750);
			}
		}
		movePlayer(speed);
		return;
	}

	// exit found
	floorNum++;
	if (floorNum >= settings.goalCount + 1) {
		// end of game
		started = false;
		document.getElementById('timeLabel').innerText =
			`Completed ${settings.goalCount} floors in ${Number(scoreTimer.get()).toFixed(1)} seconds`;
		document.getElementById('menu').hidden = false;
		document.getElementById('ui').hidden = false;
		started = false;
		sfx.void.play();
	} else {
		// next floor
		sfx.teleport.play();
		gameInit();
	}
}
function gameUpdatePost() {}
function gameRender() {
	drawTile(bgPos, vec2(worldSize() * 2), tile(vec2(0), vec2(1024), bgIndex, bgAngle));
	drawRect(vec2(0), vec2(worldSize() * 3), bgColor());

	// draw the line at each index of edges
	for (let i = 0; i < edges.length; i++)
		drawLine(toVec2(edges[i].lSite), toVec2(edges[i].rSite), 0.3, edgeColor[i]);
	for (site of boosterSites) drawRect(site, vec2(0.5), rgb(1, 0, 1, 0.8));

	drawRect(goalSite, vec2(1), rgb(1, 0, 1));

	drawRect(toVec2(goalSite).add(vec2(0.5, 0.5)), vec2(0.75), rgb(0.95, 0, 0.95));
	drawRect(toVec2(goalSite).add(vec2(-0.5, -0.5)), vec2(0.75), rgb(0.95, 0, 0.95));

	drawRect(toVec2(goalSite).add(vec2(1, 1)), vec2(0.5), rgb(0.95, 0, 0.95));
	drawRect(toVec2(goalSite).add(vec2(-1, -1)), vec2(0.5), rgb(0.95, 0, 0.95));

	drawRect(toVec2(goalSite).add(vec2(1.3, 1.3)), vec2(0.25), rgb(0.95, 0, 0.95));
	drawRect(toVec2(goalSite).add(vec2(-1.3, -1.3)), vec2(0.25), rgb(0.95, 0, 0.95));

	drawTile(cameraPos, vec2(1), tile(vec2(32, 0), settings.openmojiResolution));
}
function gameRenderPost() {}
