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

function initializeApp() {
    beginGame();
    //add click events
    $(".game_board").on("click", ".square", newGame.columnClicked.bind(newGame));
    //function for clickedColumn = newGame.columnClicked.bind(newGame)
    diskDropInit();

}

var newGame;

function beginGame() {
    //create new game
    newGame = new GameBoard();
    //fill board
    newGame.fillBoard(7, 6);
    //get playerNames
    newGame.getPlayerNames();
    newGame.createGameBoard(7, 6);
}

function GameBoard() {
    this.gameOver = false;
    this.pickedColumn = false;
    this.board = [];
    this.playerOne = {
        name: "",
        verticalPicks: [],
        horizontalPicks: [],
        playerColor: 'purple'
    };
    this.playerTwo = {
        name: "",
        verticalPicks: [],
        horizontalPicks: [],
        playerColor: 'blue'

    };
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


GameBoard.prototype.columnClicked = function (event) {
    //check to make sure only one animation at a time
    if (this.pickedColumn || this.gameOver) {
        return
    }
    this.pickedColumn = true;
    //get which column was clicked from the class
    var targetColumn = $(event.target).attr("class").split(" ")[1];
    var column = targetColumn[targetColumn.length - 1];
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
            this.pickedColumn = false; //allows the next player to now click a column
            var vertPosition = [parseInt(column), row];
            var horizPosition = [row, parseInt(column)];
            this.showChip(column, row);
            //alternates players
            if (this.currentPlayer === this.playerOne) {
                this.currentPlayer.verticalPicks.push(vertPosition);
                this.currentPlayer.horizontalPicks.push(horizPosition);
                this.checkIfWinner(this.currentPlayer.horizontalPicks);
                this.checkIfWinner(this.currentPlayer.verticalPicks);
                this.checkIfDecreaseDiagonalWinner(this.currentPlayer.horizontalPicks);
                this.currentPlayer = this.playerTwo;
            } else {
                this.currentPlayer.verticalPicks.push(vertPosition);
                this.currentPlayer.horizontalPicks.push(horizPosition);
                this.checkIfWinner(this.currentPlayer.horizontalPicks);
                this.checkIfWinner(this.currentPlayer.verticalPicks);
                this.checkIfDecreaseDiagonalWinner(this.currentPlayer.horizontalPicks);

                this.currentPlayer = this.playerOne;
            }
            return;
        }
    }
};

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

GameBoard.prototype.checkIfWinner = function (array) {
    array = array.sort();
    var matchCounter = 1;
    var previousValue = array[0];
    for (var chipIndex = 1; chipIndex < array.length; chipIndex++) {
        var currentValue = array[chipIndex];
        if (previousValue[0] === array[chipIndex][0] && (parseInt(previousValue[1]) + 1) == parseInt(currentValue[1]) ) {
            matchCounter++;
            if (matchCounter === 4) {
                console.log('winner!')
                victoryModal();


                this.gameOver = true;
            }
        } else {
            matchCounter = 1;
        }

        previousValue = array[chipIndex];
      }
    previousValue = array[chipIndex];

};

GameBoard.prototype.checkIfDecreaseDiagonalWinner = function (array){
  array = array.sort();
  var diagonalMatchCounter = 0;

  //for each item in the array
  //store value of current item
  //while 
  //add 1 to row and column
  //see if it is in array

  //for each item in array
  //check if adding one to each index value if its in array, if yes add to counter
  // for(var firstChip = 0; firstChip< array.length ; firstChip++){
  //   var row = parseInt(array[firstChip].split(" ")[0]);
  //   for(var secondChip = firstChip; secondChip< array.length ; secondChip++){
  //     var col = parseInt(array[secondChip].split(" ")[1]);
  //     // console.log(array[row + 1][col + 1])
  //     if(array.indexOf([row + 1] + " " + [col + 1]) !== -1){
  //       diagonalMatchCounter++
  //       console.log(diagonalMatchCounter)
  //       if(diagonalMatchCounter ===4){
  //         console.log('winner')
  //         this.gameOver = true;
  //       }
  //       break;
  //     } else {
  //       diagonalMatchCounter = 0;
  //     }
  //   }
  //
  // }
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
    alignModal();
    $(".modal-dialog").css({
        "top": "25vh"
    });
    $(".modal-content").css({
        "width": "50vw",
        "height": "40vh",
        "background-color": "deeppink"
    });
    $(".modal-title").text(newGame.currentPlayer.name + " wins!");
    $(".modal-footer button").text("New Game").css({

    });
    $("#myModal").modal({
        show: "toggle",
        backdrop: "static",
        keyboard: "false"
    });
}
