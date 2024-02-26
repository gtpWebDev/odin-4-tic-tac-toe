console.log("Test")


// GAMEBOARD

// we will create a 3x3 array or an array of 9 spaces
// will then initialise the board as all empty
// each board space will have 3 possible states - empty, X or O

// PLAYERS

// store the name and whether they're playing X or O


// GAMELOGIC

/*

  STEP 1: COLlECT 2 PLAYERS

  STEP 2: ASSIGN X AND O TO PLAYERS. X ALWAYS STARTS

  STEP N: GAME TURN:
    - DETERMINE ACTIVE PLAYER
    - USER SELECTS BOARD POSITION
    - GAME BOARD UPDATED FOR SELECTION
    - CHECK WIN CONDITIONS - DIRECT TO WIN OR ANOTHER GAME TURN

  END GAME WHEN WON



  STEP 3: WIN - COMMUNICATE IT, ETC.

*/

// IIFE module pattern
const gameboard = (function() {

  const state = []

  const reset = () => {
    for (let i = 0; i < 9; i++) {
      state[i] = 0
    }
  }

  const update = ( position, updateTo ) => { state[position] = updateTo }

  return { state, reset, update }

})()


gameboard.reset()

gameboard.update(2,1)
gameboard.update(3,-1)
gameboard.update(4,1)

//gameboard.reset()
console.table(gameboard.state)

