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
    1: 'blue',
    '-1': 'orange'
}

//==================================================================
// state variables
//==================================================================
let board;  // this will be a 3x3 nested array
let turn;   // 1 || -1, depending on whose turn it is
let winner; // null || 1 || -1 || 'T' (tie), depending on who, if anyone, has won

//==================================================================
// cached DOM elements
//==================================================================
const messageEl = document.querySelector('h2');
const resetButton = document.querySelector('button');

// save squares as an array rather than a NodeList
const squaresEl = [...document.querySelectorAll('#squares > div')];

console.log('messageEl at cached', messageEl);
console.log('resetButton at cached', resetButton);
console.log('squaresEl at cached', squaresEl);

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

    console.log('board in init', board);
    console.log('turn in init', turn);
    console.log('winner in init', winner);

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
            console.log('cellId in renderBoard', cellId);
            const squareEl = document.getElementById(cellId);
            console.log('squareEl in renderBoard', squareEl);
            // to start with, just changing the background color to indicate marked
            squareEl.style.backgroundColor = colors[cellVal];
            // set the text of the square to the appropriate marker
            // squareEl.innerHTML = `<h3>${markers[cellVal]}</h3>`;
            // console.log('cellVal in renderBoard', cellVal);
            // console.log('markers[cellVal] in renderBoard', markers[cellVal]);
        });
    });
}

// renderControls determines if the reset button is displayed or not
function renderControls() {
    // if there's not a winner, hide the button; otherwise show it
    console.log('winner in renderControls', winner);
    resetButton.style.visibility = winner ? 'visible' : 'hidden';
}

//==================================================================
// event listeners
//==================================================================

