canvas.width = innerWidth
canvas.height = innerHeight
mx = (canvas.width / 2) | 0
my = (canvas.height / 2) | 0
pen = canvas.getContext('2d')


function drawLines(lines) {
	lines.forEach(line => {
		const [x1, y1, x2, y2] = line
		pen.moveTo(x1, y1)
		pen.lineTo(x2, y2)
	})	
}

function drawSnowflake(lines, x, y, angle) {
	pen.resetTransform()
	pen.translate(x, y)
	pen.rotate(angle)
	for (let i = 0; i < 6; i++) {
		drawLines(lines)
		pen.scale(-1, 1)
		drawLines(lines)
		pen.scale(-1, 1)
		pen.rotate(Math.PI / 3)
	}
}

const flakes = [
	[[0, 0, 0, 100], [0, 50, 10, 75], [0, 30, 20, 30], [20, 30, 0, 50]],
	[[0, 0, 0, 100], [0, 10, 20, 50], [0, 20, 10, 60], [0, 30, 5, 70]],
	[[0, 0, 20, 20], [20, 20, 0, 40], [0, 10, 40, 60], [40, 60, 0, 100]],
	[[0, 0, 10, 10], [10, 10, 0, 20], [0, 15, 30, 30], [0, 30, 40, 40], [30, 30, 0, 100], [40, 40, 0, 100]]
]

const vectors = [[1, 1.5], [2, 1], [.75, 1], [1.5, .5]]

let frame = 0
let keepGoing = true
function draw(){
	if (keepGoing) requestAnimationFrame(draw)
	pen.resetTransform()
	pen.clearRect(0, 0, canvas.width, canvas.height)
	pen.beginPath();
	flakes.forEach( (flake, index) => {
		drawSnowflake(flake, 300 * index + 200, frame * vectors[index][0], .01 * vectors[index][1] * frame)
	})

	pen.stroke()
	frame++
	if (frame > canvas.height) keepGoing = false
}

draw()