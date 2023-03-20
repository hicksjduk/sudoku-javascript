const permittedValues = [1,2,3,4,5,6,7,8,9]
const emptySquare = 0
const gridSize = permittedValues.length
const boxes = calcBoxes()

function* solve(grid)
{
    const {done, value:square} = emptySquares(grid).next()
    if (done)
        yield grid
    else
        yield* solveAt(grid, square)
}

function range(first, last, step=1)
{
    const test = step < 0 ? i => i >= last : i => i <= last
    const answer = []
    for (let n = first; test(n); n += step)
        answer.push(n)
    return answer
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
        yield* solve(setValueAt(grid, square, value))
}

function setValueAt(grid, [row, col], value) {
    const newRow = grid[row].map((v, i) => i == col ? value : v)
    return grid.map((r, i) => i == row ? newRow : r)
}

function* allowedValues(grid, square) {
    const [row, col] = square
    const functions = [() => rowValues(grid, row),
                       () => colValues(grid, col),
                       () => boxValues(grid, boxContaining(square))]
    const blockedValues = new Set(functions.flatMap(f => f()))
    for (v of permittedValues.filter(n => !blockedValues.has(n)))
        yield v
}

function rowValues(grid, row) {
    return grid[row].filter(n => n != emptySquare)
}

function colValues(grid, col) {
    return grid.map(row => row[col]).filter(n => n != emptySquare)
}

function boxValues(grid, [[topRow, leftCol], [bottomRow, rightCol]]) {
    return grid.slice(topRow, bottomRow + 1)
        .flatMap(r => r.slice(leftCol, rightCol + 1))
        .filter(n => n != emptySquare)
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

module.exports = {solve, range, emptySquares, setValueAt}