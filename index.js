







// Invokes a single instance of a gameboard object immediately
// contains in-built functionality of reporting on all positions on game board, updating and resetting gameboard, and identifying game status - has anybody won yet, etc.
const gameboard = (function() {

  function checkMatch(value, pos1, pos2, pos3) {
    if (state[pos1] === value && state[pos2] === value && state[pos3] === value) {
      return true
    } else {
      return false
    }
  }

  const state = []

  const reset = () => {
    for (let i = 0; i < 9; i++) {
      state[i] = ""
    }
  }

  const update = ( position, updateTo ) => { state[position] = updateTo }

  
  const gameStatus = () => {
    // 1. any win condition met - "xWin" or "oWin"
    // 2. win condition not met but board full - "tie"
    // 3. win condition not met and tie condition not met - "ongoing"
    if ( checkMatch("X",0,1,2) || checkMatch("X",3,4,5) || checkMatch("X",6,7,8) || checkMatch("X",0,3,6) ||
         checkMatch("X",1,4,7) || checkMatch("X",2,5,8) || checkMatch("X",0,4,8) || checkMatch("X",2,4,6)
    ) {
      return "xWin";
    } else if ( checkMatch("O",0,1,2) || checkMatch("O",3,4,5) || checkMatch("O",6,7,8) || checkMatch("O",0,3,6) ||
                checkMatch("O",1,4,7) || checkMatch("O",2,5,8) || checkMatch("O",0,4,8) || checkMatch("O",2,4,6)
    ) {
      return "oWin"
    } else if (!state.includes("")) {
      return "tie"
    } else {
      return "ongoing"
    }
  }

  return { state, reset, update, gameStatus }

})()




// Factory function to set up people, who will be a pool of people that are eligible to play the game
const createPerson = function (name) {

  let nickname = ""
  let totalWins = 0

  const addNickname = (newName) => { nickname = newName }
  const getNickname = () => nickname
  const addWin = () => totalWins++
  const getWins = () => totalWins

  return { name, getNickname, addNickname, addWin, getWins }

}


// GAMELOGIC

/*
  STEP 1: COLLECT 2 PLAYERS

  STEP 2: ASSIGN X AND O TO PLAYERS. X ALWAYS STARTS

  STEP N: GAME TURN:
    - DETERMINE ACTIVE PLAYER
    - USER SELECTS BOARD POSITION
    - GAME BOARD UPDATED FOR SELECTION
    - CHECK WIN CONDITIONS - DIRECT TO WIN OR ANOTHER GAME TURN

  END GAME WHEN WON

  STEP 3: WIN - COMMUNICATE IT, ETC.

*/

const createGame = function(player1, player2) {
  
  let xPlayer
  let oPlayer
  let activePlayer
  let activeMark // X or O
  let gameWinner = "None"
  let gameActive = false // whether game is active or not


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
        console.log("xWin, gameWinner assigned `xPlayer`");
        break;
      case "oWin":
        gameWinner = oPlayer;
        console.log("oWin, gameWinner assigned `oPlayer`");
        break;
      case "tie":
        gameWinner = "None";
        console.log(`gameWinner should be "none": ${gameWinner}`);
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
  
  return { player1, player2, initialiseGame, getXPlayer, getOPlayer, getActiveMark, getActivePlayer, swapPlayer, getGameActive, endGame, getGameWinner }

}


// CONSOLE GAME TESTING

// stage 0 - CREATE PLAYERS - create players who are eligible to play

const glen = createPerson("Glen"); glen.addNickname("The Bulldozer")
console.log(`${glen.name}, otherwise known as ${glen.getNickname()}, is eligible to play, and has won ${glen.getWins()} games.`)

const joe = createPerson("Joe"); joe.addNickname("Old Hopeless")
console.log(`${joe.name}, otherwise known as ${joe.getNickname()}, is eligible to play, and has won ${joe.getWins()} games.`)

// stage 1 - GAME PREPARATION - create the game with two players, reset game board, allocate X and O to the two players. (X always goes first).

for (let i = 0; i<10; i++) {

    let activeGame = createGame(glen,joe)
    activeGame.initialiseGame()
    gameboard.reset()
    console.log(`Game has been initialised. ${activeGame.getXPlayer().name} will play X. ${activeGame.getOPlayer().name} will play O. ${activeGame.getActivePlayer().name} will start.`)

    // stage 2 - GAME TURN:
    while ( activeGame.getGameActive() ) {
      // stage 2a - receive position from active player, check valid, repeat until valid

      let validChoice = false
      let chosenPosition
      while ( validChoice === false ) {
        chosenPosition = Math.floor(Math.random()*8.99)
        
        if (gameboard.state[chosenPosition] === "") {
          validChoice = true
        }
      }

      // stage 2b - update board with choice, check board game status for win / tie / ongoing

      
      gameboard.update(chosenPosition,activeGame.getActiveMark())
      //console.log(`${activeGame.getActiveMark()} takes position ${chosenPosition}`)
      //console.table(gameboard.state)
      //console.log(`Current game status is ${gameboard.gameStatus()}`)

      // stage 2c - check whether game over or not
      if (gameboard.gameStatus() === "xWin" || gameboard.gameStatus() === "oWin" || gameboard.gameStatus() === "tie") {

        // if game over, end game
        activeGame.endGame(gameboard.gameStatus())  

      } else {

        // if game not over, swap player and continue
        activeGame.swapPlayer()

      }

    }

    // stage 3 - communicate game result and add wins to player if appropriate
    
    console.log(`Game result is ${gameboard.gameStatus()}`)

    if (gameboard.gameStatus() === "xWin" || gameboard.gameStatus() === "oWin") {
      let gameWinner = activeGame.getGameWinner()
      gameWinner.addWin()
      console.log(`Win added for ${activeGame.getGameWinner().name}`)
    }

  }

  console.log(`Final score for 10 rounds is Glen: ${glen.getWins()}, Joe: ${joe.getWins()}`)
      
