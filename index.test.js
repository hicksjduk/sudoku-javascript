

const {solve, range, emptySquares, setValueAt} = require("./index")

describe("Solve", () => {
    test("Solvable", () => {
        const expected = [
            [8, 1, 2, 7, 5, 3, 6, 4, 9],
            [9, 4, 3, 6, 8, 2, 1, 7, 5],
            [6, 7, 5, 4, 9, 1, 2, 8, 3],
            [1, 5, 4, 2, 3, 7, 8, 9, 6],
            [3, 6, 9, 8, 4, 5, 7, 2, 1],
            [2, 8, 7, 1, 6, 9, 5, 3, 4],
            [5, 2, 1, 9, 7, 4, 3, 6, 8],
            [4, 3, 8, 5, 2, 6, 9, 1, 7],
            [7, 9, 6, 3, 1, 8, 4, 5, 2]]
        const {value:solution} = solve(puzzle).next()
        expect(solution).toStrictEqual(expected)
    })
    test("Not solvable", () => {
        const {done} = solve(setValueAt(puzzle, [8,8], 3)).next()
        expect(done).toBeTrue
    })
})

describe("Range", () => {
    test("Ascending", () => {
        expect(range(1,10,2)).toStrictEqual([1,3,5,7,9])
    })

    test("Ascending, first > second", () => {
        expect(range(10,1,2)).toStrictEqual([])
    })

    test("Descending", () => {
        expect(range(1,-10,-2)).toStrictEqual([1,-1,-3,-5,-7,-9])
    })

    test("Descending, first < second", () => {
        expect(range(1,10,-2)).toStrictEqual([])
    })
})

const puzzle = [
    [8,0,0,0,0,0,0,0,0],
    [0,0,3,6,0,0,0,0,0],
    [0,7,0,0,9,0,2,0,0],
    [0,5,0,0,0,7,0,0,0],
    [0,0,0,0,4,5,7,0,0],
    [0,0,0,1,0,0,0,3,0],
    [0,0,1,0,0,0,0,6,8],
    [0,0,8,5,0,0,0,1,0],
    [0,9,0,0,0,0,4,0,0]
]

describe("emptySquares", () => {
    test("Find first", () => {
        const {done, value} = emptySquares(puzzle).next()
        expect(done).toBeTrue
        expect(value).toBeUndefined
    })
    test("No empties", () => {
        const fullPuzzle = range(1, 9).map(x => range(1, 9).map(y => 1))
        const {done, value} = emptySquares(fullPuzzle).next()
        expect(done).toBeTrue
        expect(value).toBeUndefined
    })
})