
/* Explanation for future reference, as this is the first time I have used factory functions and IIFEs:
  The gameboard is immediately invoked.
  The displayController is called at the end:
    Immediately invokes the drawBoard
    Calls newGame

  User then either:
  - calls gameRound by clicking the board, or
  - calls newGame by clicking the new game button

  Nothing else!

*/

const gameboard = (function() {

  const boardArray = ["","","","","","","","",""]

  const getPosition = (position) => boardArray[position]

  const setup = () => {
    for (let i = 0; i < 9; i++) {
      boardArray[i] = ""
    }
  }

  const updatePosition = ( position, updateTo ) => { boardArray[position] = updateTo }

  const getFullBoard = () => boardArray

  return { setup, getPosition, updatePosition, getFullBoard }

})()


const gameController = function(playerX, playerO) {
  
  let activePlayer = playerX;
  let activeMark = "X"
  let gameWinner = "None"
  let gameActive = true

  const swapPlayer = () => {
    if (activeMark === "X") {
      activeMark = "O";
      activePlayer = playerO;
    } else {
      activeMark = "X";
      activePlayer = playerX;
    }
  }

  function checkMatch(value, pos1, pos2, pos3) {
    if (gameboard.getPosition(pos1) === value && gameboard.getPosition(pos2) === value && gameboard.getPosition(pos3) === value) {
      return true
    } else {
      return false
    }
  }

  const playerSelectionValid = (chosenPosition) => gameboard.getPosition(chosenPosition) === "" ? true : false

  const addPlayerSelection = (boardPosition, activeMark) => {
    gameboard.updatePosition(boardPosition,activeMark)
  } 

  // Could simplify
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

  const endGame = (gameResult) => {
    switch (gameResult) {
      case "xWin":
        gameWinner = playerX;
        break;
      case "oWin":
        gameWinner = playerO;
        break;
      case "tie":
        gameWinner = "None";
        break;
    }
    gameActive = false;
  }

  const getActivePlayer = () => activePlayer;  
  const getActiveMark = () => activeMark;  
  const isActive = () => gameActive;
  const getGameWinner = () => gameWinner;
  
  return { playerX, playerO, getActiveMark, getActivePlayer, playerSelectionValid, addPlayerSelection, checkGameStatus, swapPlayer, isActive, endGame, getGameWinner }

}


const displayController = function() {

  // sets up and controls actions initiated on the app's user interface

  let currentGame
  let screenMessageText = ""

  let newGameButton = document.querySelector("#start-game")
  let boardDisplay = document.querySelector("#gameboard")
  let playerXDisplay = document.querySelector("#player-1-name")
  let playerODisplay = document.querySelector("#player-2-name")

  // Draw the board, - IIFE
  const drawBoardDisplay = (() => {
    let boardArray = gameboard.getFullBoard()
    
    boardArray.forEach( (element, index) => {
      let gameCell = document.createElement("div")
      gameCell.setAttribute("class",`game-cell`);
      gameCell.setAttribute("id",`game-cell-${index}`);
      gameCell.addEventListener("click",() => playRound(index));
      boardDisplay.appendChild(gameCell)
    })
  })()


  // UI start game button - start a new game, clear the gameboard, and update the display
  function newGame() {
    currentGame = gameController("Player X", "Player O")
    gameboard.setup()
    screenMessageText = `${currentGame.getActivePlayer()}'s turn.`
    updateScreen()
  }
  newGameButton.addEventListener("click", newGame)

  // update any visual elements of the web app
  const updateScreen = () => {
    updateBoardDisplay()
    highlightCurrentPlayer(currentGame.getActivePlayer())
    updateMessageBoard(screenMessageText)
  }

  const updateBoardDisplay = () => {
    let boardArray = gameboard.getFullBoard()
    boardArray.forEach( (element, index) => {
      let gameCell = document.querySelector(`#game-cell-${index}`)
      gameCell.textContent = element
    })
  }

  const highlightCurrentPlayer = (player) => {
    if (player === "Player X") {
      playerXDisplay.setAttribute("class","highlighted-name")
      playerODisplay.setAttribute("class","not-highlighted-name")
    } else if (player === "Player O") {
      playerXDisplay.setAttribute("class","not-highlighted-name")
      playerODisplay.setAttribute("class","highlighted-name")
    }
  }

  const updateMessageBoard = (text) => {
    let messageBoard = document.querySelector("#message-board");
    messageBoard.textContent = text;
  }

  // play a game round, initiated by the user, and update the screen at the end
  const playRound = (chosenPosition) => {

    if (currentGame.isActive()) {
      if (currentGame.playerSelectionValid(chosenPosition)) {
        currentGame.addPlayerSelection(chosenPosition,currentGame.getActiveMark())
        let gameState = currentGame.checkGameStatus()
        if (gameState === "ongoing") {
          currentGame.swapPlayer()
          screenMessageText = `${currentGame.getActivePlayer()}'s turn.`
        } else {
          currentGame.endGame(gameState)  
          if (currentGame.checkGameStatus() === "xWin" || currentGame.checkGameStatus() === "oWin") {
            screenMessageText = `${currentGame.getGameWinner()} has won!`
          } else if (currentGame.checkGameStatus() === "tie") {
            screenMessageText = `The game has ended in a tie!`
          }
        }
      }
    }
    updateScreen()
  }

  newGame()

}

displayController()
