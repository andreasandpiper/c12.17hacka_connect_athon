$(document).ready(initializeApp);

function initializeApp() {
    loadTitle();

    $(".game_board").on("click", ".square", newGame.columnClicked.bind(newGame));

    $('.reset').on('click', beginGame);

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
    })
}


var newGame;

/************************************************
 ***************** Title Screen *****************
 ***********************************************/

function loadTitle() {
    newGame = new GameBoard();
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
    diskDropInit();
    newGame.createGameBoard(7, 6);
    newGame.currentPlayer = newGame.playerOne;
    $('#player1').text(newGame.playerOne.name).addClass('neonText-' + newGame.playerOne.playerColor);
    $('#player2').text(newGame.playerTwo.name);
}

function GameBoard() {
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
                    //victoryModal();
                    this.gameOver = true;
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
    $gameSquare.addClass('.'+newGame.currentPlayer.playerColor);
    $gameSquare.addClass("fallToRow" + row);
    this.changeColor();
};


GameBoard.prototype.changeColor = function () {
    if (this.currentPlayer === this.playerOne) {
        $('#player1').addClass('neonText-' + this.playerOne.playerColor);
        $('#player2').removeClass('neonText-' + this.playerTwo.playerColor);
        $(".preDropDisk").switchClass(this.playerTwo.playerColor, this.playerOne.playerColor, 500, 'swing');
    } else {
        $('#player2').addClass('neonText-' + this.playerTwo.playerColor);
        $('#player1').removeClass('neonText-' + this.playerOne.playerColor);
        $(".preDropDisk").switchClass(this.playerOne.playerColor, this.playerTwo.playerColor, 500, 'swing');
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
            left: e.pageX - 575,
            top: 0
        });
    });
    $disk.addClass('animated fadeIn');
    setTimeout(function () {
        $disk.removeClass('animated fadeIn');
    }, 1000);
    $disk.css({
        "background-image": "url('images/disks/" + newGame.currentPlayer.playerColor + "Disk.png')",
        "background-size": "cover"
    });
}

/******************************************************
 ************** Modal manipulation ********************
 *****************************************************/

function alignModal() {
    var modalDialog = $(this).find(".modal-dialog");
    /* Applying the top margin on modal dialog to align it vertically center */
    modalDialog.css("margin-top", Math.max(0, ($(window).height() - modalDialog.height()) / 2));
}

function victoryModal() {
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
    $(".modal-footer button").text("New Game").css({});
    $("#myModal").modal({
        show: "toggle",
        backdrop: "static",
        keyboard: "false"
    });
}

function introModal() {
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
    $(".modal-footer button").text("Play Game").css({});
    $("#myModal").modal({
        show: "toggle",
        backdrop: "static",
        keyboard: "false"
    });
}