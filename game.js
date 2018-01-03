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



$(document).ready(initializeApp);

function initializeApp(){
  //add click events
  //function for clickedColumn = newGame.columnClicked.bind(newGame)

  beginGame();
  newGame.columnClicked();
  newGame.columnClicked();
  newGame.columnClicked();
  newGame.columnClicked();
  newGame.columnClicked();
  newGame.columnClicked();
  console.log(newGame.board);
  console.log(newGame.playerOne)
  console.log(newGame.playerTwo)

}

var newGame;

function beginGame(){
  //create new game
  newGame = new GameBoard();
  //fill board
  newGame.fillBoard(6,7);
  //get playerNames
  newGame.getPlayerNames();
  newGame.createGameBoard(6,7);
}

function GameBoard(){
  this.gameOver = false;
  this.pickedColumn = false;
  this.board = [];
  this.playerOne = {
    name: "",
    picks: []
  };
  this.playerTwo =  {
    name: "",
    picks: []
  };
  this.currentPlayer;
  this.createGameBoard = function(width, height){
    for(var row = 0 ; row < height ; row++ ){
      for(var col = 0 ; col < width; col++){
        var square = $('<div>').addClass("square col" +col + " row" + row).attr("draggable", false);
        $(".game_board").append(square);
      }
    }
  }
}

GameBoard.prototype.checkIfWinner = function(array){
  //sort array so smallest col begins
  array = array.sort();
  console.log(array);
  //keep track of how many matched in a row
  var horizontalMatchCount = 0;
  var verticalMatchCount=0;
  var previousValue = array[0];
  for(var chipIndex = 1 ; chipIndex < array.length; chipIndex++){
    //vertical match
    if(previousValue[1] === array[chipIndex][1]){
      verticalMatchCount++
      if(verticalMatchCount === 4){
        console.log('winner')
      }
    } else {
      verticalMatchCount = 0;
    }

    //horizontalMatchCount
    if(previousValue[0] === array[chipIndex][0]){
      horizontalMatchCount++
      if(horizontalMatchCount === 4){
        console.log('winner')
      }
    } else {
      horizontalMatchCount = 0;
    }
  }

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
  for(var row = this.board.length-1 ; row >= 0 ; row--){
    if(!this.board[row][column].filled){
      this.board[row][column].filled = true;
      this.board[row][column].player = this.currentPlayer.name;
      this.pickedColumn = false; //allows the next player to now click a column
      var positionInMatrix = row + "," + column;
      //alternates players
      // if(this.currentPlayer === this.playerOne){
        this.currentPlayer.picks.push(positionInMatrix);
        this.checkIfWinner(this.currentPlayer.picks);
        // this.currentPlayer = this.playerTwo;
      // } else {
      //   this.currentPlayer.picks.push(positionInMatrix);
      //   this.checkIfWinner(this.currentPlayer.picks);
      //   this.currentPlayer = this.playerOne;
      // }
      return;
    }
  }
}
GameBoard.prototype.getPlayerNames = function(){
  this.playerOne.name = "bob";
  this.playerTwo.name = "al";
  this.currentPlayer = this.playerOne;
}

function Chip(filled, player){
  this.filled = filled,
  this.player = player
}
