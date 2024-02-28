
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


// Immediately invoked function expression (IIFE) - invokes a single instance of a gameboard display object with functionality to draw, reset and update the board
const gameboardDisplay = (function() {

  const drawBoard = () => {
    let boardArray = gameboard.getFullBoard()
    boardArray.forEach( (element, index) => {
      let boardDisplay = document.querySelector("#gameboard")
      let gameCell = document.createElement("div")
      gameCell.setAttribute("class",`game-cell`)
      gameCell.setAttribute("id",`game-cell-${index}`)
      boardDisplay.appendChild(gameCell)
    })
  }

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

  return { drawBoard, resetDisplay, updatePositionDisplay }

})()


// Factory function to create "person" objects, who will be eligible to play games
const createPerson = function (name) {

  // private variables, intentionally only accessible through factory function functions
  let nickname = "bum"
  let totalWins = 0

  const addNickname = (newName) => { nickname = newName }
  const getNickname = () => nickname

  const getWins = () => totalWins
  const addWin = () => totalWins++
  
  return { name, getNickname, addNickname, getWins, addWin }

}


const createGame = function(gameboard, gameboardDisplay, player1, player2) {
  
  let xPlayer
  let oPlayer
  let activePlayer
  let activeMark // X or O
  let gameWinner = "None"
  let gameActive = false // whether game is active or not

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
    gameboardDisplay.drawBoard()
    gameboardDisplay.resetDisplay()
  }

  const checkPlayerSelection = (chosenPosition) => gameboard.getPosition(chosenPosition) === "" ? true : false

  const addPlayerSelection = (boardPosition, activeMark) => {
    gameboard.updatePosition(boardPosition,activeMark)
    gameboardDisplay.updatePositionDisplay(boardPosition,activeMark)
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
      activePlayer = xPlayer;
    } else {
      activeMark = "X";
      activePlayer = oPlayer;
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
  const getGameActive = () => gameActive;
  const getGameWinner = () => gameWinner;
  
  return { player1, player2, initialiseGame, getXPlayer, getOPlayer, getActiveMark, getActivePlayer, checkPlayerSelection, addPlayerSelection, checkGameStatus, swapPlayer, getGameActive, endGame, getGameWinner }

}




// CONSOLE GAME TESTING

// stage 0 - CREATE PLAYERS - create players who are eligible to play

const glen = createPerson("Glen"); glen.addNickname("The Bulldozer")
console.log(`${glen.name}, otherwise known as ${glen.getNickname()}, is eligible to play, and has won ${glen.getWins()} games.`)

const joe = createPerson("Joe"); joe.addNickname("Old Hopeless")
console.log(`${joe.name}, otherwise known as ${joe.getNickname()}, is eligible to play, and has won ${joe.getWins()} games.`)


// stage 1 - GAME PREPARATION - create the game with two players, reset game board, allocate X and O to the two players. (X always goes first).
let activeGame = createGame(gameboard, gameboardDisplay, glen, joe)
activeGame.initialiseGame()
console.log(`Game has been initialised. ${activeGame.getXPlayer().name} will play X. ${activeGame.getOPlayer().name} will play O. ${activeGame.getActivePlayer().name} will start.`)






// stage 2 - REPEATED GAME TURN:
while ( activeGame.getGameActive() ) {

  // stage 2A - CHECK PLAYER SELECTION
  let chosenPosition
  do {
    chosenPosition = Math.floor(Math.random()*8.99)
  } while ( !activeGame.checkPlayerSelection(chosenPosition) )

  // stage 2b - PROCESS PLAYER SELECTION
  activeGame.addPlayerSelection(chosenPosition,activeGame.getActiveMark())

  //boardDisplay.updatePositionDisplay(chosenPosition,activeGame.getActiveMark())

  //gameboard.updatePosition(chosenPosition,activeGame.getActiveMark())
  //console.log(`${activeGame.getActiveMark()} takes position ${chosenPosition}`)
  //console.table(gameboard.state)
  //console.log(`Current game status is ${gameboard.gameStatus()}`)

  // stage 2c - CHECK IF GAME IS OVER
  if (activeGame.checkGameStatus() === "xWin" || activeGame.checkGameStatus() === "oWin" || activeGame.checkGameStatus() === "tie") {

    // if game over, end game
    activeGame.endGame(activeGame.checkGameStatus())  

  } else {

    // if game not over, swap player and continue
    activeGame.swapPlayer()

  }

    // PROCESS ROUND END

}

// stage 3 - communicate game result and add wins to player if appropriate

console.log(`Game result is ${activeGame.checkGameStatus()}`)

if (activeGame.checkGameStatus() === "xWin" || activeGame.checkGameStatus() === "oWin") {
  let gameWinner = activeGame.getGameWinner()
  gameWinner.addWin()
  console.log(`Win added for ${activeGame.getGameWinner().name}`)
}

