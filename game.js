//GAME LOGIC
//begin game by clicking button
//button creates instance of constructor GameBoard and stores as newGame,
//call fillBoard
//player one inputs name,
//by clicking submit, it calls the function to get name and store as variable
//repeat for player two
//game begins with current player as player one
//when a column is clicked
//set variable pickedColumn to true to allow all logic and animation to complete before other player can choose
//call chipDrop to fill in gameboard
  //if chip unable to occupy spot, gameOver
//call function to check if win;
//if win is true
//stop game (gameOver = true)
//else
// change currentPlayer (currentPlayer = !currentPlayer)



// $(document).ready(initializeApp);

function initializeApp(){
  //add click events
  //function for clickedColumn = newGame.columnClicked.bind(newGame)
}

var newGame;

function beginGame(){
  //create new game
  newGame = new GameBoard();
  //fill board
  newGame.fillBoard(6,7);
  //get playerNames
  newGame.getPlayerNames();
}

function GameBoard(){
  this.gameOver = false;
  this.pickedColumn = false;
  this.board = [];
  this.playerOne;
  this.playerTwo;
  this.currentPlayer;
  this.playerOnePicks = [];
  this.playerTwoPicks = [];
}


GameBoard.prototype.columnClicked = function(){
  //check to make sure only one animation at a time
  if(this.pickedColumn || this.gameOver){
    return
  }
  this.pickedColumn = true;
  //get which column was clicked from the class
  // var targetColumn = $(event.target).attr('class');
  var targetColumn = 2;
  //drop the chip
  this.chipDrop(targetColumn);
}

GameBoard.prototype.fillBoard = function(height, width){
  for(var i = 0 ; i < width ; i++){
    var row = [];
    for(var j=0 ; j < height ; j++){
      var newChip = new Chip(false, null);
      row.push(newChip);
    }
    this.board.push(row);
  }
}
GameBoard.prototype.chipDrop = function(column){
  for(var i = this.board.length-1 ; i >= 0 ; i--){
    if(!this.board[i][column].filled){
      this.board[i][column].filled = true;
      this.board[i][column].player = this.currentPlayer;
      this.pickedColumn = false; //when
      return;
    }
  }
}
GameBoard.prototype.getPlayerNames = function(){
  this.playerOne = "bob";
  this.playerOne = "al";
  this.currentPlayer = this.playerOne;
}

function Chip(filled, player){
  this.filled = filled,
  this.player = player
}

beginGame();
newGame.columnClicked();
console.log(newGame.board);
