const drawSection = document.querySelector('#draw-section')
const tools = document.querySelector('#tools')
const pencil = document.querySelector('#pencil')
const eraser = document.querySelector('#eraser')
const reset = document.querySelector('#reset')
const drawBox = document.querySelector('#draw-box')
const previewDiv = document.getElementById('preview-div')
const neuralPic = document.getElementById('neuralnet')
const resultBox = document.getElementById('result-box')
const floatingDiv = document.getElementById('floating-div')
const sampleOpenBtn = document.getElementById('sample-open-btn')
const sampleCloseBtn = document.getElementById('sample-close-btn')
const pixelWidth = 10
const pixelMargin = 0.5
const n = 20
const nRows = n
const nCols = n

let drawing = []
let usingPencil = true
let X = null

// ----------------- Initailizing web app -------------------

drawBox.style.width = `calc(${nRows*pixelWidth + nRows*2*pixelMargin + 15}px)`

for (let row=0; row<nRows; row++) {
	drawing.push([])
	let str = ''
	str += `<div class="pixel-row">`
	for (let col=0; col<nCols; col++) {
		str += `<div class="pixel" data-row="${row}" data-col="${col}"></div>`
		drawing[row].push(0)
	}
	drawBox.innerHTML += `${str}</div>`
}

const allPixel = document.querySelectorAll('.pixel')

allPixel.forEach((pixel,i) => {
	pixel.style.margin = `${pixelMargin}px`
	pixel.style.width = `${pixelWidth}px`
	pixel.style.height = `${pixelWidth}px`
	pixel.addEventListener('mousemove', (e) => {
		e.preventDefault()
		if(e.buttons == 1) {
			const row = e.target.getAttribute('data-row')	// parseInt(e.target.getAttribute('data-row'))
			const col = e.target.getAttribute('data-col')	// parseInt(e.target.getAttribute('data-col'))
			// const index = row*nRows + col
			// console.log(`(${row},${col}) i=${i} cal=${index}`)

			if (usingPencil) {
				drawing[row][col] = 1
				allPixel[i].classList.add('pixel-on')
			} else {
				drawing[row][col] = 0
				allPixel[i].classList.remove('pixel-on')
			}
		}
		// console.log(`${drawing}`)
	})
	pixel.addEventListener('mousedown', (e) => {
		e.preventDefault()
		if(e.buttons == 1) {
			const row = e.target.getAttribute('data-row')
			const col = e.target.getAttribute('data-col')

			if (drawing[row][col]) {
				drawing[row][col] = 0
				allPixel[i].classList.remove('pixel-on')
			} else {
				drawing[row][col] = 1
				allPixel[i].classList.add('pixel-on')
			}
		}
	})
})

tools.addEventListener('click', () => {
	usingPencil = !usingPencil
	if (usingPencil) {
		pencil.style.opacity = 1
		eraser.style.opacity = 0.2
	} else {
		eraser.style.opacity = 1
		pencil.style.opacity = 0.2
	}
	// console.log('Toolbox click')
})

reset.addEventListener('click', (e) => {
	e.stopPropagation()
	drawing = []
	for (let row=0; row<nRows; row++) {
		drawing.push([])
		for (let col=0; col<nCols; col++) {
			drawing[row].push(0)
		}
	}
	allPixel.forEach(pixel => pixel.classList.remove('pixel-on'))
})

neuralPic.style.display = 'none'
resultBox.style.display = 'none'

sampleOpenBtn.addEventListener('click', (e) => {
	floatingDiv.style.zIndex = '10'
	floatingDiv.style.opacity = '1'
})
sampleCloseBtn.addEventListener('click', (e) => {
	setTimeout(() => floatingDiv.style.zIndex = '-10', 500)
	floatingDiv.style.opacity = '0'
})



/*----------------------------- Neural Net functions ------------------------------*/
// shows preview image with respect to input drawing
function showPrev() {
	const previewBox = document.querySelector('#preview-box')
	previewDiv.style.height = 'auto'
	previewBox.innerHTML = ''
	X = [[]]
	let imgX = []
	let str = ''
	let str2 = ''
	for (let row=0; row<nRows-1; row=row+2) {
		str += `<div class="pixel-row">`
		imgX.push([])
		// str2 +=``
		for (let col=0; col<nCols-1; col=col+2) {
			let opacity = (drawing[row][col]+drawing[row][col+1]+drawing[row+1][col]+drawing[row+1][col+1])/4
			str += `<div class="pixel" style="background-color: rgba(0,0,0,${opacity})"; data-row="${row}" data-col="${col}"></div>`
			str2 +=`${opacity} `
			// X[row/2].push(opacity)
			X[0].push(opacity)
			imgX[row/2].push(opacity)
		}
		str += `</div>`
		str2 +=`\n`
	}
	previewBox.innerHTML = str

	let imgString = ''
	for(let i=0; i<imgX.length; i++) {
		for(let j=0; j<imgX[0].length; j++) {
			imgString += `${imgX[i][j]} `
		}
		imgString = imgString.substring(0,imgString.length-1) + '\n'
	}
	console.log(imgString)
	neuralPic.style.display = 'none'
	resultBox.style.display = 'none'
}


// runs neural net to recognize drawing
function recognize() {
	resultBox.style.opacity = '0'
	showPrev()
	setTimeout(() => {
		neuralPic.scrollIntoView({ behavior: 'smooth' })
	}, 500)
	neuralPic.style.visibility = 'visible'
	neuralPic.style.display = 'inline-block'
	resultBox.style.display = 'inline-block'
	// resultBox.style.opacity = '1'
	neuralPic.classList.add('animate-think')
	resultBox.classList.add('animate-result')
	// resultBox.classList.add('fade-in')
	setTimeout(() => {
		neuralPic.classList.remove('animate-think')
		neuralPic.style.visibility = 'hidden'
	}, 2500)
	setTimeout(() => {
		resultBox.classList.remove('animate-result')
		// resultBox.classList.remove('fade-in')
		resultBox.style.opacity = '1'
	}, 3500)
	const resultString = think(X)
	resultBox.innerHTML = '<p>' + resultString + '</p>'
}


// console.log()