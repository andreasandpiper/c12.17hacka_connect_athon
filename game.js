$(document).ready(initializeApp);

function initializeApp() {

    loadTitle();
    $('#reset-button').on('click', repeatGame);
    $('.close-modal').on('click', function () {
        $('#reset-button').css('visibility', 'visible');
        $('.fade').hide();
    });

    // Sets Player Colors
    $(".player1_select img").on('click', function () {
        $howToPlay = $('.player1_select .rules span');
        $howToPlay.removeClass('neonText-' + newGame.playerOne.playerColor);
        newGame.playerOne.playerColor = $(this).attr('class');
        $howToPlay.addClass('neonText-' + newGame.playerOne.playerColor);
    });
    $(".player2_select img").on('click', function () {
        $howToPlay = $('.player2_select .rules span');
        $howToPlay.removeClass('neonText-' + newGame.playerTwo.playerColor);
        newGame.playerTwo.playerColor = $(this).attr('class');
        $howToPlay.addClass('neonText-' + newGame.playerTwo.playerColor);
    });

    // Sets Player Names & Advances to Next Screen
    $('.player1_select .proceed_button').on('click', function () {
        newGame.playerOne.name = $('#player1_name').val().toUpperCase();
        console.log(newGame.playerOne.name);
        if (!(newGame.playerOne.playerColor === "") && !(newGame.playerOne.name === "")) {
            $('.greeting_screen p:nth-child(4)').addClass('anim-typewriter').css('visibility', 'visible');
            $('.player1_select').addClass('animated fadeOut');
            setTimeout(function () {
                $('.player1_select').hide();
                $('.player2_select').addClass('animated fadeIn').show();
                setTimeout(function () {
                    $('.player2_select').removeClass('animated fadeIn');
                }, 1000)
            }, 1000);
        }
    });
    $('.player2_select .proceed_button').on('click', function () {
        newGame.playerTwo.name = $('#player2_name').val().toUpperCase();
        if (!(newGame.playerTwo.playerColor === "") && !(newGame.playerTwo.name === "") && !(newGame.playerTwo.playerColor === newGame.playerOne.playerColor)) {
            $('.player2_select').addClass('animated fadeOut');
            setTimeout(function () {
                $('.title_page').hide();
                $('#page_content').addClass('animated fadeIn').show();
                beginGame();
                setTimeout(function () {
                    $('#page_content').removeClass('animated fadeIn');
                }, 1000)
            }, 1000);
        }
    });
}


var newGame;

/************************************************
 ***************** Title Screen *****************
 ***********************************************/

function loadTitle() {
    newGame = new GameBoard();
    $(".game_board").on("click", ".square", newGame.columnClicked.bind(newGame));
    newGame.fillBoard(7, 6);
    $('.player1_select').hide();
    $('.player2_select').hide();
    $('#page_content').hide();
    $('.greeting_screen p:nth-child(1)').addClass('anim-typewriter').css('visibility', 'visible');
    setTimeout(function () {
        $('.greeting_screen p:nth-child(2)').addClass('anim-typewriter').css('visibility', 'visible');
        setTimeout(function () {
            $('.greeting_screen p:nth-child(3)').addClass('anim-typewriter').css('visibility', 'visible');
            setTimeout(function () {
                $('.player1_select').addClass('animated fadeIn').show();
            }, 4000);
        }, 4000);
    }, 4000);
}

function beginGame() {
    $(".game_board").empty();
    $(".game_grid").empty();
    //create new game
    newGame.createGameBoard(7, 6);
    diskDropInit();
    newGame.currentPlayer = newGame.playerOne;
    $('#player1').text(newGame.playerOne.name).addClass('neonText-' + newGame.playerOne.playerColor);
    $('#player2').text(newGame.playerTwo.name);
}

function repeatGame() {
    $('.fade').hide();
    var play1name = newGame.playerOne.name;
    var play1color = newGame.playerOne.playerColor;
    var play2name = newGame.playerTwo.name;
    var play2color = newGame.playerTwo.playerColor;

    $(".game_board").empty();
    $(".game_grid").empty();

    newGame = new GameBoard();
    $(".game_board").on("click", ".square", newGame.columnClicked.bind(newGame));
    newGame.fillBoard(7, 6);
    newGame.createGameBoard(7, 6);
    newGame.playerOne.name = play1name;
    newGame.playerOne.playerColor = play1color;
    newGame.playerTwo.name = play2name;
    newGame.playerTwo.playerColor = play2color;

    newGame.currentPlayer = newGame.playerOne;
    $('#player1').text(newGame.playerOne.name).addClass('neonText-' + newGame.playerOne.playerColor);
    $('#player2').text(newGame.playerTwo.name);
    $('#reset-button').css('visibility', 'hidden');
}

