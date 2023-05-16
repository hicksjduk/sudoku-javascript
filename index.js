const permittedValues = [1,2,3,4,5,6,7,8,9]
const emptySquare = 0
const gridSize = permittedValues.length
const boxes = calcBoxes()

if (gridSize == 0)
    throw "Permitted values is empty"
if (permittedValues.includes(emptySquare))
    throw "Permitted values contains the empty square value"
if (hasDuplicates(permittedValues))
    throw ("Permitted values contains duplicates")

function* solve(grid)
{
    validate(grid)
    yield* solveValid(grid)
}

function* solveValid(grid)
{
    const {done, value:square} = emptySquares(grid).next()
    if (done)
        yield grid
    else
        yield* solveAt(grid, square)
}

function validate(grid) {
    if (grid.length != gridSize)
        throw "Wrong number of rows"
    grid.forEach(row => {
        if (row.length != gridSize)
            throw "Wrong number of columns"
        const values = row.filter(notEmpty)
        if (!values.every(n => permittedValues.includes(n)))
            throw "Invalid value"
        if (hasDuplicates(values))
            throw "Row contains duplicate values"
    })
    for (let i = 0; i < gridSize; i++) 
        if (hasDuplicates(colValues(grid, i)))
            throw "Column contains duplicate values"
    for (const b of boxes)
        if (hasDuplicates(boxValues(grid, b)))
            throw "Box contains duplicate values"
}

function hasDuplicates(arr) {
    return arr.length != new Set(arr).size
}

function* emptySquares(grid)
{
    for (let row = 0; row < grid.length; row++) 
        for (let col = 0; col < grid[row].length; col++)
            if (grid[row][col] == emptySquare)
                yield [row, col]
}

function* solveAt(grid, square) {
    for (const value of allowedValues(grid, square))
        yield* solveValid(setValueAt(grid, square, value))
}

function setValueAt(grid, [row, col], value) {
    const newRow = replaceValueAt(grid[row], col, value)
    return replaceValueAt(grid, row, newRow)
}

function replaceValueAt(arr, index, value) {
    return arr.map((v, i) => i == index ? value : v)
}

function* allowedValues(grid, square) {
    const [row, col] = square
    const blockedValues = new Set(rowValues(grid, row)
        .concat(colValues(grid, col), boxValues(grid, boxContaining(square))))
    for (const v of permittedValues.filter(n => !blockedValues.has(n)))
        yield v
}

function rowValues(grid, row) {
    return grid[row].filter(notEmpty)
}

function colValues(grid, col) {
    return grid.map(row => row[col]).filter(notEmpty)
}

function boxValues(grid, [[topRow, leftCol], [bottomRow, rightCol]]) {
    return grid.slice(topRow, bottomRow + 1)
        .flatMap(r => r.slice(leftCol, rightCol + 1))
        .filter(notEmpty)
} 

function notEmpty(n) {
    return n != emptySquare
}

function calcBoxSize() {
    const squareRoot = Math.sqrt(gridSize)
    const cols = range(Math.ceil(squareRoot), gridSize).find(n => gridSize % n == 0)
    return [gridSize / cols, cols]
}

function calcBoxes() {
    const [boxRows, boxCols] = calcBoxSize()
    const boxTopCorners = range(0, gridSize - 1, boxRows).flatMap(row => 
        range(0, gridSize - 1, boxCols).map(col => [row, col])
    )
    return boxTopCorners.map(([topRow, leftCol]) => 
        [[topRow, leftCol], [topRow + boxRows - 1, leftCol + boxCols -1]]
    )
}

function boxContaining([row, col]) {
    return boxes.find(([[topRow, leftCol], [bottomRow, rightCol]]) =>
        topRow <= row && bottomRow >= row && leftCol <= col && rightCol >= col
    )
}

function range(first, last, step=1)
{
    const test = step < 0 ? i => i >= last : i => i <= last
    const answer = []
    for (let n = first; test(n); n += step)
        answer.push(n)
    return answer
}

module.exports = {solve, range, emptySquares, setValueAt}