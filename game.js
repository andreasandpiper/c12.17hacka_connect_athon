$(document).ready(initializeApp);

function initializeApp() {
    beginGame();
    // introModal();
    //add click events
    $('.reset').on('click', beginGame);
    //function for clickedColumn = newGame.columnClicked.bind(newGame)
    diskDropInit();
}

/************************************************
 ***************** Title Screen *****************
 ***********************************************/

$('.title_page').hide();
$('.player1_select').hide();
$('.player2_select').hide();
// $('#page_content').hide();

var newGame;

function beginGame() {
    $(".game_board").empty();
    $(".game_grid").empty();

    //create new game
    newGame = new GameBoard();
    $(".game_board").on("click", ".square", newGame.columnClicked.bind(newGame));
    newGame.fillBoard(7, 6);
    newGame.getPlayerNames();
    newGame.createGameBoard(7, 6);
}

function GameBoard() {
    this.tokenActivated = false;
    this.id = Math.random();
    this.gameOver = false;
    this.pickedColumn = false;
    this.board = [];
    this.playerOne = {
        name: "",
        verticalPicks: [],
        horizontalPicks: [],
        playerColor: 'purple',
        tokenCount: 1
    };
    this.playerTwo = {
        name: "",
        verticalPicks: [],
        horizontalPicks: [],
        playerColor: 'blue',
        tokenCount: 1

    };
    this.tetrisShapes = [
      ['+1 +0','+1 -1','+2 -1']
    ]
    this.currentPlayer = this.playerOne;
    this.createGameBoard = function (width, height) {
        for (var row = 0; row < height; row++) {
            for (var col = 0; col < width; col++) {
                var square = $('<div>').addClass("square col" + col + " row" + row).attr("draggable", false);
                $(".game_board").append(square);
                var gridSquare = $('<div>').addClass('game_grid_squares');
                $(".game_grid").append(gridSquare);
            }
        }
    }
}



GameBoard.prototype.checkIfTetrisMatch = function (array){
  if(!this.tetrisShapes.length){
    return;
  }
  array = array.sort();
  // var tetrisBlocks = tetrisShapes[0][0].split(" ");
  var match = false;
  for(var chip=0 ; chip<array.length ; chip++){
    var chipPosition = array[chip].split("");
    for(var tetrisChipPos=0 ; tetrisChipPos < this.tetrisShapes[0].length ; tetrisChipPos++){
      var block = this.tetrisShapes[0][tetrisChipPos].split(" ");
      var row = this.incrementOrDecrement(chipPosition[0], block[0][0], block[0][1]);
      var col = this.incrementOrDecrement(chipPosition[1], block[1][0], block[1][1]);
      var chipToFind = row.toString()+col;
      // console.log('array' , array, 'chiptofind: ' , chipToFind);
      if(array.indexOf(chipToFind) === -1){
        match = false;
        break;
      }
      match = true;
    }
    if(match){
      this.currentPlayer.tokenCount++;
      this.tetrisShapes.shift();
      return;
    }
  }
}

GameBoard.prototype.dropAllChipsFromColumn = function(col){
  $('.col' + col).removeAttr('style');
  for(var row=0 ; row < this.board.length; row++){
    if(this.board[row][col].filled){
        var lastClass = $('.col' + col + ".row" + row).attr("class").split(" ").pop();
        $('.col' + col + ".row" + row).removeClass(lastClass);
        var chipsToDropIndex = row+ col;
        if(this.playerOne.horizontalPicks.indexOf(chipsToDropIndex) !== -1){
            var locationOfCip = this.playerOne.horizontalPicks.indexOf(chipsToDropIndex);
            this.playerOne.horizontalPicks.splice(locationOfCip, 1)
        }
        if(this.playerTwo.horizontalPicks.indexOf(chipsToDropIndex) !== -1){
            var locationOfCip = this.playerTwo.horizontalPicks.indexOf(chipsToDropIndex);
            this.playerTwo.horizontalPicks.splice(locationOfCip, 1)
        }
        var chipsToDropIndex = col+row;
        if(this.playerOne.verticalPicks.indexOf(chipsToDropIndex) !== -1){
            var locationOfCip = this.playerOne.verticalPicks.indexOf(chipsToDropIndex);
            this.playerOne.verticalPicks.splice(locationOfCip, 1)
        }
        if(this.playerTwo.verticalPicks.indexOf(chipsToDropIndex) !== -1){
            var locationOfCip = this.playerTwo.verticalPicks.indexOf(chipsToDropIndex);
            this.playerTwo.verticalPicks.splice(locationOfCip, 1)
        }
        var newChip = new Chip(false, null);
        this.board[row][col] = newChip;
    }

  }
}

