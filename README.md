# A Javascript Sudoku solver

This repo contains a simple solver for Sudoku puzzles, written in Javascript.

To run the solver, run the following commands from a command line, where the current directory
is a clone of this repo:

* `npm ci` (only needs to be run once).
* `npm test`. This runs a number of tests, including one that finds a solution to the puzzle [which was 
claimed in 2012 to be the hardest Sudoku ever devised](https://abcnews.go.com/blogs/headlines/2012/06/can-you-solve-the-hardest-ever-sudoku).

Alternatively, the `solve` function can be invoked on any puzzle, which is represented by an
array of arrays of integers.
The input puzzle is not validated, but is assumed to fulfil the following criteria:

* it is a grid with nine rows, each of which contains nine columns.
* every square is either empty (represented by the value 0) or contains one
of the values 1 to 9 inclusive.
* no row, column or box contains duplicate values in its non-empty
squares.

The `solve` function returns a generator containing
all the possible solutions for the input grid; each solution is a grid where 
every square contains a non-zero value.
The test that solves the puzzle takes the first solution in the
returned generator; thus evaluation terminates as soon as a solution is found.

The program uses a straightforward algorithm which tries every possibility to solve the puzzle.
For any given grid:

* Find an empty square. If there is no empty square, the grid is solved.
* Determine which values can go into the empty square (because they do
not appear anywhere in the same row, column or box). 
* For each such value (if there are any), place the
value in the relevant square, and solve the revised grid recursively.

Note that the structure of the puzzle is not hard-coded throughout the program, but is
entirely driven by the assignment of two fields at the top of the `index.js` file:

* `permittedValues`, which is an array containing the values that can validly be
inserted into a square.
* `emptySquare`, which is the value that represents an empty square.

By default, these are set respectively to the values 1 to 9 inclusive and 0; but
different values could be specified to deal with differently-sized puzzles. 
The only (sensible) constraints on this 
are that `permittedValues` should not be empty, or contain duplicate values or the value of `emptySquare`.

The sizes of the boxes within the puzzle are calculated based on the convention that:

* Each box is as nearly square as possible: if the grid size (the number of values in `permittedValues`) is not a square number, the difference between the number of rows and the number of columns is as small as possible.
* A box that is not square has more columns than rows.

This implies that in each box, the number of columns is the smallest divisor of the grid size that is not less than its square root, and the number of rows is the grid size divided by the number of columns. It also implies that the grid size should ideally not be a prime number, because that would mean that each box is contiguous with a single row.
