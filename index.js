
// Immediately invoked function expression (IIFE) - invokes a single instance of a gameboard object with functionality to get positions on the board, and to reset and update the board.
const gameboard = (function() {

  const boardArray = []

  const getPosition = (position) => boardArray[position]

  const reset = () => {
    for (let i = 0; i < 9; i++) {
      boardArray[i] = ""
    }
  }

  const updatePosition = ( position, updateTo ) => { boardArray[position] = updateTo }

  const getFullBoard = () => boardArray

  return { reset, getPosition, updatePosition, getFullBoard }

})()


// Immediately invoked function expression (IIFE) - invokes a single instance of a displayController object which will manage all aspects of the UI functionality, including the board
const displayController = (function() {

  const drawBoard = () => {
    let boardArray = gameboard.getFullBoard()
    let boardDisplay = document.querySelector("#gameboard")
    boardDisplay.innerHTML = '';
    boardArray.forEach( (element, index) => {
      let gameCell = document.createElement("div")
      gameCell.setAttribute("class",`game-cell`);
      gameCell.setAttribute("id",`game-cell-${index}`);
      gameCell.addEventListener("click",() => processPlayerSelection(index));
      boardDisplay.appendChild(gameCell)
    })
  }

  const highlightCurrentPlayer = (player) => {
    let player1Display = document.querySelector("#player-1-name")
    let player2Display = document.querySelector("#player-2-name")
    if (player === "Player 1") {
      player1Display.setAttribute("class","highlighted-player-name")
      player2Display.setAttribute("class","not-highlighted-player-name")
    } else if (player === "Player 2") {
      player1Display.setAttribute("class","not-highlighted-player-name")
      player2Display.setAttribute("class","highlighted-player-name")

    }
  }

  // const drawPlayerMarks = () => {
  //   let player1Mark = document.querySelector("#player-1-mark")
  //   let player2Mark = document.querySelector("#player-2-mark")
  // }

  const resetDisplay = () => {
    let boardArray = gameboard.getFullBoard()
    boardArray.forEach( (element, index) => {
      let gameCell = document.querySelector(`#game-cell-${index}`);
      gameCell.textContent = "";
    })
  }

  const updatePositionDisplay = ( position, updateTo ) => {
    let gameCell = document.querySelector(`#game-cell-${position}`)
    gameCell.textContent = updateTo
  }

  const updateMessageBoard = (text) => {
    let messageBoard = document.querySelector("#message-board");
    messageBoard.textContent = text;
  }

  return { drawBoard, resetDisplay, updatePositionDisplay, updateMessageBoard, highlightCurrentPlayer }

})()


// Factory function to create "player" objects
const createPerson = function (name) {

  // the player functionality is not currently used other than to create a player.
  let nickname = ""
  let totalWins = 0
  
  const addNickname = (newName) => { nickname = newName }
  const getNickname = () => nickname

  const getWins = () => totalWins
  const addWin = () => totalWins++
  
  return { name, getNickname, getWins, addWin }

}