GameBoard.prototype.columnClicked = function (event) {
  //get which column was clicked from the class
  var targetColumn = $(event.target).attr("class").split(" ")[1];
  var column = targetColumn[targetColumn.length - 1];
  if(this.tokenActivated){
    this.dropAllChipsFromColumn(column);
    this.currentPlayer.tokenCount--;
    this.tokenActivated = false; //if add animation, change location of this
    return;
  }
    //check to make sure only one animation at a time
    //check if there are open spots in the column
    if (this.pickedColumn || this.gameOver || this.board[0][column].filled) {
        return
    }
    this.pickedColumn = true;
    //drop the chip
    this.chipDrop(column);
};

GameBoard.prototype.fillBoard = function (height, width) {
    for (var i = 0; i < width; i++) {
        var row = [];
        for (var j = 0; j < height; j++) {
            var newChip = new Chip(false, null);
            row.push(newChip);
        }
        this.board.push(row);
    }
};

GameBoard.prototype.chipDrop = function (column) {
    for (var row = this.board.length - 1; row >= 0; row--) {
        if (!this.board[row][column].filled) {
            this.board[row][column].filled = true;
            this.board[row][column].player = this.currentPlayer.name;
            var vertPosition = column+row;
            var horizPosition = row+column;
            this.showChip(column, row);
            this.currentPlayer.verticalPicks.push(vertPosition)
            this.currentPlayer.horizontalPicks.push(horizPosition)
            this.checkIfTetrisMatch(this.currentPlayer.verticalPicks);
            //alternates players
            if (this.currentPlayer === this.playerOne) {
                this.CheckIfWinner(vertPosition, horizPosition);
                this.currentPlayer = this.playerTwo;
            } else {
                this.CheckIfWinner(vertPosition, horizPosition);
                this.currentPlayer = this.playerOne;
            }
            this.changeColor();
            this.pickedColumn = false; //allows the next player to now click a column
            return;
        }
    }
};

GameBoard.prototype.CheckIfWinner = function(vertPosition, horizPosition){
  this.checkIfXYWinner(this.currentPlayer.horizontalPicks);
  this.checkIfXYWinner(this.currentPlayer.verticalPicks);
  this.checkIfDiagonalWinner(this.currentPlayer.horizontalPicks.sort(), "+");//decreasing matches
  this.checkIfDiagonalWinner(this.currentPlayer.horizontalPicks.sort().reverse(), "-");//increasing matches
  var entireGameBoardFilled = this.board[0].every(this.gameBoardFilled);
  if(entireGameBoardFilled){
    console.log('cats game');
    this.gameOver = true;
  }
}

GameBoard.prototype.gameBoardFilled = function(chip) {
  return chip.filled === true;
}

GameBoard.prototype.checkIfXYWinner = function (array) {
    array = array.sort();
    var matchCounter = 1;
    var previousValue = array[0];
    for (var chipIndex = 1; chipIndex < array.length; chipIndex++) {
        var currentValue = array[chipIndex];
        if (previousValue[0] === array[chipIndex][0] && (parseInt(previousValue[1]) + 1) == parseInt(currentValue[1]) ) {
            matchCounter++;
            if (matchCounter === 4) {
              $(".game_board").off("click", ".square", newGame.columnClicked.bind(newGame));
              this.gameOver = true;

                // victoryModal();
            }
        } else {
            matchCounter = 1;
        }
        previousValue = array[chipIndex];
      }
    previousValue = array[chipIndex];
};

GameBoard.prototype.incrementOrDecrement = function(currentValue, upOrDown, amount){
  currentValue = parseInt(currentValue);
  amount = parseInt(amount);
  var types = {
    '+': function(){
      currentValue += amount;
    },
    '-': function(){
      currentValue -= amount;
    }
  }
  var result = types[upOrDown]();
  return currentValue;
}