function GameBoard() {
    this.id = Math.random();
    this.gameOver = false;
    this.pickedColumn = false;
    this.board = [];
    this.playerOne = {
        name: "",
        verticalPicks: [],
        horizontalPicks: [],
        playerColor: ''
    };
    this.playerTwo = {
        name: "",
        verticalPicks: [],
        horizontalPicks: [],
        playerColor: ''
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
    //get which column was clicked from the class
    var targetColumn = $(event.target).attr("class").split(" ")[1];
    var column = targetColumn[targetColumn.length - 1];
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
            var vertPosition = column + row;
            var horizPosition = row + column;
            this.showChip(column, row);
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

GameBoard.prototype.CheckIfWinner = function (vertPosition, horizPosition) {
    this.currentPlayer.verticalPicks.push(vertPosition);
    this.currentPlayer.horizontalPicks.push(horizPosition);
    this.checkIfXYWinner(this.currentPlayer.horizontalPicks);
    this.checkIfXYWinner(this.currentPlayer.verticalPicks);
    this.checkIfDiagonalWinner(this.currentPlayer.horizontalPicks.sort(), "+");//decreasing matches
    this.checkIfDiagonalWinner(this.currentPlayer.horizontalPicks.sort().reverse(), "-");//increasing matches
    var entireGameBoardFilled = this.board[0].every(this.gameBoardFilled);
    if (entireGameBoardFilled) {
        console.log('cats game');
        this.gameOver = true;
    }
};

GameBoard.prototype.gameBoardFilled = function (chip) {
    return chip.filled === true;
};

GameBoard.prototype.checkIfXYWinner = function (array) {
    array = array.sort();
    var matchCounter = 1;
    var previousValue = array[0];
    for (var chipIndex = 1; chipIndex < array.length; chipIndex++) {
        var currentValue = array[chipIndex];
        if (previousValue[0] === array[chipIndex][0] && (parseInt(previousValue[1]) + 1) == parseInt(currentValue[1])) {
            matchCounter++;
            if (matchCounter === 4) {
                $(".game_board").off("click", ".square", newGame.columnClicked.bind(newGame));
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

GameBoard.prototype.incrementOrDecrement = function (currentValue, upOrDown) {
    var types = {
        '+': function () {
            currentValue += 1;
        },
        '-': function () {
            currentValue -= 1;
        }
    };
    types[upOrDown]();
    return currentValue;
};

GameBoard.prototype.checkIfDiagonalWinner = function (array, upOrDown) {
    var diagonalMatchCounter = 1;
    for (var chipIndex = 0; chipIndex < array.length; chipIndex++) {
        var currentChipRow = parseInt(array[chipIndex][0]);
        var currentChipCol = parseInt(array[chipIndex][1]);
        for (var compareChip = chipIndex; compareChip < array.length; compareChip++) {
            var lookForChip = (this.incrementOrDecrement(currentChipRow, upOrDown)).toString() + (currentChipCol + 1).toString();
            if (array.indexOf(lookForChip) !== -1) {
                diagonalMatchCounter++;
                currentChipRow = this.incrementOrDecrement(currentChipRow, upOrDown);
                currentChipCol++;
                if (diagonalMatchCounter === 4) {
                    victoryModal();
                    this.gameOver = true;
                    $(".game_board").off("click", ".square", newGame.columnClicked.bind(newGame));
                }
            } else {
                diagonalMatchCounter = 1;
                break;
            }
        }
    }
};


GameBoard.prototype.showChip = function (column, row) {
    $gameSquare = $('.square.col' + column + '.row' + row);
    $gameSquare.addClass(newGame.currentPlayer.playerColor);
    $gameSquare.addClass("fallToRow" + row);
    this.changeColor();
};

GameBoard.prototype.changeColor = function () {
    if (this.currentPlayer === this.playerOne) {
        $('#player1').addClass('neonText-' + this.playerOne.playerColor);
        $('#player2').removeClass('neonText-' + this.playerTwo.playerColor);
        $(".preDropDisk").switchClass(this.playerTwo.playerColor, this.playerOne.playerColor);
    } else {
        $('#player2').addClass('neonText-' + this.playerTwo.playerColor);
        $('#player1').removeClass('neonText-' + this.playerOne.playerColor);
        $(".preDropDisk").switchClass(this.playerOne.playerColor, this.playerTwo.playerColor);
    }
};

function Chip(filled, player) {
    this.filled = filled;
    this.player = player;
}

/************************************************
 ********* Disc Cursor Above Game Board *********
 ***********************************************/

function diskDropInit() {
    var $disk = $(".preDropDisk");
    $(document).on('mousemove', function (e) {
        $disk.css({
            left: e.pageX - ($('#pre_drop_disk_box')[0].getBoundingClientRect().left - $('body')[0].getBoundingClientRect().left + 60),
            top: 10
        });
    });
    $disk.addClass(newGame.playerOne.playerColor);
}

/******************************************************
 ************** Modal manipulation ********************
 *****************************************************/

function victoryModal() {
    $(".fade").show();
    $(".modal-dialog").css({
        "top": "25vh"
    });
    $(".modal-content").css({
        "width": "35vw",
        "height": "45vh"
    });
    $(".modal-content h1").text(newGame.currentPlayer.name + " WINS!")
        .addClass('neonText-' + newGame.currentPlayer.playerColor).css({
        "font-size": "3em",
        "font-family": "'Audiowide', cursive",
        "font-weight": "bolder",
        "top": "20%",
        "left": "50%",
        "transform": "translate(-50%, -50%)"
    });
    $(".modal-content button").text("RESULTS");

}
