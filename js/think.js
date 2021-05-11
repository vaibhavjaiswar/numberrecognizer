function dot(A, B) {
	let rowA = A.length
	let colA = A[0].length == undefined ? 1 : A[0].length
	let rowB = B.length
	let colB = B[0].length == undefined ? 1 : B[0].length
	if (colA != rowB) {
		console.log(`A (${rowA},${colA}) B (${rowB},${colB})`)
		throw Error('Dimensions is not correct for dot product.')
	}
	let result = []
	for(let i=0; i<rowA; i++) {
		result.push([])
		for(let j=0; j<colB; j++){
			result[i].push(0)
		}
	}
	// console.log(A)
	// console.log(B)
	// console.log(`A (${rowA},${colA}) B (${rowB},${colB})`)
	// console.log(result)	
	for(let row=0; row<rowA; row++) {
		for(let col=0; col<colB; col++) {
			let sum = 0
			for(let i=0; i<rowB; i++)
				sum += A[row][i] * B[i][col]
				// sum += A[row][i]*B[i][col]
			result[row][col] = sum
		}
	}
	return result
}

function sigmoid(A) {
	for(let row=0; row<A.length; row++) {
		for(let col=0; col<A[0].length; col++) {
			A[row][col] = 1 / (1 + Math.exp(-A[row][col]))
		}
	}
	return A
}

function think(X) {
	// console.log('Layer 1: X * W[0][0]')
	// Hidden Layer 1
	let A1 = dot(X, weights[0])
	let L1 = sigmoid(A1)

	// Hidden Layer 2
	let A2 = dot(L1, weights[1])
	let L2 = sigmoid(A2)

	// Output
	let A3 = dot(L2, weights[2])
	let Y = sigmoid(A3)

	console.log(Y)

	let max = -1
	let index = -1

	for(let i=0; i<Y[0].length; i++) {
		if (max < Y[0][i]) {
			max = Y[0][i]
			index = i
		}
	}
	// console.log(`Number is ${index}.`)// Max value at ${max}.

	if (max == 0.6011409536905252)	// for empty drawing
		return `I think you should draw something...`
	if(0.9 < max)
		return	`Number is ${index}.`
	else if (0.8 < max)
		return `Number is most probably ${index}.`
	else if (0.5 < max)
		return `Taking rough guess. Number is ${index}.`
	return `Not trained for this!`
}


/*
A = [
	[1,1,1],
	[1,1,2],
	[1,1,3],
	[1,1,4]]	// 4 x 3
B = [
	[1,0],
	[1,2],
	[1,3]]			// 3 x 3

console.log(dot(A, B))
*/