GameBoard.prototype.checkIfDiagonalWinner = function (array, upOrDown){
  var diagonalMatchCounter = 1;
  for(var chipIndex = 0 ; chipIndex < array.length ; chipIndex++){
    var currentChipRow = parseInt(array[chipIndex][0]);
    var currentChipCol = parseInt(array[chipIndex][1]);
    for(var compareChip = chipIndex ; compareChip< array.length ; compareChip++){
      var lookForChip = (this.incrementOrDecrement(currentChipRow, upOrDown, 1)).toString() + (currentChipCol+1).toString();
      if(array.indexOf(lookForChip) !== -1){
        diagonalMatchCounter++;
        currentChipRow = this.incrementOrDecrement(currentChipRow, upOrDown, 1);
        currentChipCol++;
        if(diagonalMatchCounter === 4){
          //victoryModal();
          this.gameOver = true;
          $(".game_board").off("click", ".square", newGame.columnClicked.bind(newGame));
        }
      } else {
        diagonalMatchCounter = 1;
        break;
      }
    }
  }
}

GameBoard.prototype.showChip = function (column, row) {
    $gameSquare = $('.square.col' + column + '.row' + row);
    $gameSquare.css({
        "background-image": "url('../c12.17hacka_connect_athon/images/disks/" + this.currentPlayer.playerColor + "Disk.png')",
        "background-size": "contain"
    });
    $gameSquare.addClass("fallToRow" + row);
    this.changeColor();
};

GameBoard.prototype.getPlayerNames = function () {
    this.playerOne.name = "BRUTUS";
    this.playerTwo.name = "CEASAR";
    this.currentPlayer = this.playerOne;
    $('#player1').text(this.playerOne.name).addClass('neonText-'+this.playerOne.playerColor);
    $('#player2').text(this.playerTwo.name);
};

GameBoard.prototype.changeColor = function(){
    if(this.currentPlayer === this.playerOne){
        $('#player1').addClass('neonText-'+this.playerOne.playerColor);
        $('#player2').removeClass('neonText-'+this.playerTwo.playerColor);
    } else {
        $('#player2').addClass('neonText-'+this.playerTwo.playerColor);
        $('#player1').removeClass('neonText-'+this.playerOne.playerColor);
    }
    var $disk = $(".preDropDisk");

    $disk.addClass('animated fadeOut');
    setTimeout(function () {
        $disk.removeClass('animated fadeOut');
        setTimeout(function () {
            $disk.css("background-image", "url('images/disks/"+ newGame.currentPlayer.playerColor + "Disk.png')");
            $disk.addClass('animated fadeIn');
            setTimeout(function(){
                $disk.removeClass('animated fadeIn');
            },1000);
        }, 1);
    }, 1000);
};

function Chip(filled, player) {
    this.filled = filled;
    this.player = player
}

/************************************************
 ********* Disc Cursor Above Game Board *********
 ***********************************************/

function diskDropInit() {
    var $disk = $(".preDropDisk");

    $(document).on('mousemove', function(e){
        $disk.css({
            left:  e.pageX -575,
            top:   0
        });
    });
     $disk.addClass('animated fadeIn');
     setTimeout(function(){
         $disk.removeClass('animated fadeIn');
     },1000);
     $disk.css({
        "background-image": "url('images/disks/"+ newGame.currentPlayer.playerColor + "Disk.png')",
        "background-size": "cover"
    });
}


/******************************************************
 ************** Modal manipulation ********************
 *****************************************************/

function alignModal(){
    var modalDialog = $(this).find(".modal-dialog");
    /* Applying the top margin on modal dialog to align it vertically center */
    modalDialog.css("margin-top", Math.max(0, ($(window).height() - modalDialog.height()) / 2));
}


function victoryModal(){
    $(".modal-dialog").css({
        "top": "25vh"
    });
    $(".modal-content").css({
        "width": "50vw",
        "height": "40vh",
        // "background-color": "deeppink"
    });
    $(".modal-title").text(newGame.currentPlayer.name + " wins!");
    $(".modal-body p").text("What a battle. You should play again!");
    $(".modal-footer button").text("New Game").css({

    });
    $("#myModal").modal({
        show: "toggle",
        backdrop: "static",
        keyboard: "false"
    });
}

function introModal(){
    alignModal();
    // $(".modal-dialog").css({
    //     "top": "25vh"
    // });
    $(".modal-content").css({
        "width": "30vw",
        "height": "30vh"
    });
    $(".modal-title").text("Tetron");
    $(".modal-body p").text("The rules go here");
    $(".modal-footer button").text("Play Game").css({

    });
    $("#myModal").modal({
        show: "toggle",
        backdrop: "static",
        keyboard: "false"
    });
}
