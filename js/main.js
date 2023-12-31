// game displays rows and columns of squares (3x3)
// player is notified whose turn it is
// player clicks on a square to make a move
// if the clicked square is already picked, tell the user
// the player's move is displayed on the board
// check for winner - annouce it if there is a winner
// if no winner, player 2 takes their turn using the same process
// if no open spots left on board, annouce it's a tie
// allow the players to reset board and play again

//==================================================================
// constants
//==================================================================
// the main constant is the markers which will hold for two players + initialized state:
// X, O, and not selected
const markers = {
    0: '',
    1: 'X',
    '-1': 'O'
};
const colors = {
    0: 'white',
    1: 'navy',
    '-1': 'orange'
}

//==================================================================
// state variables
//==================================================================
let board;  // this will be a 3x3 nested array
let turn;   // 1 || -1, depending on whose turn it is
let winner; // null || 1 || -1 || 'T' (tie), depending on who, if anyone, has won
let squareSelected; // true || false depending on if the square was already picked
let mode; // marker || color

//==================================================================
// cached DOM elements
//==================================================================
const messageEl = document.querySelector('h2');
const resetButton = document.querySelector('button');

// save squares as an array rather than a NodeList
const squaresEl = [...document.querySelectorAll('#squares > div')];

//==================================================================
// functions 
//==================================================================
// first we need to initialize the game
function init() {
    // reset the state variables
    // setup a blank board
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    // set the first turn and winner
    turn = 1;
    winner = null;
    squareSelected = false;
    mode = document.querySelector('input[name="mode"]:checked').value;
    if (!mode) mode = 'marker';

    // render the board, message, and controls
    render();
}

// call init to kick off the game
init();

// render the board, message, and controls
function render() {
    // render the board
    renderBoard();
    // render the message
    renderMessage();
    // render the controls
    renderControls();
}

// renderBoard will update the board to show X's and O's already selected
function renderBoard() {
    // loop through the board array, row by row
    board.forEach((rowArr, rowIdx) => {
        // for each row, loop through the columns
        rowArr.forEach((cellVal, colIdx) => {
            // find the element for that square
            const cellId = `r${rowIdx}c${colIdx}`;
            const squareEl = document.getElementById(cellId);
            // if color mode, change the background color to indicate marked and clear out any marker in the square
            if (mode === 'color') {
                squareEl.style.backgroundColor = colors[cellVal];
                squareEl.innerText = '';
            } else {
                // otherwise, set the X/O marker and reset the color to neutral (not picked)
                squareEl.innerText = markers[cellVal];
                squareEl.style.backgroundColor = colors[0];
            }
        });
    });
}

// renderMessage updates the message on the screen to indicate winner, tie, or whose turn
function renderMessage() {
    // if tie, tell them nice try
    if (winner === 'T') {
        messageEl.innerText = "CAT! It's a Tie!";
    } else if (winner) {
        // if winner, annouce winner
        if (mode === 'color') {
            messageEl.innerHTML = `
                <span style="color: ${colors[winner]}">
                    ${colors[winner].toUpperCase()}
                </span> Wins!!
            `;
        } else {
            messageEl.innerText = `${markers[winner].toUpperCase()} Wins!!`;
        }
    } else {
        // otherwise tell the player who's turn it is
        // if square is already selected, tell them to pick another one
        if (mode === 'color') {
            messageEl.innerHTML = `
                ${squareSelected ? 'That square is already taken! ' : ''}
                <span style="color: ${colors[turn]}">${colors[turn].toUpperCase()}</span>'s Turn
            `;
        } else {
            messageEl.innerText = `${squareSelected ? 'That square is already taken! ' : ''}${markers[turn].toUpperCase()}'s Turn`;
        }
        // reset squareSelected
        squareSelected = false;
    }
}

// renderControls determines if the reset button is displayed or not
function renderControls() {
    // if there's not a winner, hide the button; otherwise show it
    resetButton.style.visibility = winner ? 'visible' : 'hidden';
}

// handlePick will be the game play function
function handlePick(event) {
    // first figure out what row and column were selected
    // index of the squares will be 0 - 8, so we need to calculate the actual row and col using DIV and MOD functions 
    // to allow us to manipulate board array appropriately
    const squareIdx = squaresEl.indexOf(event.target)
    const rowIdx = Math.floor(squareIdx / 3);
    const colIdx = squareIdx % 3;

    // get the row array for the board
    const rowArr = board[rowIdx];

    // check if the move is invalid
    // a move is invalid in three ways:
    //   1. they didn't selected a valid square - so just return
    if (rowIdx === -1 || colIdx === -1) return;
    //   2. there's already a winner
    if (winner) return;
    //   3. they picked a square that's already selected - update squareSelected but don't return because we want board to be updated
    if (Math.abs(rowArr[colIdx]) === 1) {
        squareSelected = true;
    } else {
        // if the move is valid, update the board array accordingly
        rowArr[colIdx] = turn;
    
        // change whose turn it is
        turn *= -1;
    
        // check for winner
        winner = getWinner(rowIdx, colIdx);
    }    

    // update board, message, and controls
    render();
}