const createGame = function(player1, player2) {
  
  let xPlayer
  let oPlayer
  let activePlayer
  let activeMark // X or O
  let gameWinner = "None"
  let gameActive = false

  // internal function
  function checkMatch(value, pos1, pos2, pos3) {
    if (gameboard.getPosition(pos1) === value && gameboard.getPosition(pos2) === value && gameboard.getPosition(pos3) === value) {
      return true
    } else {
      return false
    }
  }

  const initialiseGame = () => {
    if (Math.random()<=0.5) {
      xPlayer = player1;
      oPlayer = player2;
    } else {
      xPlayer = player2;
      oPlayer = player1;
    }
    activePlayer = xPlayer;
    activeMark = "X";
    gameActive = true;
    gameboard.reset()
    displayController.drawBoard()
    displayController.resetDisplay()
  }

  const playerSelectionValid = (chosenPosition) => gameboard.getPosition(chosenPosition) === "" ? true : false

  const addPlayerSelection = (boardPosition, activeMark) => {
    gameboard.updatePosition(boardPosition,activeMark)
    displayController.updatePositionDisplay(boardPosition,activeMark)
  } 

  const checkGameStatus = () => {
    if ( checkMatch("X",0,1,2) || checkMatch("X",3,4,5) || checkMatch("X",6,7,8) || checkMatch("X",0,3,6) ||
         checkMatch("X",1,4,7) || checkMatch("X",2,5,8) || checkMatch("X",0,4,8) || checkMatch("X",2,4,6)
    ) {
      return "xWin";
    } else if ( checkMatch("O",0,1,2) || checkMatch("O",3,4,5) || checkMatch("O",6,7,8) || checkMatch("O",0,3,6) ||
                checkMatch("O",1,4,7) || checkMatch("O",2,5,8) || checkMatch("O",0,4,8) || checkMatch("O",2,4,6)
    ) {
      return "oWin"
    } else if (!gameboard.getFullBoard().includes("")) {
      return "tie"
    } else {
      return "ongoing"
    }
  }

  const swapPlayer = () => {
    if (activeMark === "X") {
      activeMark = "O";
      activePlayer = oPlayer;
    } else {
      activeMark = "X";
      activePlayer = xPlayer;
    }
  }

  const endGame = (gameResult) => {
    switch (gameResult) {
      case "xWin":
        gameWinner = xPlayer;
        break;
      case "oWin":
        gameWinner = oPlayer;
        break;
      case "tie":
        gameWinner = "None";
        break;
    }
    gameActive = false;
  }

  const getXPlayer = () => xPlayer;
  const getOPlayer = () => oPlayer;
  const getActivePlayer = () => activePlayer;  
  const getActiveMark = () => activeMark;  
  const isActive = () => gameActive;
  const getGameWinner = () => gameWinner;
  
  return { player1, player2, initialiseGame, getXPlayer, getOPlayer, getActiveMark, getActivePlayer, playerSelectionValid, addPlayerSelection, checkGameStatus, swapPlayer, isActive, endGame, getGameWinner }

}





// add general UI event listeners

//let createPlayer1Button = document.querySelector("#create-player-1")
//createPlayer1Button.addEventListener("click", createPlayerOne)

//let createPlayer2Button = document.querySelector("#create-player-2")
//createPlayer2Button.addEventListener("click", createPlayerTwo)

let startGameButton = document.querySelector("#start-game")
startGameButton.addEventListener("click", startGame)


// game functions for event listeners - may relocate these into factory functions

let player1;
let player2;
let currentGame;

createPlayerOne()
createPlayerTwo()

function createPlayerOne() {
  player1 = createPerson("Player 1")
}

function createPlayerTwo() {
  player2 = createPerson("Player 2")
}

function startGame() {

  // Create a game instance, allocate players to X and O (X always first), reset gameboard array, and draw game board.

  currentGame = createGame(player1, player2)
  currentGame.initialiseGame()
  let updateText = `Ready to play! ${currentGame.getXPlayer().name} will play X. ${currentGame.getOPlayer().name} will play O. ${currentGame.getActivePlayer().name} will start.`
  displayController.highlightCurrentPlayer(currentGame.getActivePlayer().name)
  displayController.updateMessageBoard(updateText)
  
}

function processPlayerSelection(chosenPosition) {

  if (currentGame.isActive()) {

    if (currentGame.playerSelectionValid(chosenPosition)) {

      currentGame.addPlayerSelection(chosenPosition,currentGame.getActiveMark())

      let gameState = currentGame.checkGameStatus()

      if (gameState === "ongoing") {

        currentGame.swapPlayer()
        displayController.highlightCurrentPlayer(currentGame.getActivePlayer().name)
        displayController.updateMessageBoard(`${currentGame.getActivePlayer().name}'s turn.`)

      } else {

        currentGame.endGame(gameState)  

        if (currentGame.checkGameStatus() === "xWin" || currentGame.checkGameStatus() === "oWin") {
          displayController.updateMessageBoard(`${currentGame.getGameWinner().name} has won!`)  
        } else if (currentGame.checkGameStatus() === "tie") {
          displayController.updateMessageBoard(`The game has ended in a tie!`)  
        }

      }

    } else {

      displayController.updateMessageBoard(`This position has already been chosen, please try again.`)

    }

  } else {

    displayController.updateMessageBoard(`This game is over, start a new game!`)

  }

}