function getWinner(rowIdx, colIdx) {
    // check for horizontal win
    // check for vertical win
    // check for diagonal win
    // check for tie
    return checkHorizontalWin(rowIdx, colIdx)
        || checkVerticalWin(rowIdx, colIdx)
        || checkDiagonalNWtoSEWin(rowIdx, colIdx)
        || checkDiagonalNEtoSWWin(rowIdx, colIdx)
        || checkTie();
}

function checkTie() {
    // if there is at least one open spot on the board, there is no tie
    for (let rowArr of board) {
        for (let cell of rowArr) {
            if (cell === 0) return null;
        }
    }
    // no open spots if we made it out of double loops, so it's a tie
    return 'T';
}

function checkHorizontalWin(rowIdx, colIdx) {
    // count the number of adjacent squares to the left and to the right of the last picked square
    const countLeft = countAdjacentSquares(rowIdx, colIdx, 0, -1);
    const countRight = countAdjacentSquares(rowIdx, colIdx, 0, 1);
    // if there are two adjacent squares, then return the player at that cell because they won
    // otherwise, there is no horizontal win
    return countLeft + countRight === 2 ? board[rowIdx][colIdx] : null;
}

function checkVerticalWin(rowIdx, colIdx) {
    // count the number of adjacent squares up and down from the last picked square
    const countUp = countAdjacentSquares(rowIdx, colIdx, -1, 0);
    const countDown = countAdjacentSquares(rowIdx, colIdx, 1, 0);
    // if there are two adjacent squares, then return the player at that cell because they won
    // otherwise, there is no horizontal win
    return countUp + countDown === 2 ? board[rowIdx][colIdx] : null;
}

function checkDiagonalNWtoSEWin(rowIdx, colIdx) {
    // count the number of adjacent squares NW and SE from the last picked square
    const countNW = countAdjacentSquares(rowIdx, colIdx, -1, -1);
    const countSE = countAdjacentSquares(rowIdx, colIdx, 1, 1);
    // if there are two adjacent squares, then return the player at that cell because they won
    // otherwise, there is no horizontal win
    return countNW + countSE === 2 ? board[rowIdx][colIdx] : null;
}

function checkDiagonalNEtoSWWin(rowIdx, colIdx) {
    // count the number of adjacent squares NE and SW from the last picked square
    const countNE = countAdjacentSquares(rowIdx, colIdx, -1, 1);
    const countSW = countAdjacentSquares(rowIdx, colIdx, 1, -1);
    // if there are two adjacent squares, then return the player at that cell because they won
    // otherwise, there is no horizontal win
    return countNE + countSW === 2 ? board[rowIdx][colIdx] : null;
}

function countAdjacentSquares(rowIdx, colIdx, rowOffset, colOffset) {
    // get the most recently played player
    const player = board[rowIdx][colIdx];

    // set initial count of adjacent squares for same player
    let countAdj = 0;

    // move to the adjacent space utilizing the given offsets
    rowIdx += rowOffset;
    colIdx += colOffset;

    // check the spaces around the last played square -
    // make sure row exists
    // make sure cell exists,
    // and make sure same player
    while (
            board[rowIdx] !== undefined &&
            board[rowIdx][colIdx] !== undefined &&
            board[rowIdx][colIdx] === player 
    ) {
        // increment the count of adjacent squares for the same player
        countAdj++;
        //move to the next adjacent square
        rowIdx += rowOffset;
        colIdx += colOffset;
    }
    // return that count 
    return countAdj;
}

function handleGameMode(event) {
    // change the mode to either marker or color based on which radio button is clicked
    mode = event.target.value;
}

//==================================================================
// event listeners
//==================================================================
// add an event listener to the squares that triggers when one is picked
document.getElementById('squares').addEventListener('click', handlePick);

// add an event listener to the reset game button that will trigger initialize
resetButton.addEventListener('click', init);

// add an event listener to the game mode radio buttons
document.getElementById('marker').addEventListener('click', handleGameMode);
document.getElementById('color').addEventListener('click', handleGameMode);

